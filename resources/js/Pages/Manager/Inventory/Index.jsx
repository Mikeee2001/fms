import ManagerLayout from "@/Layouts/ManagerLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { useMemo, useState } from "react";

import {
    Package,
    PhilippinePeso,
    ClipboardList,
    Search,
    Eye,
} from "lucide-react";

export default function Index() {

    const { materials } = usePage().props;

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");

    // Filter Materials
    const filteredInventories = useMemo(() => {

        return materials.filter((inventory) => {

            const material = inventory.rawMaterial;

            if (!material) return false;

            const matchesSearch =
                material.name
                    ?.toLowerCase()
                    .includes(search.toLowerCase());

            const matchesCategory =
                category === "" ||
                material.category?.raw_category_name === category;

            return matchesSearch && matchesCategory;

        });

    }, [materials, search, category]);

    // Categories
    const categories = [
        ...new Set(
            materials
                .map(item => item.rawMaterial?.category?.raw_category_name)
                .filter(Boolean)
        ),
    ];

    // Dashboard Statistics
    const totalReceivedPurchases = filteredInventories.length;

    const totalCurrentStock = filteredInventories.reduce(
        (sum, item) => sum + Number(item.current_stock ?? 0),
        0
    );

    const totalReceivedQuantity = filteredInventories.reduce(
        (sum, item) => sum + Number(item.received_quantity),
        0
    );

    const completedDeliveries = filteredInventories.filter(
        item => item.receipt_status === "completed"
    ).length;

    const totalInventoryValue = filteredInventories.reduce(
        (sum, item) =>
            sum +
            Number(item.received_quantity) *
            Number(item.rawMaterial.purchase_price),
        0
    );

    return (
        <ManagerLayout>

            <Head title="Raw Material Inventory" />

            <div className="p-6 space-y-6">

                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                    <div>
                        <h1 className="text-3xl font-bold text-white">
                            Raw Material Inventory
                        </h1>

                        <p className="text-stone-400 mt-1">
                            Monitor available raw materials, stock levels, and receiving history.
                        </p>
                    </div>

                    {/* <Link
                        href={route("manager.inventory.stock-logs")}
                        className="px-4 py-3 rounded-lg border border-stone-700 text-stone-300 hover:bg-stone-800"
                    >
                        Stock Logs
                    </Link> */}

                </div>


                {/* Dashboard Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

                    <Card
                        title="Received Purchases"
                        value={totalReceivedPurchases}
                        icon={<Package size={22} />}
                        color="blue"
                    />

                    <Card
                        title="Current Stock"
                        value={totalReceivedQuantity.toLocaleString()}
                        icon={<Package size={22} />}
                        color="yellow"
                    />

                    <Card
                        title="Completed Deliveries"
                        value={completedDeliveries}
                        icon={<ClipboardList size={22} />}
                        color="green"
                    />

                    <Card
                        title="Inventory Value"
                        value={`₱${totalInventoryValue.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}`}
                        icon={<PhilippinePeso size={22} />}
                        color="green"
                    />

                </div>

                {/* Filters */}
                <div className="bg-stone-900 border border-stone-800 rounded-xl p-5">

                    <div className="grid lg:grid-cols-2 gap-4">

                        {/* Search */}
                        <div className="relative">

                            <Search
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500"
                            />

                            <input
                                type="text"
                                placeholder="Search raw material..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-black border border-stone-700 rounded-lg pl-11 pr-4 py-3 text-white focus:outline-none focus:border-blue-500"
                            />

                        </div>

                        {/* Category */}
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="bg-black border border-stone-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                        >
                            <option value="">
                                All Categories
                            </option>

                            {categories.map((cat) => (
                                <option
                                    key={cat}
                                    value={cat}
                                >
                                    {cat}
                                </option>
                            ))}

                        </select>

                    </div>

                </div>

                {/* Inventory Table */}
                <div className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden">

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead className="bg-stone-950 border-b border-stone-800">

                                <tr>

                                    <th className="px-6 py-4 text-center text-xs uppercase text-stone-400">
                                        Image
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs uppercase text-stone-400">
                                        Material
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs uppercase text-stone-400">
                                        Category
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs uppercase text-stone-400">
                                        Supplier
                                    </th>

                                    <th className="px-6 py-4 text-right text-xs uppercase text-stone-400">
                                        Unit Price
                                    </th>

                                    <th className="px-6 py-4 text-center text-xs uppercase text-stone-400">
                                        Current Stock
                                    </th>

                                    <th className="px-6 py-4 text-center text-xs uppercase text-stone-400">
                                        Stock Status
                                    </th>

                                    <th className="px-6 py-4 text-center text-xs uppercase text-stone-400">
                                        Receipt Status
                                    </th>

                                    <th className="px-6 py-4 text-center text-xs uppercase text-stone-400">
                                        Last Received
                                    </th>

                                    <th className="px-6 py-4 text-center text-xs uppercase text-stone-400">
                                        Actions
                                    </th>

                                </tr>

                            </thead>

                            <tbody>
                                {filteredInventories.length > 0 ? (
                                    filteredInventories
                                        .sort(
                                            (a, b) =>
                                                new Date(b.last_received_date) -
                                                new Date(a.last_received_date)
                                        )
                                        .map((inv) => {

                                            const material = inv.rawMaterial;

                                            return (
                                                <tr
                                                    key={inv.id}
                                                    className="border-t border-stone-800 hover:bg-stone-800/40 transition"
                                                >
                                                    {/* Image */}
                                                    <td className="px-6 py-4">
                                                        {material.primaryImage ? (
                                                            <img
                                                                src={`/storage/${material.primaryImage.image_path}`}
                                                                alt={material.name}
                                                                className="w-14 h-14 rounded-lg object-cover border border-stone-700"
                                                            />
                                                        ) : (
                                                            <div className="w-14 h-14 rounded-lg border border-dashed border-stone-700 flex items-center justify-center text-xs text-stone-500">
                                                                No Image
                                                            </div>
                                                        )}
                                                    </td>

                                                    {/* Material */}
                                                    <td className="px-6 py-4">
                                                        <div className="font-semibold text-white">
                                                            {material.name}
                                                        </div>

                                                        <div className="text-xs text-stone-400 mt-1">
                                                            {material.unit?.name}
                                                        </div>
                                                    </td>

                                                    {/* Category */}
                                                    <td className="px-6 py-4 text-stone-300">
                                                        {material.category?.raw_category_name ?? "-"}
                                                    </td>

                                                    {/* Supplier */}
                                                    <td className="px-6 py-4 text-stone-300">
                                                        {material.supplier?.company_name ?? "-"}
                                                    </td>

                                                    {/* Unit Price */}
                                                    <td className="px-6 py-4 text-right text-emerald-400 font-semibold">
                                                        ₱
                                                        {Number(material.purchase_price).toLocaleString(
                                                            undefined,
                                                            {
                                                                minimumFractionDigits: 2,
                                                            }
                                                        )}
                                                    </td>

                                                    {/* Received Quantity */}
                                                    <td className="px-6 py-4 text-center">
                                                        <span className="font-semibold text-sky-400">
                                                            {Number(inv.received_quantity).toLocaleString()}
                                                        </span>

                                                        <div className="text-xs text-stone-500">
                                                            {material.unit?.name}
                                                        </div>
                                                    </td>

                                                    {/* Stock Status */}
                                                    <td className="px-6 py-4 text-center">
                                                        {inv.stock_status === "in_stock" && (
                                                            <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/40 text-xs">
                                                                In Stock
                                                            </span>
                                                        )}

                                                        {inv.stock_status === "low_stock" && (
                                                            <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 text-xs">
                                                                Low Stock
                                                            </span>
                                                        )}

                                                        {inv.stock_status === "out_of_stock" && (
                                                            <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 text-xs">
                                                                Out of Stock
                                                            </span>
                                                        )}
                                                    </td>

                                                    {/* Receipt Status */}
                                                    <td className="px-6 py-4 text-center">
                                                        {inv.receipt_status === "completed" && (
                                                            <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/40 text-xs">
                                                                Received
                                                            </span>
                                                        )}

                                                        {inv.receipt_status === "partial" && (
                                                            <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 text-xs">
                                                                Partial
                                                            </span>
                                                        )}
                                                    </td>

                                                    {/* Last Received */}
                                                    <td className="px-6 py-4 text-center text-stone-300">
                                                        {inv.last_received_date
                                                            ? new Date(
                                                                inv.last_received_date
                                                            ).toLocaleDateString()
                                                            : "-"}
                                                    </td>

                                                    {/* Action
                                                    <td className="px-6 py-4 text-center">
                                                        <Link
                                                            href={route(
                                                                "manager.inventory.show",
                                                                inv.id
                                                            )}
                                                            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300"
                                                        >
                                                            <Eye size={16} />
                                                            View
                                                        </Link>
                                                    </td> */}
                                                </tr>
                                            );
                                        })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={10}
                                            className="py-16 text-center text-stone-500"
                                        >
                                            <Package
                                                className="mx-auto mb-3"
                                                size={40}
                                            />

                                            <p className="text-lg">
                                                No inventory records found.
                                            </p>

                                            <p className="text-sm mt-2">
                                                Received raw materials will appear here.
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </ManagerLayout>
    );
}

/* ===========================
    Dashboard Card Component
=========================== */

function Card({ title, value, icon, color }) {

    const colors = {

        blue: {
            text: "text-blue-400",
            bg: "bg-blue-500/10",
            border: "border-blue-500/20",
        },

        yellow: {
            text: "text-yellow-400",
            bg: "bg-yellow-500/10",
            border: "border-yellow-500/20",
        },

        green: {
            text: "text-emerald-400",
            bg: "bg-emerald-500/10",
            border: "border-emerald-500/20",
        },

        red: {
            text: "text-red-400",
            bg: "bg-red-500/10",
            border: "border-red-500/20",
        },

    };

    return (

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 hover:border-stone-700 transition-all duration-200">

            <div className="flex items-center justify-between">

                <div>

                    <p className="text-sm text-stone-400">
                        {title}
                    </p>

                    <h2
                        className={`text-3xl font-bold mt-3 ${colors[color].text}`}
                    >
                        {value}
                    </h2>

                </div>

                <div
                    className={`p-3 rounded-xl border ${colors[color].bg} ${colors[color].border} ${colors[color].text}`}
                >
                    {icon}
                </div>

            </div>

        </div>

    );
}
