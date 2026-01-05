
# Rozh Menu - Admin & Storefront

A premium digital menu for Rozh with a high-end admin dashboard.

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Supabase**:
   Update `supabaseClient.ts` with your Supabase URL and Anon Key.

3. **Database Setup**:
   Copy the contents of `schema.sql` and run it in the **Supabase SQL Editor**.

4. **Storage**:
   Ensure you have a public bucket named `product-images` in Supabase Storage.

5. **Run Locally**:
   ```bash
   npm run dev
   ```

## 🔐 Admin Access

The admin dashboard is protected. Access it by navigating to `/#/login`.

- **Email**: `admin@rozh.com`
- **Password**: `rozh2026`

## ✨ Features

- **Storefront**: Smooth scrolling, category selector, product modals, and dark mode.
- **Admin Panel**: 
  - Manage categories and products.
  - Custom premium alerts and center-screen confirmation modals.
  - Multi-pricing support (e.g., Small, Medium, Large).
  - Image uploads directly to Supabase Storage.
- **Authentication & Security**: 
  - Secure login using **JWT (JSON Web Tokens)** for session management.
  - Protected Admin routes that verify token persistence.
  - Row Level Security (RLS) policies for Supabase Storage.

## 🛠 Tech Stack

- **React** (Vite)
- **Tailwind CSS**
- **Supabase** (Database, Auth, Storage)
- **React Router** (HashRouter for easy deployment)
- **Material Icons**
