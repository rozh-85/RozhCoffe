
import React, { useState, useEffect } from 'react';
import Header from '../components/Header.tsx';
import CategorySelector from '../components/CategorySelector.tsx';
import ProductCard from '../components/ProductCard.tsx';
import ProductModal from '../components/ProductModal.tsx';
import { supabase } from '../supabaseClient.ts';
import { Product, MenuCategory } from '../types.ts';

const Storefront: React.FC = () => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [menuData, setMenuData] = useState<MenuCategory[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [errorState, setErrorState] = useState<string | null>(null);
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        if (isDarkMode) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
    }, [isDarkMode]);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 400);

            // Update active category based on scroll position
            const sections = menuData.map(cat => document.getElementById(`section-${cat.id}`));
            for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i];
                if (section && section.getBoundingClientRect().top < 200) {
                    setActiveCategory(menuData[i].id);
                    break;
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [menuData]);

    useEffect(() => {
        const loadMenu = async () => {
            try {
                const { data: categories, error } = await supabase
                    .from('categories')
                    .select(`
            id,
            name,
            image_url,
            products (
              id,
              name,
              description,
              image_url,
              is_available,
              product_prices (
                size,
                price_value
              )
            )
          `)
                    .order('name');

                if (error) throw error;

                if (categories) {
                    const formattedData: MenuCategory[] = categories.map(cat => ({
                        id: String(cat.id),
                        name: cat.name,
                        image_url: cat.image_url || '',
                        products: (cat.products || [])
                            .filter((p: any) => p.is_available)
                            .map((prod: any) => ({
                                id: String(prod.id),
                                name: prod.name,
                                description: prod.description || '',
                                image_url: prod.image_url || '',
                                category_id: String(cat.id),
                                is_available: true,
                                isMultiPriced: (prod.product_prices || []).length > 1,
                                prices: (prod.product_prices || []).map((p: any) => ({
                                    size: p.size,
                                    price_value: p.price_value
                                }))
                            }))
                    }));

                    setMenuData(formattedData);
                    if (formattedData.length > 0) {
                        setActiveCategory(formattedData[0].id);
                    }
                }
            } catch (err: any) {
                console.error("Supabase Error Details:", err);
                setErrorState(err.message || "Failed to load menu data.");
            } finally {
                setLoading(false);
            }
        };

        loadMenu();
    }, []);

    const scrollToCategory = (categoryId: string) => {
        const element = document.getElementById(`section-${categoryId}`);
        if (element) {
            const headerOffset = 160;
            const offsetPosition = element.getBoundingClientRect().top + window.pageYOffset - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            setActiveCategory(categoryId);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-primary font-medium animate-pulse tracking-widest uppercase text-xs">Loading Menu</p>
                </div>
            </div>
        );
    }

    if (errorState) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-red-500/10 border border-red-500/20 rounded-3xl p-8 text-center">
                    <span className="material-icons-round text-red-500 text-5xl mb-4">error_outline</span>
                    <h2 className="text-white text-xl font-bold mb-2">Connection Error</h2>
                    <p className="text-zinc-400 text-sm mb-6">{errorState}</p>
                    <button onClick={() => window.location.reload()} className="bg-primary text-black font-bold px-6 py-2 rounded-xl">Retry</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-300">
            <Header isDarkMode={isDarkMode} onToggleTheme={() => setIsDarkMode(!isDarkMode)} />

            {menuData.length > 0 && (
                <div className="sticky top-[64px] z-40 bg-background-light dark:bg-background-dark pb-4 pt-2">
                    <div className="max-w-4xl mx-auto px-4">
                        <CategorySelector
                            categories={menuData.map(c => ({
                                id: c.id,
                                name: c.name,
                                itemCount: c.products.length,
                                image_url: c.image_url || ''
                            }))}
                            selectedCategoryId={String(activeCategory)}
                            onSelectCategory={(id) => scrollToCategory(id)}
                        />
                    </div>
                </div>
            )}

            <main className="max-w-4xl mx-auto px-4 py-6 space-y-12 pb-24">
                {menuData.map((category) => (
                    <section key={category.id} id={`section-${category.id}`} className="scroll-mt-40">
                        <div className="flex items-center mb-6">
                            <div className="h-8 w-1.5 bg-primary rounded-full mr-3 shadow-[0_0_12px_rgba(252,198,36,0.6)]"></div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-none">{category.name}</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                            {category.products.map((product: Product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onClick={() => setSelectedProduct(product)}
                                />
                            ))}
                        </div>
                    </section>
                ))}
            </main>

            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 bg-primary text-black w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-90 z-[60] group"
                >
                    <span className="material-icons-round text-3xl group-hover:-translate-y-1 transition-transform">arrow_upward</span>
                </button>
            )}

            {selectedProduct && (
                <ProductModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}

            <footer className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-400 dark:text-zinc-600 text-sm border-t border-zinc-800/50 mt-12">
                <span className="font-display text-4xl text-primary opacity-50 block mb-2">Rozh</span>
                <p className="font-medium">The Art of Sweetness</p>
            </footer>
        </div>
    );
};

export default Storefront;
