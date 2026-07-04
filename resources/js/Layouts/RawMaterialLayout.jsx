import {
    Search,
    ChevronDown,
    LayoutDashboard,
    LogOut,
    ShoppingCart,
} from "lucide-react";

import { Link, } from "@inertiajs/react";
import { Menu } from "@headlessui/react";
import { usePage } from "@inertiajs/react";

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
        <div className="bg-gray-100 h-screen overflow-hidden">

            {/* ================= NAVBAR ================= */}

            {showHeader && (
                <header className="bg-[#090909] border-b border-neutral-800">

                    <div className="max-w-7xl mx-auto h-16 px-8 flex items-center justify-between">

                        {/* LEFT: LOGO */}
                        <Link
                            href="/manager/dashboard"
                            className="flex items-center gap-3"
                        >
                            <svg
                                className="w-7 h-7 text-amber-500"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10"
                                />
                            </svg>

                            <div>
                                <h1 className="text-white text-lg font-semibold">
                                    A' Arfeels
                                </h1>
                                <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400">
                                    Trading
                                </p>
                            </div>
                        </Link>


                        {/* RIGHT SIDE */}
                        <div className="flex items-center gap-6">

                            {/* 🛒 CART BUTTON */}
                            <Link href="/manager/cart" className="relative text-white">
                                <ShoppingCart size={20} />

                                {managerCartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-2 rounded-full">
                                        {managerCartCount}
                                    </span>
                                )}
                            </Link>

                            {/* MANAGER DROPDOWN */}
                            <Menu as="div" className="relative">

                                <Menu.Button className="flex items-center gap-2 text-white hover:text-amber-500">
                                    <span>Manager</span>
                                    <ChevronDown size={18} />
                                </Menu.Button>

                                <Menu.Items className="absolute right-0 mt-3 w-52 bg-white rounded-lg shadow-xl border py-2 z-50">

                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link
                                                href="/manager/dashboard"
                                                className={`flex items-center gap-3 px-4 py-3 ${active ? "bg-amber-50 text-amber-600" : "text-gray-700"
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
                                                className={`w-full text-left flex items-center gap-3 px-4 py-3 ${active ? "bg-red-50 text-red-600" : "text-gray-700"
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

            {/* ================= PAGE ================= */}
            <div className="h-[calc(100vh-64px)] p-6">

                <div className="grid grid-cols-12 gap-6 h-full">

                    {/* ================= LEFT SIDEBAR ================= */}
                    {showSidebar && (
                        <div className="col-span-3">

                            <div className="sticky top-6 space-y-6">

                                {/* Filters */}
                                <div className="bg-white rounded-xl border shadow-sm p-4">

                                    <h2 className="text-xl font-bold text-gray-900 mb-5">
                                        Filters
                                    </h2>

                                    <div className="space-y-4">

                                        {/* Search */}
                                        <div>

                                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                                Search
                                            </label>

                                            <div className="relative">

                                                <Search
                                                    size={18}
                                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                                                />

                                                <input
                                                    type="text"
                                                    value={search}
                                                    onChange={(e) => setSearch(e.target.value)}
                                                    placeholder="Enter material name"
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                                />

                                            </div>

                                        </div>

                                        {/* Category */}
                                        <div>

                                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                                Category
                                            </label>

                                            <select
                                                value={category}
                                                onChange={(e) => setCategory(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                            >

                                                <option value="">
                                                    All Categories
                                                </option>

                                                {categories.map((cat) => (
                                                    <option key={cat.id} value={cat.id}>
                                                        {cat.raw_category_name}
                                                    </option>
                                                ))}

                                            </select>

                                        </div>

                                        {/* Supplier */}
                                        <div>

                                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                                Supplier
                                            </label>

                                            <select
                                                value={supplier}
                                                onChange={(e) => setSupplier(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                            >

                                                <option value="">
                                                    All Suppliers
                                                </option>

                                                {suppliers.map((sup) => (
                                                    <option key={sup.id} value={sup.id}>
                                                        {sup.company_name}
                                                    </option>
                                                ))}

                                            </select>

                                        </div>

                                        {/* Button */}
                                        <button
                                            onClick={applyFilters}
                                            disabled={loading}
                                            className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white py-3 rounded-xl font-semibold transition"
                                        >
                                            {loading ? "Loading..." : "Apply Filters"}
                                        </button>

                                    </div>

                                </div>

                            </div>

                        </div>
                    )}


                    {/* ================= RIGHT CONTENT ================= */}

                    <div className="col-span-9 overflow-y-auto h-full pr-2">
                        {children}
                    </div>
                </div>

            </div>
        </div >

    );
}
