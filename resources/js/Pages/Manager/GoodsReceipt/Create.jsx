import ManagerLayout from "@/Layouts/ManagerLayout";
import { Head, useForm } from "@inertiajs/react";
import {
    Package,
    Truck,
    AlertTriangle,
} from "lucide-react";

export default function Create({ purchaseOrder }) {
    const {
        data,
        setData,
        post,
        processing,
        errors,
    } = useForm({
        purchase_order_id: purchaseOrder.id,
        supplier_id: purchaseOrder.supplier_id,

        received_date: new Date()
            .toISOString()
            .slice(0, 10),

        remarks: "",

        items: purchaseOrder.items.map((item) => ({
            purchase_order_item_id: item.id,
            raw_material_id: item.raw_material_id,
            ordered_quantity: Number(item.quantity),
            received_quantity: Number(item.quantity),
        })),
    });

    const submit = (e) => {
        e.preventDefault();

        post(
            route("manager.goods-receipts.store")
        );
    };

    const updateQty = (index, value) => {
        const items = [...data.items];

        items[index].received_quantity =
            Number(value) || 0;

        setData("items", items);
    };

    const totalOrdered = data.items.reduce(
        (sum, item) =>
            sum + Number(item.ordered_quantity),
        0
    );

    const totalDelivered = data.items.reduce(
        (sum, item) =>
            sum + Number(item.received_quantity),
        0
    );

    const totalRemaining =
        totalOrdered - totalDelivered;

    return (
        <ManagerLayout>
            <Head title="Goods Receipt" />

            <div className="p-6 max-w-7xl mx-auto">

                {/* PAGE HEADER */}
                <div className="flex items-center justify-between mb-8">

                    <div>
                        <h1 className="text-4xl font-bold text-white">
                            Goods Receipt
                        </h1>

                        <p className="text-stone-400 mt-2">
                            Receive and verify supplier deliveries
                        </p>
                    </div>

                    <div className="bg-green-500/10 border border-green-500/30 px-4 py-2 rounded-xl">
                        <span className="text-green-400 font-semibold">
                            {purchaseOrder.po_number}
                        </span>
                    </div>

                </div>

                {/* PO DETAILS */}
                <div className="bg-gradient-to-r from-stone-900 to-stone-800 border border-stone-700 rounded-2xl p-6 mb-8">

                    <div className="grid md:grid-cols-3 gap-6">

                        <div>
                            <p className="text-stone-400 text-sm">
                                Purchase Order
                            </p>

                            <p className="text-white font-bold text-xl mt-1">
                                {purchaseOrder.po_number}
                            </p>
                        </div>

                        <div>
                            <p className="text-stone-400 text-sm">
                                Supplier
                            </p>

                            <p className="text-white font-semibold mt-1">
                                {
                                    purchaseOrder.supplier
                                        ?.company_name
                                }
                            </p>
                        </div>

                        <div>
                            <p className="text-stone-400 text-sm">
                                Order Date
                            </p>

                            <p className="text-white font-semibold mt-1">
                                {new Date(
                                    purchaseOrder.order_date
                                ).toLocaleDateString()}
                            </p>
                        </div>

                    </div>

                </div>

                {/* SUMMARY CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">

                    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5">

                        <div className="flex justify-between">

                            <div>
                                <p className="text-stone-400 text-sm">
                                    Materials
                                </p>

                                <h2 className="text-3xl font-bold text-white mt-2">
                                    {data.items.length}
                                </h2>
                            </div>

                            <Package
                                className="text-blue-400"
                                size={28}
                            />

                        </div>

                    </div>

                    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5">

                        <div className="flex justify-between">

                            <div>
                                <p className="text-stone-400 text-sm">
                                    Ordered
                                </p>

                                <h2 className="text-3xl font-bold text-blue-400 mt-2">
                                    {totalOrdered}
                                </h2>
                            </div>

                            <Package
                                className="text-blue-400"
                                size={28}
                            />

                        </div>

                    </div>

                    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5">

                        <div className="flex justify-between">

                            <div>
                                <p className="text-stone-400 text-sm">
                                    Delivered
                                </p>

                                <h2 className="text-3xl font-bold text-green-400 mt-2">
                                    {totalDelivered}
                                </h2>
                            </div>

                            <Truck
                                className="text-green-400"
                                size={28}
                            />

                        </div>

                    </div>

                    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5">

                        <div className="flex justify-between">

                            <div>
                                <p className="text-stone-400 text-sm">
                                    Remaining
                                </p>

                                <h2 className="text-3xl font-bold text-red-400 mt-2">
                                    {totalRemaining}
                                </h2>
                            </div>

                            <AlertTriangle
                                className="text-red-400"
                                size={28}
                            />

                        </div>

                    </div>

                </div>

                <form onSubmit={submit}>

                    {/* RECEIVED DATE */}
                    <div className="mb-8">

                        <label className="block text-stone-300 mb-2 font-medium">
                            Received Date
                        </label>

                        <input
                            type="date"
                            value={data.received_date}
                            onChange={(e) =>
                                setData(
                                    "received_date",
                                    e.target.value
                                )
                            }
                            className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-white"
                        />

                    </div>

                    {/* TABLE */}
                    <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-xl">

                        <div className="px-6 py-4 border-b border-stone-800 bg-stone-950">
                            <h2 className="text-lg font-semibold text-white">
                                Inventory Items
                            </h2>

                            <p className="text-sm text-stone-400">
                                {filteredInventories.length} materials found
                            </p>
                        </div>

                        <div className="overflow-x-auto">

                            <table className="w-full">

                                <thead className="bg-stone-950 sticky top-0 z-10">

                                    <tr>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                                            Material
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                                            Category
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                                            Supplier
                                        </th>

                                        <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-stone-500">
                                            Unit Price
                                        </th>

                                        <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-stone-500">
                                            Quantity
                                        </th>

                                        <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-stone-500">
                                            Status
                                        </th>

                                        <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-stone-500">
                                            Last Receipt
                                        </th>

                                        <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-stone-500">
                                            Actions
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {filteredInventories.length > 0 ? (

                                        filteredInventories.map((inv) => {

                                            const material = inv.rawMaterial;

                                            const qty =
                                                Number(inv.received_quantity || 0);

                                            const status =
                                                qty <= 0
                                                    ? "Out of Stock"
                                                    : qty <= 20
                                                        ? "Low Stock"
                                                        : "In Stock";

                                            return (

                                                <tr
                                                    key={inv.id}
                                                    className="border-t border-stone-800 hover:bg-stone-800/40 transition"
                                                >

                                                    {/* Material */}
                                                    <td className="px-6 py-4">

                                                        <div className="flex items-center gap-4">

                                                            {material?.primary_image ? (

                                                                <img
                                                                    src={`/storage/${material.primary_image.image_path}`}
                                                                    alt={material.material_name}
                                                                    className="w-14 h-14 rounded-xl object-cover border border-stone-700"
                                                                />

                                                            ) : (

                                                                <div className="w-14 h-14 rounded-xl bg-stone-800 border border-dashed border-stone-700 flex items-center justify-center text-[10px] text-stone-500">
                                                                    No Image
                                                                </div>

                                                            )}

                                                            <div>

                                                                <p className="text-white font-semibold">
                                                                    {material?.material_name}
                                                                </p>

                                                                <p className="text-xs text-stone-500">
                                                                    Material ID #{material?.id}
                                                                </p>

                                                            </div>

                                                        </div>

                                                    </td>

                                                    {/* Category */}
                                                    <td className="px-6 py-4 text-stone-300">
                                                        {material?.category?.raw_category_name ?? "-"}
                                                    </td>

                                                    {/* Supplier */}
                                                    <td className="px-6 py-4 text-stone-300">
                                                        {material?.supplier?.company_name ?? "-"}
                                                    </td>

                                                    {/* Price */}
                                                    <td className="px-6 py-4 text-right">

                                                        <span className="text-emerald-400 font-semibold">
                                                            ₱
                                                            {Number(
                                                                material?.purchase_price || 0
                                                            ).toLocaleString(undefined, {
                                                                minimumFractionDigits: 2,
                                                            })}
                                                        </span>

                                                    </td>

                                                    {/* Quantity */}
                                                    <td className="px-6 py-4 text-center">

                                                        <div>

                                                            <p className="text-xl font-bold text-cyan-400">
                                                                {qty}
                                                            </p>

                                                            <p className="text-xs text-stone-500">
                                                                {material?.unit?.unit_name}
                                                            </p>

                                                        </div>

                                                    </td>

                                                    {/* Status */}
                                                    <td className="px-6 py-4 text-center">

                                                        {status === "In Stock" && (
                                                            <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                                ● In Stock
                                                            </span>
                                                        )}

                                                        {status === "Low Stock" && (
                                                            <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                                                ● Low Stock
                                                            </span>
                                                        )}

                                                        {status === "Out of Stock" && (
                                                            <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                                                                ● Out of Stock
                                                            </span>
                                                        )}

                                                    </td>

                                                    {/* Last Receipt */}
                                                    <td className="px-6 py-4 text-center text-stone-300">

                                                        {inv.last_received_date
                                                            ? new Date(
                                                                inv.last_received_date
                                                            ).toLocaleDateString()
                                                            : "-"}

                                                    </td>

                                                    {/* Action */}
                                                    <td className="px-6 py-4 text-center">

                                                        <Link
                                                            href={route(
                                                                "manager.inventory.show",
                                                                inv.id
                                                            )}
                                                            className="
                                            inline-flex
                                            items-center
                                            gap-2
                                            px-4
                                            py-2
                                            rounded-lg
                                            bg-blue-500/10
                                            text-blue-400
                                            border
                                            border-blue-500/20
                                            hover:bg-blue-500/20
                                            transition
                                        "
                                                        >
                                                            <Eye size={16} />
                                                            View
                                                        </Link>

                                                    </td>

                                                </tr>

                                            );
                                        })

                                    ) : (

                                        <tr>

                                            <td
                                                colSpan="8"
                                                className="py-16 text-center text-stone-500"
                                            >
                                                No inventory records found.
                                            </td>

                                        </tr>

                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                    {/* REMARKS */}
                    <div className="mt-8">

                        <label className="block text-stone-300 mb-2 font-medium">
                            Receiving Notes
                        </label>

                        <textarea
                            value={data.remarks}
                            onChange={(e) =>
                                setData(
                                    "remarks",
                                    e.target.value
                                )
                            }
                            rows="4"
                            placeholder="Enter remarks..."
                            className="w-full bg-stone-900 border border-stone-700 rounded-2xl p-4 text-white"
                        />

                    </div>

                    {/* SUBMIT */}
                    <div className="mt-8 flex justify-end">

                        <button
                            type="submit"
                            disabled={processing}
                            className="px-8 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition"
                        >
                            {processing
                                ? "Processing..."
                                : "Complete Receiving"}
                        </button>

                    </div>

                </form>

                {Object.keys(errors).length > 0 && (
                    <div className="mt-6 bg-red-500/10 border border-red-500 rounded-xl p-4">
                        {Object.values(errors).map(
                            (error, index) => (
                                <p
                                    key={index}
                                    className="text-red-400"
                                >
                                    {error}
                                </p>
                            )
                        )}
                    </div>
                )}

            </div>
        </ManagerLayout>
    );
}
