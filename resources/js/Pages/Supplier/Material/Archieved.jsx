import SupplierLayout from '@/Layouts/SupplierLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useToast } from '@/Contexts/ToastContext';
import { confirmDialog } from 'primereact/confirmdialog';

export default function Archived({ materials }) {
    const { showToast } = useToast();

    const restoreMaterial = (material) => {
        confirmDialog({
            header: 'Restore Material',
            message: `Restore "${material.material_name}"?`,
            icon: 'pi pi-refresh',

            acceptClassName: 'p-button-success',

            accept: () => {
                router.post(
                    route('supplier.materials.restore', material.id),
                    {},
                    {
                        preserveScroll: true,

                        onSuccess: () => {
                            showToast(
                                'success',
                                'Restored',
                                `${material.material_name} restored successfully.`
                            );
                        },
                    }
                );
            },
        });
    };

    const forceDelete = (material) => {
        confirmDialog({
            header: 'Permanent Delete',
            message:
                'This material will be deleted permanently and cannot be recovered.',

            icon: 'pi pi-exclamation-triangle',

            acceptClassName: 'p-button-danger',

            accept: () => {
                router.delete(
                    route('supplier.materials.forceDelete', material.id),
                    {
                        preserveScroll: true,

                        onSuccess: () => {
                            showToast(
                                'success',
                                'Deleted',
                                'Material permanently deleted.'
                            );
                        },
                    }
                );
            },
        });
    };

    return (
        <SupplierLayout>

            <Head title="Archived Materials" />

            <div className="p-6">

                <div className="flex justify-between items-center mb-6">

                    <div>

                        <h1 className="text-3xl font-bold text-white">
                            Archived Materials
                        </h1>

                        <p className="text-stone-400 mt-1">
                            Restore or permanently delete archived materials.
                        </p>

                    </div>

                    <Link
                        href={route('supplier.materials.index')}
                        className="bg-stone-700 hover:bg-stone-600 text-white px-4 py-2 rounded-lg"
                    >
                        Back
                    </Link>

                </div>

                <div className="bg-black border border-stone-800 rounded-xl overflow-hidden">

                    <table className="w-full">

                        <thead className="bg-stone-900">

                            <tr>

                                <th className="px-5 py-3 text-left text-stone-300">
                                    Material
                                </th>

                                <th className="px-5 py-3 text-left text-stone-300">
                                    Category
                                </th>

                                <th className="px-5 py-3 text-left text-stone-300">
                                    Unit
                                </th>

                                <th className="px-5 py-3 text-left text-stone-300">
                                    Price
                                </th>

                                <th className="px-5 py-3 text-center text-stone-300">
                                    Actions
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {materials.length > 0 ? (

                                materials.map((material) => (

                                    <tr
                                        key={material.id}
                                        className="border-t border-stone-800 hover:bg-stone-900 transition"
                                    >

                                        <td className="px-5 py-4 text-white">
                                            {material.material_name}
                                        </td>

                                        <td className="px-5 py-4 text-stone-300">
                                            {material.category?.raw_category_name ?? '-'}
                                        </td>

                                        <td className="px-5 py-4 text-stone-300">
                                            {material.unit?.name ?? '-'}
                                        </td>

                                        <td className="px-5 py-4 text-green-400">
                                            ₱{Number(material.purchase_price).toFixed(2)}
                                        </td>

                                        <td className="px-5 py-4">

                                            <div className="flex justify-center gap-3">

                                                <button
                                                    onClick={() => restoreMaterial(material)}
                                                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm"
                                                >
                                                    Restore
                                                </button>

                                                <button
                                                    onClick={() => forceDelete(material)}
                                                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm"
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td
                                        colSpan="5"
                                        className="py-20"
                                    >

                                        <div className="flex flex-col items-center">

                                            <div className="w-24 h-24 rounded-full bg-stone-900 flex items-center justify-center mb-5">

                                                <i className="pi pi-trash text-4xl text-stone-500"></i>

                                            </div>

                                            <h2 className="text-2xl font-semibold text-white">
                                                No Archived Materials
                                            </h2>

                                            <p className="text-stone-500 mt-2">
                                                Archived materials will appear here.
                                            </p>

                                            <Link
                                                href={route('supplier.materials.index')}
                                                className="mt-6 px-5 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg text-white"
                                            >
                                                Back to Materials
                                            </Link>

                                        </div>

                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </SupplierLayout>
    );
}
