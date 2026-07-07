import ManagerLayout from "@/Layouts/ManagerLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import {
    ArrowLeft,
    Package,
    Building2,
    User,
    FileText,
    Wallet,
    FileDown,
} from "lucide-react";

export default function Show() {
    const { purchaseOrder } = usePage().props;
    const items = purchaseOrder.items ?? [];

    const statusClasses = {
        pending:
            "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
        approved:
            "bg-blue-500/10 text-blue-400 border-blue-500/20",
        shipped:
            "bg-purple-500/10 text-purple-400 border-purple-500/20",
        received:
            "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        cancelled:
            "bg-red-500/10 text-red-400 border-red-500/20",
    };

    return (
        <ManagerLayout>
            <Head title={`Purchase Order ${purchaseOrder.po_number}`} />

            <div className="space-y-6">

                {/* HEADER */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                    {/* LEFT */}
                    <div>

                        <Link
                            href={route("manager.goods-receipts.index")}
                            className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-white mb-3"
                        >
                            <ArrowLeft size={16} />
                            Back
                        </Link>

                        <h1 className="text-3xl font-bold text-white">
                            Purchase Order
                        </h1>

                        <p className="text-stone-400 mt-1">
                            {purchaseOrder.po_number}
                        </p>

                    </div>

                    {/* RIGHT */}
                    <div className="flex items-center gap-3 flex-wrap">

                        <span
                            className={`px-4 py-2 rounded-full text-sm font-semibold border ${statusClasses[purchaseOrder.status] ??
                                statusClasses.cancelled
                                }`}
                        >
                            {purchaseOrder.status?.toUpperCase()}
                        </span>

                        <a
                            href={route(
                                "manager.purchase-orders.pdf",
                                purchaseOrder.id
                            )}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition"
                        >
                            <FileDown size={18} />
                            Download PDF
                        </a>

                    </div>

                </div>

                {/* CONTENT */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                    {/* LEFT SIDE */}
                    <div className="xl:col-span-2 space-y-6">

                        {/* MATERIALS */}
                        <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden">

                            <div className="px-6 py-5 border-b border-stone-800 flex items-center gap-3">
                                <Package className="text-blue-400" />
                                <h2 className="text-lg font-semibold text-white">
                                    Ordered Materials
                                </h2>
                            </div>

                            <div className="overflow-x-auto">

                                <table className="min-w-full">
                                    <thead className="bg-stone-950">

                                        <tr>

                                            <th className="px-6 py-4 text-left text-xs uppercase tracking-wide text-stone-400">
                                                Material
                                            </th>

                                            <th className="px-4 py-4 text-center text-xs uppercase tracking-wide text-stone-400">
                                                Qty
                                            </th>

                                            <th className="px-4 py-4 text-center text-xs uppercase tracking-wide text-stone-400">
                                                Unit
                                            </th>

                                            <th className="px-4 py-4 text-center text-xs uppercase tracking-wide text-stone-400">
                                                Price
                                            </th>

                                            <th className="px-6 py-4 text-right text-xs uppercase tracking-wide text-stone-400">
                                                Total
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody>
                                        {items.length > 0 ? (
                                            items.map((item) => (
                                                <tr
                                                    key={item.id}
                                                    className="border-t border-stone-800 hover:bg-stone-800/40 transition"
                                                >
                                                    <td className="px-6 py-4 text-white font-medium">
                                                        {item.raw_material?.material_name ?? "-"}
                                                    </td>

                                                    <td className="px-4 py-4 text-center text-white">
                                                        {Number(item.quantity).toLocaleString()}
                                                    </td>

                                                    <td className="px-4 py-4 text-center text-stone-400">
                                                        {item.raw_material?.unit?.name ?? "-"}
                                                    </td>

                                                    <td className="px-4 py-4 text-center text-stone-300">
                                                        ₱{Number(
                                                            item.unit_price ?? 0
                                                        ).toLocaleString()}
                                                    </td>

                                                    <td className="px-6 py-4 text-right font-semibold text-emerald-400">
                                                        ₱{Number(
                                                            item.subtotal ?? 0
                                                        ).toLocaleString()}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan={5}
                                                    className="py-10 text-center text-stone-500"
                                                >
                                                    No materials found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>

                            </div>

                        </div>

                        {/* NOTES */}
                        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6">

                            <div className="flex items-center gap-3 mb-4">
                                <FileText className="text-amber-400" />
                                <h2 className="text-lg font-semibold text-white">
                                    Notes
                                </h2>
                            </div>

                            <p className="text-stone-300 whitespace-pre-wrap">
                                {purchaseOrder.notes || "No notes available."}
                            </p>

                        </div>

                    </div>

                    {/* RIGHT SIDE */}
                    <div className="space-y-6">

                        <InfoCard
                            icon={<Wallet size={22} />}
                            title="Total Amount"
                            value={`₱${Number(
                                purchaseOrder.total_amount ?? 0
                            ).toLocaleString()}`}
                        />

                        <InfoCard
                            icon={<Package size={22} />}
                            title="Materials"
                            value={`${items.length} Items`}
                        />

                        <InfoCard
                            icon={<Building2 size={22} />}
                            title="Supplier"
                            value={purchaseOrder.supplier?.company_name}
                        />

                        <InfoCard
                            icon={<FileText size={22} />}
                            title="Order Date"
                            value={purchaseOrder.order_date}
                        />

                        {/* SUPPLIER */}
                        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6">

                            <div className="flex items-center gap-3 mb-5">
                                <Building2 className="text-blue-400" />

                                <h2 className="text-lg font-semibold text-white">
                                    Supplier
                                </h2>
                            </div>

                            <SummaryRow
                                label="Company"
                                value={purchaseOrder.supplier?.company_name}
                            />

                            <SummaryRow
                                label="Email"
                                value={purchaseOrder.supplier?.email}
                            />

                            <SummaryRow
                                label="Phone"
                                value={purchaseOrder.supplier?.phone}
                            />

                        </div>

                        {/* REQUESTED BY */}
                        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6">

                            <div className="flex items-center gap-3 mb-5">
                                <User className="text-purple-400" />

                                <h2 className="text-lg font-semibold text-white">
                                    Requested By
                                </h2>
                            </div>

                            <SummaryRow
                                label="Manager"
                                value={purchaseOrder.manager?.user?.name}
                            />

                        </div>

                    </div>

                </div>

            </div>

        </ManagerLayout>
    );
}

function SummaryRow({ label, value }) {
    return (
        <div className="flex items-center justify-between py-3 border-b border-stone-800 last:border-b-0">
            <span className="text-sm text-stone-400">
                {label}
            </span>

            <span className="text-sm font-medium text-white text-right">
                {value ?? "-"}
            </span>
        </div>
    );
}

function InfoCard({ icon, title, value }) {
    return (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 hover:border-stone-700 transition">

            <div className="flex items-center gap-3 text-stone-400 mb-3">
                <div className="w-10 h-10 rounded-xl bg-stone-800 flex items-center justify-center">
                    {icon}
                </div>

                <span className="text-sm font-medium">
                    {title}
                </span>
            </div>

            <div className="text-2xl font-bold text-white break-words">
                {value ?? "-"}
            </div>

        </div>
    );
}
