import SupplierLayout from '@/Layouts/SupplierLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Dialog } from 'primereact/dialog';
import { useState } from 'react';

export default function Index() {

    const { categories = [], allCategories = [] } = usePage().props;
    const [modalVisible, setModalVisible] = useState(false);

    const { data, setData, post, reset, processing, errors } = useForm({
        raw_material_category_id: '',
    });

    function submit(e) {
        e.preventDefault();

        post(route('supplier.raw-material-categories.store'), {
            onSuccess: () => {
                reset();
                setModalVisible(false);
            },
        });
    }

    const renderFooter = () => (
        <div className="flex justify-end gap-2">
            <button
                type="button"
                onClick={() => {
                    setModalVisible(false);
                    reset();
                }}
                className="px-4 py-2 bg-stone-700 text-white rounded hover:bg-stone-600"
            >
                Cancel
            </button>

            <button
                onClick={submit}
                disabled={processing}
                className="px-4 py-2 bg-amber-500 text-black font-semibold rounded hover:bg-amber-600"
            >
                Add Category
            </button>
        </div>
    );

    return (
        <SupplierLayout>
            <Head title="Raw Material Categories" />

            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">

                <div>
                    <h1 className="text-3xl font-bold text-white">
                        Raw Material Categories
                    </h1>

                    <p className="text-stone-400 mt-1">
                        View and manage your raw material categories.
                    </p>
                </div>

                <button
                    onClick={() => setModalVisible(true)}
                    className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-5 py-2 rounded-lg"
                >
                    + Add Category
                </button>

            </div>

            {/* TABLE */}
            <div className="bg-stone-900 rounded-xl shadow-lg overflow-hidden border border-stone-800">

                <table className="min-w-full">

                    <thead className="bg-stone-800">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs text-stone-300">#</th>
                            <th className="px-6 py-4 text-left text-xs text-stone-300">Category Name</th>
                            <th className="px-6 py-4 text-left text-xs text-stone-300">Slug</th>
                            <th className="px-6 py-4 text-center text-xs text-stone-300">Total Materials</th>
                            <th className="px-6 py-4 text-center text-xs text-stone-300">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {(categories ?? []).length > 0 ? (
                            (categories ?? []).map((category, index) => (
                                <tr
                                    key={category.id}
                                    className="border-t border-stone-800 hover:bg-stone-800 transition"
                                >
                                    <td className="px-6 py-4 text-stone-300">
                                        {index + 1}
                                    </td>

                                    <td className="px-6 py-4 text-white font-medium">
                                        {category.name}
                                    </td>

                                    <td className="px-6 py-4 text-stone-400">
                                        {category.slug}
                                    </td>

                                    <td className="px-6 py-4 text-center text-amber-400 font-semibold">
                                        {category.materials_count ?? 0}
                                    </td>

                                    <td className="px-6 py-4 text-center">
                                        <button className="text-red-500 hover:text-red-400">
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-10 text-stone-500">
                                    No categories added yet.
                                </td>
                            </tr>
                        )}
                    </tbody>

                </table>

            </div>

            {/* MODAL */}
            <Dialog
                header="Add Raw Material Category"
                visible={modalVisible}
                style={{ width: '500px' }}
                onHide={() => {
                    setModalVisible(false);
                    reset();
                }}
                footer={renderFooter()}
                className="bg-black border border-stone-800 rounded-lg"
                modalClassName="bg-black"
            >
                <div className="space-y-4 p-2">

                    <label className="block text-sm font-medium text-stone-400 mb-1">
                        Select Category *
                    </label>

                    <select
                        value={data.raw_material_category_id}
                        onChange={(e) =>
                            setData('raw_material_category_id', e.target.value)
                        }
                        className="w-full p-2 rounded bg-stone-900 text-white border border-stone-700"
                    >
                        <option value="">Select category</option>

                        {allCategories.map(cat => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>

                    {errors.raw_material_category_id && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.raw_material_category_id}
                        </p>
                    )}

                    <div className="text-xs text-stone-500 bg-stone-900 p-3 rounded-lg">
                        💡 This category will be assigned to your supplier profile.
                    </div>

                </div>
            </Dialog>

        </SupplierLayout>
    );
}
