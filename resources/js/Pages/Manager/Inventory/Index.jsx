import ManagerLayout from '@/Layouts/ManagerLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

import {
    Package,
    AlertTriangle,
    XCircle,
    PhilippinePeso,
    Search,
    Eye,
    ClipboardList,
} from 'lucide-react';

export default function Index() {

    const { materials } = usePage().props;

    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');

    // FILTER
    const filteredInventories = useMemo(() => {
        return materials.data.filter((inv) => {
            const material = inv.rawMaterial;

            if (!material) return false;

            const matchesSearch = material.material_name
                ?.toLowerCase()
                .includes(search.toLowerCase());

            const matchesCategory =
                category === "" ||
                material.category?.raw_category_name === category;

            return matchesSearch && matchesCategory;
        });
    }, [materials, search, category]);

    // CATEGORY LIST
    const categories = [
        ...new Set(
            materials.data
                .map(inv => inv.rawMaterial?.category?.raw_category_name)
                .filter(Boolean)
        ),
    ];

    const totalInventoryValue = filteredInventories.reduce((sum, inv) => {
        return (
            sum +
            Number(inv.received_quantity || 0) *
            Number(inv.rawMaterial?.purchase_price || 0)
        );
    }, 0);

    const totalReceived = filteredInventories.reduce(
        (sum, inv) => sum + Number(inv.received_quantity || 0),
        0
    );


    function Card({ title, value, icon, color }) {
        const colors = {
            blue: {
                text: "text-blue-400",
                bg: "bg-blue-500/10",
                border: "border-blue-500/20",
            },
            amber: {
                text: "text-amber-400",
                bg: "bg-amber-500/10",
                border: "border-amber-500/20",
            },
            yellow: {
                text: "text-yellow-400",
                bg: "bg-yellow-500/10",
                border: "border-yellow-500/20",
            },
            red: {
                text: "text-red-400",
                bg: "bg-red-500/10",
                border: "border-red-500/20",
            },
            green: {
                text: "text-emerald-400",
                bg: "bg-emerald-500/10",
                border: "border-emerald-500/20",
            },
        };

        return (
            <div className="bg-black border border-stone-800 rounded-xl p-5 hover:border-stone-700 transition-all duration-200">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm text-stone-400">
                            {title}
                        </p>

                        <h2 className={`text-3xl font-bold mt-3 ${colors[color].text}`}>
                            {value}
                        </h2>
                    </div>

                    <div
                        className={`p-3 rounded-lg border ${colors[color].bg} ${colors[color].border} ${colors[color].text}`}
                    >
                        {icon}
                    </div>
                </div>
            </div>
        );
    }


    return (
        <ManagerLayout>

            <Head title="Raw Material Inventory" />

            <div className="p-6 space-y-6">

                {/* HEADER */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                    <div>
                        <h1 className="text-3xl font-bold text-white">
                            Raw Material Inventory
                        </h1>
                        <p className="text-stone-400 mt-1">
                            Monitor acquired raw materials and stock levels.
                        </p>
                    </div>

                    <Link
                        // href={route('manager.inventory.stock-logs')}
                        className="px-4 py-2 rounded-lg border border-stone-700 text-stone-300 hover:bg-stone-800 transition"
                    >
                        <div className="flex items-center gap-2">
                            <ClipboardList size={18} />
                            <span>Stock Logs</span>
                        </div>
                    </Link>

                </div>

                {/* DASHBOARD CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

                    <Card
                        title="Total Materials"
                        value={filteredInventories.length}
                        icon={<Package size={22} />}
                        color="blue"
                    />

                    <Card
                        title="Total Received Qty"
                        value={totalReceived}
                        icon={<Package size={22} />}
                        color="yellow"
                    />

                    <Card
                        title="Completed Deliveries"
                        value={filteredInventories.length}
                        icon={<ClipboardList size={22} />}
                        color="green"
                    />

                    <Card
                        title="Inventory Value"
                        value={`₱${totalInventoryValue.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                        })}`}
                        icon={<PhilippinePeso size={22} />}
                        color="green"
                    />

                </div>

                {/* SEARCH */}
                <div className="bg-stone-900 border border-stone-800 rounded-xl p-5">

                    <div className="grid lg:grid-cols-2 gap-4">

                        <div className="relative">

                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500" size={18} />

                            <input
                                type="text"
                                placeholder="Search material..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-black border border-stone-700 rounded-lg pl-11 pr-4 py-3 text-white"
                            />
                        </div>

                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="bg-black border border-stone-700 rounded-lg px-4 py-3 text-white"
                        >
                            <option value="">All Categories</option>
                            {categories.map((cat, i) => (
                                <option key={i} value={cat}>{cat}</option>
                            ))}
                        </select>

                    </div>
                </div>

                {/* TABLE */}
                <div className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden">

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead className="bg-stone-950 border-b border-stone-800">
                                <tr>
                                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-stone-400">
                                        Image
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-400">
                                        Material
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-400">
                                        Category
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-400">
                                        Supplier
                                    </th>

                                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-stone-400">
                                        Unit Price
                                    </th>

                                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-stone-400">
                                        Received Qty
                                    </th>

                                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-stone-400">
                                        Last Received
                                    </th>

                                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-stone-400">
                                        Status
                                    </th>

                                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-stone-400">
                                        Quantity
                                    </th>

                                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-stone-400">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredInventories.length > 0 ? (
                                    filteredInventories.map((inv) => {
                                        const material = inv.rawMaterial;

                                        const status =
                                            Number(inv.current_stock) <= 0
                                                ? "out"
                                                : Number(inv.current_stock) <= Number(inv.minimum_stock)
                                                    ? "low"
                                                    : "in";

                                        return (

                                            <tr
                                                key={inv.id}
                                                className="border-t border-stone-800 hover:bg-stone-800/50"
                                            >
                                                <td className="px-6 py-4">
                                                    {material?.primary_image ? (
                                                        <img
                                                            src={`/storage/${material.primary_image.image_path}`}
                                                            alt={material.material_name}
                                                            className="w-14 h-14 rounded-lg object-cover border border-stone-700"
                                                        />
                                                    ) : (
                                                        <div className="w-14 h-14 rounded-lg border border-dashed border-stone-700 flex items-center justify-center text-[10px] text-stone-500">
                                                            No Image
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-white font-medium">
                                                    {material?.material_name}
                                                </td>

                                                <td className="px-6 py-4 text-stone-300">
                                                    {material?.category?.raw_category_name ?? "-"}
                                                </td>

                                                <td className="px-6 py-4 text-stone-300">
                                                    {material?.supplier?.company_name ?? "-"}
                                                </td>

                                                <td className="px-6 py-4 text-right text-emerald-400 font-medium">
                                                    ₱
                                                    {Number(
                                                        material?.purchase_price || 0
                                                    ).toLocaleString(undefined, {
                                                        minimumFractionDigits: 2,
                                                    })}
                                                </td>

                                                <td className="px-6 py-4 text-center text-sky-400 font-medium">
                                                    {Number(inv.received_quantity)}
                                                    {material?.unit
                                                        ? ` ${material.unit.name}`
                                                        : ""}
                                                </td>

                                                <td className="px-6 py-4 text-center text-stone-300">
                                                    {inv.last_received_date
                                                        ? new Date(inv.last_received_date).toLocaleDateString()
                                                        : "-"}
                                                </td>

                                                <td className="px-6 py-4">
                                                    <span className="px-3 py-1 rounded-full text-xs border bg-green-500/20 text-green-400 border-green-600">
                                                        Delivered
                                                    </span>
                                                </td>

                                                <td className="px-6 py-4 text-sky-400">
                                                    {Number(inv.received_quantity || 0) % 1 === 0
                                                        ? parseInt(inv.received_quantity || 0)
                                                        : Number(inv.received_quantity || 0)}
                                                </td>

                                                <td className="px-6 py-4 text-center whitespace-nowrap text-sm font-medium">
                                                    <Link
                                                        href={route(
                                                            "manager.inventory.show",
                                                            inv.id
                                                        )}
                                                        className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 transition-colors"
                                                    >
                                                        {/* <Eye size={16} /> */}
                                                        View
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="10"
                                            className="py-16 text-center text-stone-500"
                                        >
                                            Inventory Empty
                                        </td>
                                    </tr>
                                )}
                            </tbody>


                        </table>

                        {materials.last_page > 1 && (
                            <div className="flex justify-center items-center gap-3 border-t border-stone-800 p-4">

                                <Link
                                    href={materials.prev_page_url || "#"}
                                    preserveScroll
                                    preserveState
                                    only={["materials"]}
                                    className={`px-4 py-2 rounded-lg ${materials.prev_page_url
                                        ? "bg-stone-900 hover:bg-stone-800 text-white"
                                        : "bg-stone-900 text-stone-600 pointer-events-none"
                                        }`}
                                >
                                    Previous
                                </Link>

                                <span className="px-4 py-2 rounded-lg bg-blue-600 text-white">
                                    {materials.current_page}
                                </span>

                                <Link
                                    href={materials.next_page_url || "#"}
                                    preserveScroll
                                    preserveState
                                    only={["materials"]}
                                    className={`px-4 py-2 rounded-lg ${materials.next_page_url
                                        ? "bg-stone-900 hover:bg-stone-800 text-white"
                                        : "bg-stone-900 text-stone-600 pointer-events-none"
                                        }`}
                                >
                                    Next
                                </Link>

                            </div>
                        )}

                    </div>

                </div>

            </div>

        </ManagerLayout>
    );
}

/* Small reusable card */
function Card({ title, value, icon, color }) {
    const colors = {
        amber: 'text-amber-400 bg-amber-500/20',
        yellow: 'text-yellow-400 bg-yellow-500/20',
        red: 'text-red-400 bg-red-500/20',
        green: 'text-green-400 bg-green-500/20',
    };

    return (
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-5">
            <div className="flex justify-between items-center">

                <div>
                    <p className="text-stone-400 text-sm">{title}</p>
                    <h2 className="text-2xl font-bold text-white mt-2">{value}</h2>
                </div>

                <div className={`p-3 rounded-lg ${colors[color]}`}>
                    {icon}
                </div>

            </div>
        </div>
    );
}
