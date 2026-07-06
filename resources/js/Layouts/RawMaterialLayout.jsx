import {
    Search,
    ChevronDown,
    LayoutDashboard,
    LogOut,
    ShoppingCart,
} from "lucide-react";

import { Link, usePage } from "@inertiajs/react";
import { Menu } from "@headlessui/react";

export default function RawMaterialLayout({
    children,
    categories = [],
    suppliers = [],
    search,
    setSearch,
    category,
    setCategory,
    supplier,
    setSupplier,
    loading,
    applyFilters,
    showHeader = true,
    showSidebar = true,
}) {
    const { managerCartCount } = usePage().props;

    return (
        <div className="min-h-screen bg-[#f6f7fb] flex flex-col">

            {/* ================= NAVBAR ================= */}
            {showHeader && (
                <header className="bg-black border-b border-black/20">
                    <div className="max-w-7xl mx-auto h-16 px-8 flex items-center justify-between">

                        {/* LEFT */}
                        <Link href="/manager/dashboard" className="flex items-center gap-3">
                            <svg className="w-7 h-7 text-amber-500" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10" />
                            </svg>

                            <div>
                                <h1 className="text-white text-lg font-semibold">A' Arfeels</h1>
                                <p className="text-[10px] uppercase tracking-[0.25em] text-white/60">
                                    Trading
                                </p>
                            </div>
                        </Link>

                        {/* RIGHT */}
                        <div className="flex items-center gap-6">
                            <Link href="/manager/cart" className="relative text-white">
                                <ShoppingCart size={20} />
                                {managerCartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-2 rounded-full">
                                        {managerCartCount}
                                    </span>
                                )}
                            </Link>

                            <Menu as="div" className="relative">
                                <Menu.Button className="flex items-center gap-2 text-white hover:text-amber-400">
                                    <span>Manager</span>
                                    <ChevronDown size={18} />
                                </Menu.Button>

                                <Menu.Items className="absolute right-0 mt-3 w-52 bg-white rounded-lg shadow-xl border py-2 z-50">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link
                                                href="/manager/dashboard"
                                                className={`flex items-center gap-3 px-4 py-3 ${active ? "bg-amber-50 text-black" : "text-black"
                                                    }`}
                                            >
                                                <LayoutDashboard size={18} />
                                                Dashboard
                                            </Link>
                                        )}
                                    </Menu.Item>

                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link
                                                href={route("logout")}
                                                method="post"
                                                as="button"
                                                className={`w-full text-left flex items-center gap-3 px-4 py-3 ${active ? "bg-red-50 text-black" : "text-black"
                                                    }`}
                                            >
                                                <LogOut size={18} />
                                                Logout
                                            </Link>
                                        )}
                                    </Menu.Item>
                                </Menu.Items>
                            </Menu>
                        </div>
                    </div>
                </header>
            )}

            {/* ================= CONTENT WRAPPER ================= */}

            {/* ================= CONTENT ================= */}
            <div className="flex-1 p-6">
                {showSidebar ? (
                    <div className="grid grid-cols-12 gap-6">
                        {/* SIDEBAR */}
                        <div className="col-span-3">
                            <div className="sticky top-6 space-y-6">
                                <div className="bg-white rounded-xl border shadow-sm p-4">
                                    <h2 className="text-xl font-bold text-black mb-5">
                                        Filters
                                    </h2>

                                    {/* SEARCH */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-semibold mb-2 text-black">
                                            Search
                                        </label>

                                        <div className="relative">
                                            <Search className="absolute left-3 top-3 text-black" size={18} />

                                            <input
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                                placeholder="Search raw materials..."
                                                className="w-full pl-10 py-3 border rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-black"
                                            />
                                        </div>
                                    </div>

                                    {/* CATEGORY */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-semibold mb-2 text-black">
                                            Category
                                        </label>

                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="w-full py-3 border rounded-xl text-black bg-white focus:outline-none focus:ring-2 focus:ring-black"
                                        >
                                            <option value="">All Categories</option>
                                            {categories.map((c) => (
                                                <option key={c.id} value={c.id}>
                                                    {c.raw_category_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* SUPPLIER */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-semibold mb-2 text-black">
                                            Supplier
                                        </label>

                                        <select
                                            value={supplier}
                                            onChange={(e) => setSupplier(e.target.value)}
                                            className="w-full py-3 border rounded-xl text-black bg-white focus:outline-none focus:ring-2 focus:ring-black"
                                        >
                                            <option value="">All Suppliers</option>
                                            {suppliers.map((s) => (
                                                <option key={s.id} value={s.id}>
                                                    {s.company_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <button
                                        onClick={applyFilters}
                                        disabled={loading}
                                        className="w-full bg-black text-white py-3 rounded-xl hover:opacity-80 transition"
                                    >
                                        Apply Filters
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* MAIN */}
                        <div className="col-span-9">
                            {children}
                        </div>
                    </div>
                ) : (
                    /* ✅ CART / FULL WIDTH MODE */
                    <div className="max-w-6xl mx-auto">
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
}
