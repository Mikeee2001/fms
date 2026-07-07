import ManagerLayout from "@/Layouts/ManagerLayout";
import { Head, usePage } from "@inertiajs/react";
import { useMemo, useState } from "react";

import {
    PackageCheck,
    Search,
    FileText,
    Truck,
    Building2,
    Eye,
} from "lucide-react";

export default function Index() {
    const {
        receipts = [],
        purchaseOrders = [],
    } = usePage().props;

    const [search, setSearch] = useState("");

    const filteredPOs = useMemo(() => {
        return purchaseOrders.filter((po) =>
            po.po_number
                ?.toLowerCase()
                .includes(search.toLowerCase())
        );
    }, [purchaseOrders, search]);

    const pendingPOs = purchaseOrders.length;

    const totalSuppliers = new Set(
        purchaseOrders.map((po) => po.supplier_id)
    ).size;

    return (
        <ManagerLayout>
            <Head title="Materials Receiving" />

            <div className="p-6 space-y-6">

                {/* HEADER */}
                <div>
                    <h1 className="text-3xl font-bold text-white">
                        Material Receiving
                    </h1>

                    <p className="text-stone-400 mt-1">
                        Receive and verify incoming raw materials from suppliers.
                    </p>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                    <StatCard
                        title="Pending Purchase Orders"
                        value={pendingPOs}
                        icon={<FileText size={22} />}
                        color="blue"
                    />

                    <StatCard
                        title="Goods Receipts"
                        value={receipts.length}
                        icon={<PackageCheck size={22} />}
                        color="green"
                    />

                    <StatCard
                        title="Suppliers"
                        value={totalSuppliers}
                        icon={<Building2 size={22} />}
                        color="amber"
                    />

                </div>

                {/* SEARCH */}
                <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5">

                    <div className="relative">

                        <Search
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500"
                        />

                        <input
                            type="text"
                            placeholder="Search PO Number..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            className="w-full bg-black border border-stone-700 rounded-xl pl-11 pr-4 py-3 text-white"
                        />

                    </div>

                </div>

                {/* TABLE */}
                <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden">

                    <div className="px-6 py-5 border-b border-stone-800">

                        <h2 className="text-lg font-semibold text-white">
                            Material Requests
                        </h2>

                        <p className="text-stone-400 text-sm mt-1">
                            Purchase orders waiting for receiving
                        </p>

                    </div>

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead className="bg-stone-950">

                                <tr>

                                    <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-stone-400">
                                        PO Number
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-stone-400">
                                        Supplier
                                    </th>

                                    <th className="px-6 py-4 text-center text-xs uppercase tracking-wider text-stone-400">
                                        Materials
                                    </th>

                                    <th className="px-6 py-4 text-center text-xs uppercase tracking-wider text-stone-400">
                                        Ordered Qty
                                    </th>

                                    <th className="px-6 py-4 text-center text-xs uppercase tracking-wider text-stone-400">
                                        Status
                                    </th>

                                    <th className="px-6 py-4 text-center text-xs uppercase tracking-wider text-stone-400">
                                        Action
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {filteredPOs.length > 0 ? (
                                    filteredPOs.map((po) => {
                                        const totalOrdered =
                                            po.items?.reduce(
                                                (sum, item) =>
                                                    sum +
                                                    Number(item.quantity),
                                                0
                                            ) || 0;

                                        return (
                                            <tr
                                                key={po.id}
                                                className="border-t border-stone-800 hover:bg-stone-800/50 transition"
                                            >

                                                <td className="px-6 py-5">
                                                    <div className="font-medium text-white">
                                                        {po.po_number}
                                                    </div>
                                                </td>

                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">

                                                        <div className="w-10 h-10 rounded-lg bg-stone-800 flex items-center justify-center">
                                                            <Truck
                                                                size={18}
                                                                className="text-blue-400"
                                                            />
                                                        </div>

                                                        <div>
                                                            <p className="text-white">
                                                                {po.supplier?.company_name}
                                                            </p>

                                                            <p className="text-xs text-stone-500">
                                                                Supplier
                                                            </p>
                                                        </div>

                                                    </div>
                                                </td>

                                                <td className="px-6 py-5 text-center text-white">
                                                    {po.items?.length || 0}
                                                </td>

                                                <td className="px-6 py-5 text-center font-medium text-sky-400">
                                                    {totalOrdered}
                                                </td>

                                                <td className="px-6 py-5 text-center">

                                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                        {po.status}
                                                    </span>

                                                </td>

                                                <td className="px-6 py-5 text-center">
                                                    <button
                                                        onClick={() =>
                                                            router.visit(`/manager/goods-receipts/${po.goods_receipts[0]?.id}`)
                                                        }
                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white transition"
                                                    >
                                                        <Eye size={16} />

                                                        View Details
                                                    </button>
                                                </td>

                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>

                                        <td
                                            colSpan="6"
                                            className="py-16 text-center text-stone-500"
                                        >
                                            No Purchase Orders Found
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

/* Stat Card */
function StatCard({
    title,
    value,
    icon,
    color,
}) {
    const colors = {
        blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
        green:
            "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        amber:
            "text-amber-400 bg-amber-500/10 border-amber-500/20",
    };

    return (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5">

            <div className="flex items-center justify-between">

                <div>
                    <p className="text-sm text-stone-400">
                        {title}
                    </p>

                    <h2 className="text-3xl font-bold text-white mt-2">
                        {value}
                    </h2>
                </div>

                <div
                    className={`p-3 rounded-xl border ${colors[color]}`}
                >
                    {icon}
                </div>

            </div>

        </div>
    );
}
