import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';


export default function Index({ materials, stats }) {

    const getStockBadge = (material) => {
        if (material.stock <= 0) {
            return { text: 'Out of Stock', className: 'bg-red-900/30 text-red-400 border border-red-700' };
        } else if (material.stock <= material.minimum_stock) {
            return { text: 'Low Stock', className: 'bg-yellow-900/30 text-yellow-400 border border-yellow-700' };
        } else {
            return { text: 'In Stock', className: 'bg-emerald-900/30 text-emerald-400 border border-emerald-700' };
        }
    };

    return (
        <AdminLayout>
            <Head title="Inventory Management" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-semibold text-white mb-3">
                                Inventory Management
                            </h1>

                            <p className="text-stone-400 mt-1">
                                💡 <span className="text-amber-500 mr-2">Inventory Overview:</span>
                                <span>
                                    Displays current raw material inventory from suppliers.
                                    Suppliers update stock and prices, managers monitor levels and coordinate replenishment,
                                    while Admin oversees records and stock movements.
                                </span>
                            </p>
                        </div>

                        <div className="flex gap-3">

                            <Link
                                href={route('admin.materials.logs')}
                                className="px-4 py-2 border border-stone-700 rounded-md text-stone-300 hover:bg-stone-800"
                            >
                                Stock Logs
                            </Link>

                            <Link
                                href={route('admin.materials.archived')}
                                className="px-4 py-2 border border-stone-700 rounded-md text-stone-300 hover:bg-stone-800"
                            >
                                Archived Materials
                            </Link>

                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-black border border-stone-800 rounded-lg p-4">
                            <p className="text-stone-400 text-sm">Total Inventory Items</p>
                            <p className="text-2xl font-bold text-white">{stats.total_materials}</p>
                        </div>
                        <div className="bg-black border border-stone-800 rounded-lg p-4">
                            <p className="text-stone-400 text-sm">Low Inventory</p>
                            <p className="text-2xl font-bold text-yellow-400">{stats.low_stock}</p>
                        </div>
                        <div className="bg-black border border-stone-800 rounded-lg p-4">
                            <p className="text-stone-400 text-sm">Out of Stock</p>
                            <p className="text-2xl font-bold text-red-400">{stats.out_of_stock}</p>
                        </div>
                        <div className="bg-black border border-stone-800 rounded-lg p-4">
                            <p className="text-stone-400 text-sm">Total Inventory Value</p>
                            <p className="text-2xl font-bold text-amber-400">₱{stats.total_value?.toLocaleString() || 0}</p>
                        </div>
                    </div>

                    {/* Removed the View Stock Logs link from here */}
                    <div className="mb-4">
                        <p className="text-sm text-stone-400">
                            💡 Note:
                            This page provides an overview of all materials supplied by registered suppliers.
                            Inventory levels are updated by suppliers, while managers use this information to create purchase requests when stock becomes low.
                        </p>
                    </div>

                    <div className="bg-black border border-stone-800 rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-stone-800">
                                <thead className="bg-stone-900">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-stone-400">Inventory Item</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-stone-400">Category</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-stone-400">Supplier</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-stone-400">Unit</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-stone-400">Unit Price</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-stone-400">Available Stock</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-stone-400">Min Stock</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-800">
                                    {materials.data.map((material) => {
                                        const stockBadge = getStockBadge(material);
                                        return (
                                            <tr key={material.id} className="hover:bg-stone-900/50">
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-white">{material.name}</div>
                                                    {material.description && (
                                                        <div className="text-xs text-stone-400 mt-1">{material.description}</div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-stone-300">
                                                    {material.supplier?.name || '—'}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-stone-300">{material.unit}</td>
                                                <td className="px-6 py-4 text-sm text-white font-medium">{material.stock}</td>
                                                <td className="px-6 py-4 text-sm text-stone-300">{material.minimum_stock}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${stockBadge.className}`}>
                                                        {stockBadge.text}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {materials.links && materials.links.length > 0 && (
                            <div className="px-6 py-4 border-t border-stone-800">
                                <div className="flex justify-center space-x-1">
                                    {materials.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`px-3 py-2 rounded text-sm transition-colors ${link.active
                                                ? 'bg-amber-600 text-white'
                                                : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
                                                } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </AdminLayout>
    );
}
