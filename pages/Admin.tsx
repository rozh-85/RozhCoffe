
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient.ts';
import { Product, Category, MenuCategory } from '../types.ts';
import { Link } from 'react-router-dom';

const Admin: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [groupedData, setGroupedData] = useState<MenuCategory[]>([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState<'categories' | 'products'>('categories');

    // Form states
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // Category form
    const [catName, setCatName] = useState('');
    const [catImage, setCatImage] = useState<File | null>(null);

    // Product form
    const [prodName, setProdName] = useState('');
    const [prodDesc, setProdDesc] = useState('');
    const [prodCatId, setProdCatId] = useState('');
    const [prodImage, setProdImage] = useState<File | null>(null);
    const [prodPrices, setProdPrices] = useState<{ size: string, price: string }[]>([{ size: '', price: '' }]);
    const [isMultiPriced, setIsMultiPriced] = useState(true);

    // Toast state
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' | 'warning' } | null>(null);
    // Confirm modal state
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean,
        title: string,
        message: string,
        onConfirm: () => void,
        isDestructive?: boolean
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
    });

    const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 2500);
    };

    const handleConfirm = (title: string, message: string, onConfirm: () => void, isDestructive = false) => {
        setConfirmModal({
            isOpen: true,
            title,
            message,
            onConfirm: () => {
                onConfirm();
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
            },
            isDestructive
        });
    };

    const [imgErrors, setImgErrors] = useState<Set<string>>(new Set());

    const handleImageError = (id: string) => {
        setImgErrors(prev => {
            const newSet = new Set(prev);
            newSet.add(id);
            return newSet;
        });
    };

    useEffect(() => {
        // Initial load only
        const init = async () => {
            await fetchData();
            setInitialLoading(false);
        };
        init();
    }, []);

    const fetchData = async () => {
        setRefreshing(true);
        // Clear image errors on refresh so we try loading them again
        setImgErrors(new Set());
        try {
            const { data: cats, error: catError } = await supabase.from('categories').select('*').order('name');
            const { data: prods, error: prodError } = await supabase.from('products').select('*, product_prices(*)').order('name');

            if (catError) throw catError;
            if (prodError) throw prodError;

            setCategories(cats || []);

            const formattedProds: Product[] = (prods || []).map(p => ({
                id: String(p.id),
                name: p.name,
                description: p.description || '',
                image_url: p.image_url || '',
                category_id: String(p.category_id),
                is_available: p.is_available,
                prices: (p.product_prices || []).map((pr: any) => ({
                    size: pr.size,
                    price_value: pr.price_value
                })),
                isMultiPriced: (p.product_prices || []).length > 1
            }));

            setProducts(formattedProds);

            const grouped = (cats || []).map(cat => ({
                id: String(cat.id),
                name: cat.name,
                image_url: cat.image_url || '',
                products: formattedProds.filter(p => p.category_id === String(cat.id))
            }));

            setGroupedData(grouped);
        } catch (err: any) {
            console.error("Fetch Error:", err);
            showToast("Failed to load data", 'error');
        } finally {
            setRefreshing(false);
        }
    };

    const handleUploadImage = async (file: File, folder: string) => {
        try {
            // Clean file name to avoid path issues
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const path = `${folder}/${fileName}`;

            const { error: uploadError } = await supabase.storage.from('product-images').upload(path, file);
            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('product-images').getPublicUrl(path);
            return data.publicUrl;
        } catch (err: any) {
            console.error("Upload Error:", err);
            throw new Error(`Upload failed: ${err.message || 'Check storage permissions'}`);
        }
    };

    // Category CRUD
    const handleSaveCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!editingCategory && !catImage) {
                throw new Error("Please select an image for the category.");
            }

            let imageUrl = editingCategory?.image_url || '';
            if (catImage) {
                imageUrl = await handleUploadImage(catImage, 'cats');
            }

            if (editingCategory) {
                const { error } = await supabase.from('categories').update({
                    name: catName,
                    image_url: imageUrl
                }).eq('id', editingCategory.id);
                if (error) throw error;
                showToast(`Category updated: ${catName}`, 'success');
            } else {
                const { error } = await supabase.from('categories').insert([{
                    name: catName,
                    image_url: imageUrl
                }]);
                if (error) throw error;
                showToast(`Category saved: ${catName}`, 'success');
            }

            resetCatForm();
            await fetchData();
        } catch (err: any) {
            console.error("Save Category Error:", err);
            showToast(err.message || "Error saving category", 'error');
        }
    };

    const startEditCategory = (cat: Category) => {
        setEditingCategory(cat);
        setCatName(cat.name);
        setCatImage(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteCategory = async (id: string) => {
        handleConfirm(
            "Delete Category?",
            "This will permanently delete this category and ALL products inside it. Continue?",
            async () => {
                try {
                    // 1. Get all product IDs in this category
                    const { data: prods } = await supabase.from('products').select('id').eq('category_id', id);
                    const prodIds = prods?.map(p => p.id) || [];

                    if (prodIds.length > 0) {
                        // 2. Delete prices for all these products
                        await supabase.from('product_prices').delete().in('product_id', prodIds);
                        // 3. Delete the products
                        await supabase.from('products').delete().in('id', prodIds);
                    }

                    // 4. Finally delete the category
                    const { error } = await supabase.from('categories').delete().eq('id', id);
                    if (error) throw error;

                    showToast("Category deleted", 'warning');
                    await fetchData();
                } catch (err: any) {
                    console.error("Delete Category Error:", err);
                    showToast("Error: Could not delete category", 'error');
                }
            },
            true
        );
    };

    const resetCatForm = () => {
        setEditingCategory(null);
        setCatName('');
        setCatImage(null);
    };

    // Product CRUD
    const handleAddPrice = () => setProdPrices([...prodPrices, { size: '', price: '' }]);
    const handleRemovePrice = (index: number) => {
        if (prodPrices.length > 1) {
            setProdPrices(prodPrices.filter((_, i) => i !== index));
        }
    };

    const handleSaveProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let imageUrl = editingProduct?.image_url || '';
            if (prodImage) {
                imageUrl = await handleUploadImage(prodImage, 'products');
            }

            let prodId;
            if (editingProduct) {
                const { error: updateError } = await supabase.from('products').update({
                    name: prodName,
                    description: prodDesc,
                    category_id: prodCatId,
                    image_url: imageUrl
                }).eq('id', editingProduct.id);

                if (updateError) throw updateError;

                // Important: Clear existing prices before adding new ones
                const { error: deleteError } = await supabase.from('product_prices').delete().eq('product_id', editingProduct.id);
                if (deleteError) throw deleteError;

                prodId = editingProduct.id;
                showToast(`Product updated: ${prodName}`, 'success');
            } else {
                const { data, error: insertError } = await supabase.from('products').insert([{
                    name: prodName,
                    description: prodDesc,
                    category_id: prodCatId,
                    image_url: imageUrl
                }]).select('id').single();

                if (insertError) throw insertError;
                if (!data) throw new Error("Insert failed, no data returned.");
                prodId = data.id;
                showToast(`Product saved: ${prodName}`, 'success');
            }

            // Extract numeric price and format it
            const cleanPrices = isMultiPriced
                ? prodPrices.filter(p => p.size && p.price)
                : [{ size: 'Price', price: prodPrices[0]?.price || '0' }];

            const priceInserts = cleanPrices.map(p => {
                const rawPrice = String(p.price).replace(/[^\d]/g, '');
                return {
                    product_id: prodId,
                    size: p.size,
                    price_value: `IQD ${Number(rawPrice).toLocaleString()}`
                };
            });

            if (priceInserts.length > 0) {
                const { error: priceError } = await supabase.from('product_prices').insert(priceInserts);
                if (priceError) throw priceError;
            }

            resetProdForm();
            await fetchData();
        } catch (err: any) {
            console.error("Save Product Error:", err);
            showToast(err.message || "Error saving product", 'error');
        }
    };

    const startEditProduct = (prod: Product) => {
        setEditingProduct(prod);
        setProdName(prod.name);
        setProdDesc(prod.description);
        setProdCatId(prod.category_id);
        setIsMultiPriced(prod.prices.length > 1);
        setProdPrices(prod.prices.map(p => ({
            size: p.size,
            price: p.price_value.replace(/[^\d]/g, '')
        })));
        if (prod.prices.length === 0) setProdPrices([{ size: '', price: '' }]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteProduct = async (id: string) => {
        handleConfirm(
            "Delete Product?",
            "Are you sure you want to remove this item?",
            async () => {
                try {
                    // Delete associated prices first to avoid constraint issues
                    await supabase.from('product_prices').delete().eq('product_id', id);
                    const { error } = await supabase.from('products').delete().eq('id', id);
                    if (error) throw error;
                    showToast("Product deleted", 'warning');
                    await fetchData();
                } catch (err: any) {
                    console.error("Delete Product Error:", err);
                    showToast("Delete failed", 'error');
                }
            },
            true
        );
    };

    const resetProdForm = () => {
        setEditingProduct(null);
        setProdName('');
        setProdDesc('');
        setProdCatId('');
        setProdImage(null);
        setProdPrices([{ size: '', price: '' }]);
        setIsMultiPriced(true);
    };

    if (initialLoading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="bg-zinc-950 text-zinc-100 min-h-screen font-sans antialiased selection:bg-primary/20">
            {/* Toast System - Refined & Centered */}
            {toast && (
                <div className="fixed inset-0 flex items-center justify-center z-[130] pointer-events-none px-4">
                    <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] shadow-[0_30px_60px_-12px_rgba(0,0,0,0.8)] flex flex-col items-center gap-4 animate-in zoom-in-90 fade-in duration-300 pointer-events-auto min-w-[280px] text-center">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${toast.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' :
                            toast.type === 'warning' ? 'bg-amber-500/10 text-amber-500' :
                                'bg-red-500/10 text-red-500'
                            }`}>
                            <span className="material-icons-round text-3xl">
                                {toast.type === 'success' ? 'check_circle' :
                                    toast.type === 'warning' ? 'warning' : 'error'}
                            </span>
                        </div>
                        <div>
                            <p className="font-black text-xl text-white mb-1 tracking-tight">
                                {toast.type === 'success' ? 'Success!' :
                                    toast.type === 'warning' ? 'Notice' : 'Error'}
                            </p>
                            <p className="text-zinc-500 text-sm font-semibold">{toast.message}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Premium Confirm Modal - Exact Match to Image */}
            {confirmModal.isOpen && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center px-4 bg-black/90 animate-in fade-in duration-200">
                    <div className="bg-[#121214] border border-zinc-800/50 p-8 rounded-[2.5rem] max-w-[340px] w-full shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto ${confirmModal.isDestructive ? 'bg-[#2a1a1a] text-[#ff4b4b]' : 'bg-primary/20 text-primary'}`}>
                            <span className="material-icons-round text-3xl">
                                {confirmModal.isDestructive ? 'delete' : 'info'}
                            </span>
                        </div>
                        <h3 className="text-2xl font-black text-center mb-2 text-white tracking-tight">{confirmModal.title}</h3>
                        <p className="text-zinc-500 text-center text-[15px] mb-8 leading-normal font-medium px-4">
                            {confirmModal.message}
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                                className="flex-1 px-6 py-4 rounded-3xl bg-[#202023] hover:bg-[#2a2a2e] text-zinc-100 text-base font-black transition-all active:scale-95"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmModal.onConfirm}
                                className={`flex-1 px-6 py-4 rounded-3xl text-base font-black transition-all text-black active:scale-95 ${confirmModal.isDestructive ? 'bg-[#ff4b4b] hover:bg-[#ff3535]' : 'bg-primary hover:bg-primary/90'}`}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Top bar */}
            <nav className="border-b border-zinc-900 p-4 sticky top-0 bg-zinc-950 z-50">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <h1 className="text-2xl font-black text-primary tracking-tighter">Admin Panel</h1>
                            {refreshing && (
                                <div className="absolute -top-1 -right-4 w-2 h-2 bg-primary rounded-full animate-ping"></div>
                            )}
                        </div>
                        <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white text-[10px] font-black uppercase tracking-widest bg-zinc-900/50 px-4 py-1.5 rounded-full border border-zinc-800 transition-all">
                            <span className="material-icons-round text-xs">open_in_new</span>
                            View Site
                        </Link>
                    </div>
                    <button
                        onClick={() => {
                            localStorage.removeItem('admin_session');
                            window.location.href = '/#/login';
                        }}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all border border-red-500/20"
                        title="Sign Out"
                    >
                        <span>Logout</span>
                        <span className="material-icons-round text-lg">logout</span>
                    </button>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto p-4 md:p-8">
                {/* Tabs */}
                <div className="flex gap-3 mb-6 border-b border-zinc-800">
                    <button
                        onClick={() => setActiveTab('categories')}
                        className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'categories' ? 'border-primary text-white' : 'border-transparent text-zinc-400'}`}
                    >
                        Categories
                    </button>
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'products' ? 'border-primary text-white' : 'border-transparent text-zinc-400'}`}
                    >
                        Products
                    </button>
                </div>

                {/* CATEGORIES PAGE */}
                {activeTab === 'categories' && (
                    <section className="space-y-6 animate-in fade-in duration-300">
                        {/* Add / Edit category */}
                        <section className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 space-y-4">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <span className="material-icons-round text-primary">category</span>
                                {editingCategory ? 'Edit Category' : 'Add Category'}
                            </h2>

                            <form onSubmit={handleSaveCategory} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 uppercase">Name</label>
                                    <input
                                        type="text"
                                        value={catName}
                                        onChange={(e) => setCatName(e.target.value)}
                                        required
                                        className="bg-zinc-800 border-none rounded-xl w-full px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-primary uppercase tracking-wider">
                                        Category Image {editingCategory ? '(Optional to change)' : '(Required)'}
                                    </label>
                                    <div className="relative group">
                                        <input
                                            type="file"
                                            onChange={(e) => setCatImage(e.target.files?.[0] || null)}
                                            accept="image/*"
                                            required={!editingCategory}
                                            className="block w-full text-sm text-zinc-400
                                                file:mr-4 file:py-3 file:px-6 file:rounded-2xl
                                                file:border-0 file:text-sm file:font-black
                                                file:bg-primary file:text-black
                                                hover:file:bg-primary/90 cursor-pointer
                                                bg-zinc-800/50 rounded-2xl border border-zinc-800 p-1"
                                        />
                                        {!catImage && !editingCategory && (
                                            <p className="text-[10px] text-zinc-500 mt-2 ml-1 font-bold italic">* Please upload an image for this category</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        className="bg-primary text-black px-4 py-2 rounded-xl text-sm font-bold flex-1"
                                    >
                                        Save Category
                                    </button>
                                    {editingCategory && (
                                        <button
                                            type="button"
                                            onClick={resetCatForm}
                                            className="bg-zinc-700 text-zinc-100 px-4 py-2 rounded-xl text-sm font-semibold"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </section>

                        {/* Category list */}
                        <section className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 space-y-4">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <span className="material-icons-round text-primary">list</span>
                                Categories
                            </h2>

                            <div className="space-y-2 text-sm">
                                {categories.length === 0 ? (
                                    <p className="text-xs text-zinc-500 text-center py-4">No categories yet.</p>
                                ) : (
                                    categories.map(c => (
                                        <div key={c.id} className="flex items-center gap-3 bg-zinc-800 px-3 py-2 rounded-xl">
                                            <div className="w-12 h-12 rounded-xl bg-zinc-800 overflow-hidden flex-shrink-0 border border-zinc-700 relative flex items-center justify-center">
                                                <span className="material-icons-round text-2xl text-zinc-700 absolute">restaurant_menu</span>
                                                {c.image_url && (
                                                    <img
                                                        src={c.image_url}
                                                        className="w-full h-full object-cover relative z-10"
                                                        alt=""
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).style.display = 'none';
                                                        }}
                                                    />
                                                )}
                                            </div>
                                            <span className="font-bold text-base flex-1 text-white tracking-tight">{c.name}</span>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => startEditCategory(c)}
                                                    className="text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 text-xs"
                                                >
                                                    <span className="material-icons-round text-xs">edit</span>Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCategory(String(c.id))}
                                                    className="text-red-400 hover:text-red-300 inline-flex items-center gap-1 text-xs"
                                                >
                                                    <span className="material-icons-round text-xs">delete</span>Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>
                    </section>
                )}

                {/* PRODUCTS PAGE */}
                {activeTab === 'products' && (
                    <section className="space-y-6 animate-in fade-in duration-300">
                        {/* Add / Edit product */}
                        <section className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 space-y-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <span className="material-icons-round text-primary">add_box</span>
                                {editingProduct ? 'Edit Product' : 'Add Product'}
                            </h2>

                            <form onSubmit={handleSaveProduct} className="grid gap-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-zinc-500 uppercase">Product Name</label>
                                        <input
                                            type="text"
                                            value={prodName}
                                            onChange={(e) => setProdName(e.target.value)}
                                            required
                                            className="bg-zinc-800 border-none rounded-xl w-full px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-zinc-500 uppercase">Category</label>
                                        <select
                                            value={prodCatId}
                                            onChange={(e) => setProdCatId(e.target.value)}
                                            required
                                            className="bg-zinc-800 border-none rounded-xl w-full px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 uppercase">Description</label>
                                    <textarea
                                        value={prodDesc}
                                        onChange={(e) => setProdDesc(e.target.value)}
                                        className="bg-zinc-800 border-none rounded-xl w-full px-4 py-3 h-24 text-sm focus:ring-2 focus:ring-primary outline-none resize-none"
                                    ></textarea>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 uppercase">Image (optional)</label>
                                    <input
                                        type="file"
                                        onChange={(e) => setProdImage(e.target.files?.[0] || null)}
                                        accept="image/*"
                                        className="block w-full text-sm text-zinc-400
                                               file:mr-4 file:py-2 file:px-4 file:rounded-xl
                                               file:border-0 file:text-sm file:font-bold
                                               file:bg-primary file:text-black
                                               hover:file:bg-primary/80 cursor-pointer"
                                    />
                                </div>

                                {/* Toggle multi price */}
                                <div className="flex items-center gap-2">
                                    <input
                                        id="isMulti"
                                        type="checkbox"
                                        checked={isMultiPriced}
                                        onChange={(e) => setIsMultiPriced(e.target.checked)}
                                        className="w-4 h-4 text-primary border-zinc-600 bg-zinc-800 rounded focus:ring-primary"
                                    />
                                    <label htmlFor="isMulti" className="text-xs font-semibold text-zinc-300">
                                        Multi priced (different sizes)
                                    </label>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-zinc-500 uppercase">Pricing</label>
                                    <div className="space-y-2">
                                        {isMultiPriced ? (
                                            prodPrices.map((p, i) => (
                                                <div key={i} className="flex gap-2 animate-in zoom-in-95 duration-200">
                                                    <input
                                                        type="text"
                                                        placeholder="Size (e.g. Small)"
                                                        value={p.size}
                                                        onChange={(e) => {
                                                            const newP = [...prodPrices];
                                                            newP[i].size = e.target.value;
                                                            setProdPrices(newP);
                                                        }}
                                                        className="bg-zinc-800 border-none rounded-xl w-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                                                    />
                                                    <div className="flex items-center gap-1 w-full">
                                                        <span className="text-[11px] text-zinc-400 whitespace-nowrap">IQD</span>
                                                        <input
                                                            type="text"
                                                            placeholder="4000"
                                                            value={p.price}
                                                            onChange={(e) => {
                                                                const newP = [...prodPrices];
                                                                newP[i].price = e.target.value;
                                                                setProdPrices(newP);
                                                            }}
                                                            className="bg-zinc-800 border-none rounded-xl w-full px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                                                        />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemovePrice(i)}
                                                        className="text-zinc-500 p-2 hover:text-red-400"
                                                    >
                                                        <span className="material-icons-round text-sm">remove_circle</span>
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="flex items-center gap-1 w-full animate-in slide-in-from-left-2">
                                                <span className="text-[11px] text-zinc-400 whitespace-nowrap">IQD</span>
                                                <input
                                                    type="text"
                                                    placeholder="Price"
                                                    value={prodPrices[0]?.price || ''}
                                                    onChange={(e) => {
                                                        const newP = [...prodPrices];
                                                        if (newP[0]) newP[0].price = e.target.value;
                                                        else newP.push({ size: 'Price', price: e.target.value });
                                                        setProdPrices(newP);
                                                    }}
                                                    className="bg-zinc-800 border-none rounded-xl w-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    {isMultiPriced && (
                                        <button
                                            type="button"
                                            onClick={handleAddPrice}
                                            className="text-primary text-xs font-bold flex items-center gap-1 hover:underline"
                                        >
                                            <span className="material-icons-round text-sm">add_circle</span>
                                            Add size / price
                                        </button>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        className="bg-primary text-black font-bold py-3 rounded-2xl w-full text-sm hover:scale-[1.01] active:scale-95 transition-transform"
                                    >
                                        Save Product
                                    </button>
                                    {editingProduct && (
                                        <button
                                            type="button"
                                            onClick={resetProdForm}
                                            className="bg-zinc-700 text-zinc-100 px-6 py-3 rounded-2xl text-sm font-semibold"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </section>

                        {/* Product list */}
                        <section className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 space-y-4">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <span className="material-icons-round text-primary">restaurant</span>
                                Products
                            </h2>

                            <div className="space-y-4 text-sm">
                                {groupedData.map(cat => (
                                    <div key={cat.id} className="space-y-2">
                                        <h3 className="text-sm font-bold text-zinc-400 px-1 border-l-2 border-primary ml-1 pl-3">{cat.name}</h3>
                                        <div className="space-y-2">
                                            {cat.products.length === 0 ? (
                                                <p className="text-[10px] text-zinc-600 italic pl-6">No products in this category.</p>
                                            ) : (
                                                cat.products.map(p => (
                                                    <div key={p.id} className="flex justify-between items-center bg-zinc-800 px-3 py-3 rounded-2xl group transition-all hover:bg-zinc-800/80">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-14 h-14 rounded-2xl bg-zinc-800 overflow-hidden flex-shrink-0 border border-zinc-700 relative flex items-center justify-center">
                                                                <span className="material-icons-round text-2xl text-zinc-700 absolute">restaurant_menu</span>
                                                                {p.image_url && (
                                                                    <img
                                                                        src={p.image_url}
                                                                        className="w-full h-full object-cover relative z-10"
                                                                        alt=""
                                                                        onError={(e) => {
                                                                            (e.target as HTMLImageElement).style.display = 'none';
                                                                        }}
                                                                    />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-zinc-100 text-[15px] tracking-tight">{p.name}</div>
                                                                <div className="text-[11px] text-zinc-500 line-clamp-1 max-w-[180px] md:max-w-md">{p.description}</div>
                                                                <div className="text-[11px] text-primary font-black mt-1 tracking-wider">
                                                                    {p.prices.length > 1 ? 'MULTI-PRICED' : (p.prices[0]?.price_value || 'NO PRICE')}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => startEditProduct(p)}
                                                                className="text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 text-xs bg-emerald-400/10 px-3 py-1.5 rounded-xl transition-all"
                                                            >
                                                                <span className="material-icons-round text-xs">edit</span>Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteProduct(String(p.id))}
                                                                className="text-red-400 hover:text-red-300 inline-flex items-center gap-1 text-xs bg-red-400/10 px-3 py-1.5 rounded-xl transition-all"
                                                            >
                                                                <span className="material-icons-round text-xs">delete</span>Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </section>
                )}
            </main>
        </div>
    );
};

export default Admin;
