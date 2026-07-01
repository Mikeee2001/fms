import { Head } from "@inertiajs/react";
import { Search, Filter, AlertTriangle, Package, CheckCircle, ArrowUpDown, Plus, Download } from "lucide-react";

export default function Index({ materials }) {
    return (
        <div className="min-h-screen bg-stone-50">
            <Head title="Raw Materials" />

            {/* Top Toolbar */}
            <header className="bg-white border-b border-stone-200 px-8 py-4 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-stone-900">Inventory Catalog</h1>
                    <p className="text-sm text-stone-500">Monitor stock levels and manage procurement</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-semibold hover:bg-stone-50">
                        <Download size={16} /> Export Report
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-semibold hover:bg-amber-700">
                        <Plus size={16} /> New Material
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
                {/* Sidebar Filters */}
                <aside className="w-64 flex-shrink-0 space-y-8">
                    <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                        <h2 className="font-bold text-stone-900 mb-6 flex items-center gap-2">
                            <Filter size={18} /> Filters
                        </h2>

                        <div className="space-y-8">
                            {/* Stock Alert Filter */}
                            <div className="space-y-3">
                                <label className="text-xs font-bold uppercase text-stone-400">Stock Status</label>
                                <label className="flex items-center gap-2 text-sm text-amber-700 font-medium cursor-pointer">
                                    <input type="checkbox" className="rounded text-amber-600" />
                                    <AlertTriangle size={16} /> Needs Reorder
                                </label>
                                <label className="flex items-center gap-2 text-sm text-green-700 font-medium cursor-pointer">
                                    <input type="checkbox" className="rounded text-green-600" />
                                    <CheckCircle size={16} /> In Stock
                                </label>
                            </div>

                            {/* Category Filter */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-stone-400">Category</label>
                                {['Wood', 'Hardware', 'Fabric', 'Foam'].map(cat => (
                                    <label key={cat} className="flex items-center gap-2 text-sm text-stone-600 cursor-pointer">
                                        <input type="checkbox" className="rounded text-stone-600" /> {cat}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Content Area */}
                <section className="flex-1">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-sm text-stone-500">Showing {materials.length} items</span>
                        <button className="flex items-center gap-2 text-sm font-semibold text-stone-700">
                            Sort by <ArrowUpDown size={14} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {materials.map((m) => (
                            <div key={m.id} className="bg-white p-5 rounded-xl border border-stone-200 hover:shadow-md transition-shadow relative">
                                {/* Conditional Badge for Low Stock */}
                                {m.stock_level < 10 && (
                                    <div className="absolute top-4 right-4">
                                        <span className="flex items-center gap-1 text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                                            <AlertTriangle size={12} /> LOW STOCK
                                        </span>
                                    </div>
                                )}

                                <div className="p-2 bg-stone-100 rounded-lg w-fit mb-4">
                                    <Package size={20} className="text-stone-400" />
                                </div>

                                <h3 className="font-bold text-stone-900">{m.material_name}</h3>
                                <div className="mt-4 flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] text-stone-400 font-bold uppercase">Price</p>
                                        <span className="text-lg font-bold text-amber-600">₱{m.purchase_price}</span>
                                    </div>
                                    <button className="text-xs font-bold text-stone-900 hover:text-amber-600 underline">DETAILS</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
