import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { confirmDialog } from 'primereact/confirmdialog';
import { useToast } from '@/Contexts/ToastContext';
import {
    HiEye,
    HiTrash,
    HiRefresh,
} from "react-icons/hi";

export default function Index({ suppliers, filters }) {
    const { showToast } = useToast();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [supplierStatus, setSupplierStatus] = useState(filters?.status || 'all');

    const archived = (supplier) => {
        confirmDialog({
            header: "Archive Supplier",
            message: `Archive "${supplier.company_name}"?`,
            icon: "pi pi-exclamation-triangle",
            acceptClassName: "p-button-warning",
            rejectClassName: "p-button-secondary",

            accept: () => {
                router.delete(route("admin.suppliers.archive", supplier.id), {
                    preserveScroll: true,
                    onSuccess: () => {
                        showToast(
                            "success",
                            "Archived",
                            "Supplier moved to archive."
                        );
                    },
                });
            },
        });
    };


    const confirmDelete = (supplier) => {
        confirmDialog({
            header: "Delete Supplier",
            message: `Delete "${supplier.company_name}"?`,
            icon: "pi pi-exclamation-triangle",
            acceptClassName: "p-button-warning",
            rejectClassName: "p-button-secondary",

            accept: () => {
                router.delete(route("admin.suppliers.forceDelete", supplier.id), {
                    preserveScroll: true,
                    onSuccess: () => {
                        showToast(
                            "success",
                            "Deleted",
                            "Supplier deleted successfully."
                        );
                    },
                });
            },
        });
    };

    const restoreSupplier = (id) => {
        router.post(route('admin.suppliers.restore', id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                showToast('success', 'Restored', 'Supplier restored successfully.');
            },
        });
    };


    const filterSuppliers = (status) => {
        setSupplierStatus(status);

        router.get(route('admin.suppliers.index'), { status }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            only: ['suppliers', 'filters'],
        });
    };

    return (
        <AdminLayout>
            <Head title="Suppliers" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-semibold text-white">Suppliers</h1>
                            <p className="text-stone-400 mt-1">Manage your material suppliers</p>
                        </div>
                    </div>

                    <div className="mb-6 flex flex-wrap gap-2">

                        {/* ALL */}
                        <button
                            onClick={() => filterSuppliers('all')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${supplierStatus === 'all'
                                ? 'bg-amber-600 text-white'
                                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                                }`}
                        >
                            All
                        </button>

                        {/* ACTIVE */}
                        <button
                            onClick={() => filterSuppliers('active')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${supplierStatus === 'active'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                                }`}
                        >
                            Active
                        </button>

                        {/* INACTIVE */}
                        <button
                            onClick={() => filterSuppliers('inactive')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${supplierStatus === 'inactive'
                                ? 'bg-red-600 text-white'
                                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                                }`}
                        >
                            Inactive
                        </button>

                        {/* ARCHIVED (SOFT DELETED) */}
                        <button
                            onClick={() => filterSuppliers('archived')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${supplierStatus === 'archived'
                                ? 'bg-stone-500 text-white'
                                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                                }`}
                        >
                            Archived
                        </button>

                    </div>

                    <div className="bg-black border border-stone-800 rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-stone-800">
                                <thead className="bg-stone-900">
                                    <tr>
                                        {/* <th className="px-6 py-3 text-left text-xs font-medium text-stone-400">No.</th> */}
                                        <th className="px-6 py-3 text-left text-xs font-medium text-stone-400">Company Logo</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-stone-400">Company Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-stone-400">Contact Person</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-stone-400">Contact Number</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-stone-400">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-stone-400">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-800">
                                    {suppliers.data.map((supplier, index) => (
                                        <tr key={supplier.id} className="hover:bg-stone-900/50">
                                            {/* No.
                                            <td className="px-6 py-4 text-sm text-stone-300">
                                                {(suppliers.current_page - 1) * suppliers.per_page + index + 1}
                                            </td> */}

                                            {/* Company Logo */}
                                            <td className="px-6 py-4">
                                                {supplier.company_logo ? (
                                                    <img
                                                        src={`/storage/${supplier.company_logo}`}
                                                        alt={supplier.company_name}
                                                        className="w-12 h-12 rounded object-cover border border-stone-700"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 rounded bg-stone-800 flex items-center justify-center text-xs text-stone-500">
                                                        No Logo
                                                    </div>
                                                )}
                                            </td>

                                            {/* Company Name, Person, Number */}
                                            <td className="px-6 py-4 text-white font-medium">{supplier.company_name}</td>
                                            <td className="px-6 py-4 text-stone-300">{supplier.contact_person ?? "—"}</td>
                                            <td className="px-6 py-4 text-stone-300">{supplier.contact_number ?? "—"}</td>

                                            {/* Unified Status Dropdown */}
                                            <td className="px-6 py-4">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newStatus =
                                                            supplier.status === "active" ? "inactive" : "active";

                                                        router.put(
                                                            route("admin.suppliers.update-status", supplier.id),
                                                            {
                                                                status: newStatus,
                                                            },
                                                            {
                                                                preserveScroll: true,
                                                                preserveState: true,
                                                                onSuccess: () => {
                                                                    supplier.status = newStatus;

                                                                    showToast(
                                                                        "success",
                                                                        "Status Updated",
                                                                        `${supplier.company_name} is now ${newStatus}.`
                                                                    );
                                                                },
                                                                onError: () => {
                                                                    showToast(
                                                                        "error",
                                                                        "Update Failed",
                                                                        "Unable to update supplier status."
                                                                    );
                                                                },
                                                            }
                                                        );
                                                    }}
                                                    className={`relative inline-flex h-7 w-20 items-center rounded-full transition-colors duration-300 ${supplier.status === "active"
                                                        ? "bg-green-500"
                                                        : "bg-red-500"
                                                        }`}
                                                >
                                                    {/* Circle */}
                                                    <span
                                                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 ${supplier.status === "active"
                                                            ? "translate-x-14"
                                                            : "translate-x-1"
                                                            }`}
                                                    />

                                                    {/* Text */}
                                                    <span
                                                        className={`absolute text-[11px] font-semibold text-white ${supplier.status === "active"
                                                            ? "left-2"
                                                            : "right-2"
                                                            }`}
                                                    >
                                                        {supplier.status === "active" ? "Active" : "Inactive"}
                                                    </span>
                                                </button>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">

                                                    {/* View */}
                                                    <button
                                                        onClick={() => openViewModal(supplier)}
                                                        className="text-blue-500 hover:text-blue-400"
                                                        title="View"
                                                    >
                                                        <HiEye className="w-5 h-5" />
                                                    </button>

                                                    {supplierStatus === "archived" ? (
                                                        <>
                                                            {/* Restore */}
                                                            <button
                                                                onClick={() => restoreSupplier(supplier.id)}
                                                                className="text-green-500 hover:text-green-400"
                                                                title="Restore"
                                                            >
                                                                <HiRefresh className="w-5 h-5" />
                                                            </button>

                                                            {/* Permanent Delete */}
                                                            <button
                                                                onClick={() => confirmDelete(supplier)}
                                                                className="text-red-600 hover:text-red-500"
                                                                title="Delete Permanently"
                                                            >
                                                                <HiTrash className="w-5 h-5" />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        /* Archive */
                                                        <button
                                                            onClick={() => archived(supplier)}
                                                            className="text-yellow-500 hover:text-yellow-400"
                                                            title="Archive"
                                                        >
                                                            <HiTrash className="w-5 h-5" />
                                                        </button>
                                                    )}

                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {suppliers.links && suppliers.links.length > 0 && (
                            <div className="px-6 py-4 border-t border-stone-800">
                                <div className="flex justify-center space-x-1">
                                    {suppliers.links.map((link, index) => (
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
