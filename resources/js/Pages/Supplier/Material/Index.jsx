import SupplierLayout from "@/Layouts/SupplierLayout";
import { Head, Link, router, usePage, useForm } from "@inertiajs/react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useToast } from "@/Contexts/ToastContext";
import { Dialog } from "primereact/dialog";
import {
    Eye,
    Pencil,
    PlusCircle,
    Archive,
    RotateCcw,
    Trash2
} from "lucide-react"; import { useState } from "react";



export default function Index() {
    const { materials, filters, statistics } = usePage().props;
    const { showToast } = useToast();
    const [statusFilter, setStatusFilter] = useState(
        filters?.status ?? "all"
    );

    const isArchivedView = statusFilter === "archived";
    const [showStockModal, setShowStockModal] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState(null);

    const { data, setData, reset } = useForm({
        quantity: "",
        remarks: "",
    });


    const openStockModal = (material) => {
        setSelectedMaterial(material);

        reset();

        setShowStockModal(true);
    };

    const submitStock = (e) => {
        e.preventDefault();

        router.post(
            route(
                "supplier.materials.add.stock",
                selectedMaterial.id
            ),
            {
                quantity: data.quantity,
                remarks: data.remarks,
            },
            {
                preserveScroll: true,

                onSuccess: () => {
                    showToast(
                        "success",
                        "Stock Added",
                        `${data.quantity} stock added successfully.`
                    );

                    setShowStockModal(false);

                    reset();

                    router.reload({
                        only: ["materials"],
                    });
                },
            }
        );
    };

    const restoreMaterial = (material) => {
        confirmDialog({
            header: "Restore Material",
            message: `Restore "${material.material_name}"?`,
            icon: "pi pi-refresh",
            acceptClassName: "p-button-success",

            accept: () => {
                router.post(
                    route("supplier.materials.restore", material.id),
                    {},
                    {
                        preserveScroll: true,

                        onSuccess: () => {
                            showToast(
                                "success",
                                "Restored",
                                `${material.material_name} restored successfully.`
                            );

                            router.reload();
                        },
                    }
                );
            },
        });
    };

    const archiveMaterial = (material) => {
        confirmDialog({
            header: "Archive Material",
            message: `Archive "${material.material_name}"?`,
            icon: "pi pi-exclamation-triangle",
            acceptClassName: "p-button-warning",

            accept: () => {
                router.delete(
                    route("supplier.materials.archive", material.id),
                    {
                        preserveScroll: true,
                        onSuccess: () => {
                            showToast(
                                "success",
                                "Archived",
                                `${material.material_name} archived successfully.`
                            );

                            router.reload();
                        },
                    }
                );
            },
        });
    };


    const forceDeleteMaterial = (material) => {
        confirmDialog({
            header: "Permanent Delete",
            message:
                "This material will be deleted permanently and cannot be recovered.",

            icon: "pi pi-exclamation-triangle",
            acceptClassName: "p-button-danger",

            accept: () => {
                router.delete(
                    route("supplier.materials.forceDelete", material.id),
                    {
                        preserveScroll: true,

                        onSuccess: () => {
                            showToast(
                                "success",
                                "Deleted",
                                "Material permanently deleted."
                            );

                            router.reload();
                        },
                    }
                );
            },
        });
    };

    return (
        <SupplierLayout>
            <ConfirmDialog />
            <Head title="Materials" />

            <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white">
                            Raw Materials
                        </h1>

                        <p className="text-stone-400 mt-1">
                            Manage supplier materials.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href={route("supplier.materials.create")}
                            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg"
                        >
                            + Add Material
                        </Link>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">

                    {/* Total Materials */}
                    <div className="bg-stone-900 border border-stone-800 rounded-xl p-5">
                        <p className="text-sm text-stone-400">
                            Total Materials
                        </p>

                        <h2 className="text-3xl font-bold text-white mt-2">
                            {statistics.total_materials}
                        </h2>

                        <p className="text-xs text-stone-500 mt-1">
                            Available materials
                        </p>
                    </div>

                    {/* Active Materials */}
                    <div className="bg-stone-900 border border-green-800 rounded-xl p-5">
                        <p className="text-sm text-green-400">
                            Active Materials
                        </p>

                        <h2 className="text-3xl font-bold text-white mt-2">
                            {statistics.active_materials}
                        </h2>

                        <p className="text-xs text-stone-500 mt-1">
                            Currently active
                        </p>
                    </div>

                    {/* Inactive Materials */}
                    <div className="bg-stone-900 border border-red-800 rounded-xl p-5">
                        <p className="text-sm text-red-400">
                            Inactive Materials
                        </p>

                        <h2 className="text-3xl font-bold text-white mt-2">
                            {statistics.inactive_materials}
                        </h2>

                        <p className="text-xs text-stone-500 mt-1">
                            Currently inactive
                        </p>
                    </div>

                    {/* Low Stock */}
                    <div className="bg-stone-900 border border-yellow-700 rounded-xl p-5">
                        <p className="text-sm text-yellow-400">
                            Low Stock Items
                        </p>

                        <h2 className="text-3xl font-bold text-white mt-2">
                            {statistics.low_stock_materials}
                        </h2>

                        <p className="text-xs text-stone-500 mt-1">
                            Needs replenishment
                        </p>
                    </div>

                    {/* Inventory Value */}
                    <div className="bg-stone-900 border border-amber-700 rounded-xl p-5">
                        <p className="text-sm text-amber-400">
                            Inventory Value
                        </p>

                        <h2 className="text-2xl font-bold text-white mt-2">
                            ₱{Number(statistics.inventory_value).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </h2>

                        <p className="text-xs text-stone-500 mt-1">
                            Stock × Purchase Price
                        </p>
                    </div>

                </div>

                {/* Filter Tabs */}
                <div className="flex gap-3 mb-6">
                    {["all", "active", "inactive", "archived"].map(
                        (status) => (
                            <button
                                key={status}
                                onClick={() => {
                                    setStatusFilter(status);

                                    router.get(
                                        route("supplier.materials.index"),
                                        { status },
                                        {
                                            preserveState: true,
                                            preserveScroll: true,
                                            replace: true,
                                            only: ["materials", "filters"],
                                        }
                                    );
                                }}
                                className={`px-4 py-2 rounded-lg capitalize transition ${statusFilter === status
                                    ? "bg-amber-600 text-white"
                                    : "bg-stone-800 text-stone-300 hover:bg-stone-700"
                                    }`}
                            >
                                {status}
                            </button>
                        )
                    )}
                </div>

                {/* Table */}
                <div className="bg-black border border-stone-800 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-[1400px] w-full divide-y divide-stone-800">
                            <thead className="bg-stone-900">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-stone-300">
                                        Material Image
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-semibold text-stone-300">
                                        Material Name
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-semibold text-stone-300">
                                        Category
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-semibold text-stone-300">
                                        Unit
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-semibold text-stone-300">
                                        Price
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-semibold text-stone-300">
                                        Stock
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-semibold text-stone-300">
                                        Minimum
                                    </th>


                                    <th className="px-6 py-4 text-left text-sm font-semibold text-stone-300">
                                        Status
                                    </th>

                                    <th className="px-6 py-4 text-center text-sm font-semibold text-stone-300">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-stone-800">
                                {materials.data.length > 0 ? (
                                    materials.data.map((material) => {
                                        const stock =
                                            material.inventory?.current_stock ?? 0;

                                        const minimum =
                                            material.inventory?.minimum_stock ?? 0;

                                        return (
                                            <tr
                                                key={material.id}
                                                className="hover:bg-stone-900 transition"
                                            >
                                                <td className="px-6 py-4">
                                                    {material.images?.length > 0 ? (
                                                        <img
                                                            src={`/storage/${material.images[0].image_path}`}
                                                            alt={material.material_name}
                                                            className="w-14 h-14 rounded-lg object-cover border border-stone-700"
                                                        />
                                                    ) : (
                                                        <div className="w-14 h-14 rounded-lg bg-stone-800 flex items-center justify-center">
                                                            <Package
                                                                size={20}
                                                                className="text-stone-500"
                                                            />
                                                        </div>
                                                    )}
                                                </td>

                                                {/* MATERIAL */}
                                                <td className="px-6 py-4 font-medium text-white">
                                                    {material.material_name}
                                                </td>

                                                {/* CATEGORY */}
                                                <td className="px-6 py-4 text-stone-300">
                                                    {material.category?.raw_category_name ?? "-"}
                                                </td>

                                                {/* UNIT */}
                                                <td className="px-6 py-4 text-stone-300">
                                                    {material.unit?.name ?? "-"}
                                                </td>

                                                {/* PRICE */}
                                                <td className="px-6 py-4 text-emerald-400 font-medium">
                                                    ₱{Number(material.purchase_price).toFixed(2)}
                                                </td>

                                                {/* STOCK */}
                                                <td className="px-6 py-4">
                                                    <div className="text-white font-semibold">
                                                        {Number(material.inventory?.current_stock ?? 0)}
                                                    </div>

                                                    {material.inventory?.stock_status === "low_stock" && (
                                                        <span className="text-xs text-red-400">Low Stock</span>
                                                    )}

                                                    {material.inventory?.stock_status === "out_of_stock" && (
                                                        <span className="text-xs text-gray-400">Out of Stock</span>
                                                    )}

                                                    {material.inventory?.stock_status === "in_stock" && (
                                                        <span className="text-xs text-green-400">In Stock</span>
                                                    )}
                                                </td>

                                                {/* MINIMUM */}
                                                <td className="px-6 py-4 text-stone-300">
                                                    {material.inventory?.minimum_stock ?? 0}
                                                </td>

                                                {/* STATUS TOGGLE */}
                                                <td className="px-6 py-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newStatus = material.is_active ? 0 : 1;

                                                            router.put(
                                                                route("supplier.materials.updateStatus", material.id),
                                                                { is_active: newStatus },
                                                                {
                                                                    preserveScroll: true,
                                                                    preserveState: true,
                                                                    onSuccess: () => {
                                                                        router.reload({ only: ["materials"] });
                                                                    },
                                                                }
                                                            );
                                                        }}
                                                        className={`relative inline-flex h-7 w-20 items-center rounded-full transition-colors duration-300 ${material.is_active ? "bg-green-500" : "bg-red-500"
                                                            }`}
                                                    >
                                                        <span
                                                            className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 ${material.is_active ? "translate-x-14" : "translate-x-1"
                                                                }`}
                                                        />

                                                        <span
                                                            className={`absolute text-[11px] font-semibold text-white ${material.is_active ? "left-2" : "right-2"
                                                                }`}
                                                        >
                                                            {material.is_active ? "Active" : "Inactive"}
                                                        </span>
                                                    </button>
                                                </td>

                                                {/* ACTION */}
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-center gap-3">

                                                        {isArchivedView ? (
                                                            <>
                                                                <button
                                                                    onClick={() => restoreMaterial(material)}
                                                                    className="p-2 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white transition"
                                                                    title="Restore Material"
                                                                >
                                                                    <RotateCcw size={18} />
                                                                </button>

                                                                <button
                                                                    onClick={() => forceDeleteMaterial(material)}
                                                                    className="p-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white transition"
                                                                    title="Delete Permanently"
                                                                >
                                                                    <Trash2 size={18} />
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button
                                                                    onClick={() => openStockModal(material)}
                                                                    className="p-2 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white transition"
                                                                    title="Add Stock"
                                                                >
                                                                    <PlusCircle size={18} />
                                                                </button>
                                                                <Link
                                                                    href={route("supplier.materials.show", material.id)}
                                                                    className="p-2 rounded-lg bg-amber-600/20 text-amber-400 hover:bg-amber-600 hover:text-white transition"
                                                                >
                                                                    <Eye size={18} />
                                                                </Link>

                                                                <button
                                                                    onClick={() => archiveMaterial(material)}
                                                                    className="p-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white transition"
                                                                >
                                                                    <Archive size={18} />
                                                                </button>
                                                            </>
                                                        )}

                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={8}>
                                            <div className="px-6 py-12 text-center">
                                                <svg
                                                    className="mx-auto h-12 w-12 text-stone-500"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                                    />
                                                </svg>

                                                <h3 className="mt-2 text-sm font-medium text-white">
                                                    No materials found
                                                </h3>

                                                <p className="mt-1 text-sm text-stone-400">
                                                    No materials match your current
                                                    filter.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {materials.last_page > 1 && (
                            <div className="flex justify-center items-center gap-3 border-t border-stone-800 p-4">
                                <Link
                                    href={materials.prev_page_url || "#"}
                                    preserveScroll
                                    preserveState
                                    only={["materials", "filters"]}
                                    className={`px-4 py-2 rounded-lg ${materials.prev_page_url
                                        ? "bg-stone-900 hover:bg-stone-800 text-white"
                                        : "bg-stone-900 text-stone-600 pointer-events-none"
                                        }`}
                                >
                                    Previous
                                </Link>

                                <span className="px-4 py-2 rounded-lg bg-amber-600 text-white">
                                    {materials.current_page}
                                </span>

                                <Link
                                    href={materials.next_page_url || "#"}
                                    preserveScroll
                                    preserveState
                                    only={["materials", "filters"]}
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

            <Dialog
                header={`Add Stock ${selectedMaterial
                    ? `- ${selectedMaterial.material_name}`
                    : ""
                    }`}
                visible={showStockModal}
                style={{ width: "450px" }}
                onHide={() => setShowStockModal(false)}
                footer={
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setShowStockModal(false)}
                            className="px-4 py-2 rounded-md bg-stone-700 hover:bg-stone-600 text-white"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={submitStock}
                            className="px-4 py-2 rounded-md bg-amber-600 hover:bg-amber-700 text-white"
                        >
                            Add Stock
                        </button>
                    </div>
                }
                className="bg-black border border-stone-800 rounded-lg">

                <div className="space-y-4">

                    {/* Material Info */}
                    <div className="bg-stone-800 rounded-lg p-3">
                        <p className="text-xs text-stone-400">
                            Material
                        </p>

                        <p className="text-sm text-white mt-1">
                            {selectedMaterial?.material_name}
                        </p>

                        <p className="text-xs text-stone-500 mt-1">
                            Current Stock:{" "}
                            {selectedMaterial?.inventory?.current_stock ?? 0}
                        </p>
                    </div>

                    {/* Quantity */}
                    <div>
                        <label className="block text-sm font-medium text-stone-400 mb-1">
                            Quantity *
                        </label>

                        <input
                            type="number"
                            min="1"
                            value={data.quantity}
                            onChange={(e) =>
                                setData("quantity", e.target.value)
                            }
                            className="w-full rounded-md bg-stone-900 border-stone-700 text-white focus:border-amber-500 focus:ring-amber-500"
                            placeholder="Enter quantity"
                            required
                        />
                    </div>

                    {/* Remarks */}
                    <div>
                        <label className="block text-sm font-medium text-stone-400 mb-1">
                            Remarks
                        </label>

                        <textarea
                            rows="3"
                            value={data.remarks}
                            onChange={(e) =>
                                setData("remarks", e.target.value)
                            }
                            placeholder="Optional remarks"
                            className="w-full rounded-md bg-stone-900 border-stone-700 text-white focus:border-amber-500 focus:ring-amber-500"
                        />
                    </div>

                    {/* Stock Preview */}
                    {selectedMaterial && (
                        <div className="bg-stone-800 rounded-lg p-3">
                            <p className="text-xs text-stone-400">
                                New Stock After Add
                            </p>

                            <p className="text-lg font-semibold text-emerald-400 mt-1">
                                {(
                                    Number(selectedMaterial.inventory?.current_stock ?? 0) +
                                    Number(data.quantity || 0)
                                ).toLocaleString()}
                            </p>
                        </div>
                    )}

                </div>
            </Dialog>
        </SupplierLayout >
    );
}
