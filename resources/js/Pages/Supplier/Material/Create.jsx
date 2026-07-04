import SupplierLayout from '@/Layouts/SupplierLayout';
import { Head, Link, useForm, usePage, } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { useToast } from "@/Contexts/ToastContext";

export default function Create() {


    const { categories = [], units = [], sizes = [] } = usePage().props;
    const { showToast } = useToast();
    const { flash } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        raw_material_category_id: '',
        material_name: '',
        unit_id: '',
        purchase_price: '',
        current_stock: '',
        minimum_stock: '',
        maximum_stock: '',
        size_id: '',
        size_custom: '',
        material_images: [],
    });


    useEffect(() => {
        if (flash?.success) {
            showToast("success", "Success", flash.success);
        }

        if (flash?.error) {
            showToast("error", "Error", flash.error);
        }

        if (flash?.info) {
            showToast("info", "Info", flash.info);
        }
    }, [flash]);


    function submit(e) {
        e.preventDefault();

        post(route('supplier.materials.store'), {
            forceFormData: true,

            onSuccess: () => {
                showToast(
                    "success",
                    "Success",
                    "Raw material created successfully!"
                );
            },

            onError: (err) => {
                console.log("VALIDATION ERROR:", err);

                showToast({
                    type: "error",
                    message: "Please fix the errors and try again."
                });
            }
        });
    }
    const [previews, setPreviews] = useState([]);

    const handleImages = (e) => {
        const newFiles = Array.from(e.target.files);

        setData("material_images", [
            ...data.material_images,
            ...newFiles,
        ]);

        setPreviews((prev) => [
            ...prev,
            ...newFiles.map((file) =>
                URL.createObjectURL(file)
            ),
        ]);
    };


    return (
        <SupplierLayout>

            <Head title="Add Raw Material" />

            <div className="max-w-5xl mx-auto">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-6">

                    <div>
                        <h1 className="text-3xl font-bold text-white">
                            Add Raw Material
                        </h1>
                        <p className="text-stone-400 mt-2">
                            Register a new raw material and its inventory.
                        </p>
                    </div>

                    <Link
                        href={route('supplier.materials.index')}
                        className="px-4 py-2 rounded-lg bg-stone-700 hover:bg-stone-600 text-white"
                    >
                        Back
                    </Link>
                </div>

                {/* FORM */}
                <form
                    onSubmit={submit}
                    className="bg-black border border-stone-800 rounded-xl p-8 space-y-8"
                >
                    {/* FORM FIELDS */}
                    <div className="grid md:grid-cols-2 gap-6">

                        <div className="md:col-span-2">
                            <label className="block text-stone-300 mb-2">
                                Material Images
                            </label>

                            <div className="flex items-center gap-3">
                                <label className="cursor-pointer px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg">
                                    Select Images
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImages}
                                        className="hidden"
                                    />
                                </label>

                                <span className="text-stone-400 text-sm">
                                    {previews.length} image(s) selected
                                </span>
                            </div>

                            {previews.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                    {previews.map((preview, index) => (
                                        <div
                                            key={index}
                                            className="relative border border-stone-700 rounded-lg overflow-hidden"
                                        >
                                            <img
                                                src={preview}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-32 object-cover"
                                            />

                                            {index === 0 && (
                                                <span className="absolute top-2 left-2 bg-amber-600 text-white text-xs px-2 py-1 rounded">
                                                    Primary
                                                </span>
                                            )}

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const updatedPreviews =
                                                        previews.filter(
                                                            (_, i) => i !== index
                                                        );

                                                    const updatedFiles =
                                                        data.material_images.filter(
                                                            (_, i) => i !== index
                                                        );

                                                    setPreviews(updatedPreviews);
                                                    setData(
                                                        "material_images",
                                                        updatedFiles
                                                    );
                                                }}
                                                className="absolute top-2 right-2 bg-red-600 text-white w-6 h-6 rounded-full text-xs"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {errors.material_images && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.material_images}
                                </p>
                            )}
                        </div>

                        {/* Material Name */}
                        <div>
                            <label className="block text-stone-300 mb-2">Material Name</label>
                            <input
                                type="text"
                                value={data.material_name}
                                onChange={e => setData('material_name', e.target.value)}
                                placeholder="e.g. Mahogany, Steel, Leather"
                                className="w-full rounded-lg bg-stone-900 border border-stone-700 px-4 py-3 text-white"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-stone-300 mb-2">Category</label>
                            <select
                                value={data.raw_material_category_id}
                                onChange={e => setData('raw_material_category_id', e.target.value)}
                                className="w-full rounded-lg bg-stone-900 border border-stone-700 px-4 py-3 text-white"
                            >
                                <option value="">Select Category</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.raw_category_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Unit */}
                        <div>
                            <label className="block text-stone-300 mb-2">Unit</label>
                            <select
                                value={data.unit_id}
                                onChange={e => setData('unit_id', e.target.value)}
                                className="w-full rounded-lg bg-stone-900 border border-stone-700 px-4 py-3 text-white"
                            >
                                <option value="">Select Unit</option>
                                {units.map(unit => (
                                    <option key={unit.id} value={unit.id}>
                                        {unit.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* SIZE */}
                        <div>
                            <label className="block text-stone-300 mb-2">Size</label>

                            <select
                                value={data.size_id}
                                onChange={e => {
                                    setData('size_id', e.target.value);

                                    if (e.target.value !== 'custom') {
                                        setData('size_custom', '');
                                    }
                                }}
                                className="w-full rounded-lg bg-stone-900 border border-stone-700 px-4 py-3 text-white"
                            >
                                <option value="">Select Size</option>

                                {sizes.map((size) => (
                                    <option key={size.id} value={size.id}>
                                        {size.name}
                                    </option>
                                ))}

                                <option value="custom">Custom Size</option>
                            </select>

                            {errors.size_id && (
                                <p className="text-red-500 text-sm mt-1">{errors.size_id}</p>
                            )}
                        </div>

                        {/* CUSTOM SIZE INPUT */}
                        {data.size_id === 'custom' && (
                            <div>
                                <label className="block text-stone-300 mb-2">
                                    Enter Custom Size
                                </label>

                                <input
                                    type="text"
                                    value={data.size_custom}
                                    onChange={e => setData('size_custom', e.target.value)}
                                    placeholder="e.g. 2x2, 3x3, 1kg"
                                    className="w-full rounded-lg bg-stone-900 border border-stone-700 px-4 py-3 text-white"
                                />

                                {errors.size_custom && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.size_custom}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Purchase Price */}
                        <div>
                            <label className="block text-stone-300 mb-2">Purchase Price</label>
                            <input
                                type="number"
                                step="0.01"
                                value={data.purchase_price}
                                onChange={e => setData('purchase_price', e.target.value)}
                                placeholder="e.g. 120.00"
                                className="w-full rounded-lg bg-stone-900 border border-stone-700 px-4 py-3 text-white"
                            />
                        </div>

                        {/* Initial Stock */}
                        <div>
                            <label className="block text-stone-300 mb-2">Initial Stock</label>
                            <input
                                type="number"
                                step="0.01"
                                value={data.current_stock}
                                onChange={e => setData('current_stock', e.target.value)}
                                placeholder="0"
                                className="w-full rounded-lg bg-stone-900 border border-stone-700 px-4 py-3 text-white"
                            />
                        </div>

                        {/* Minimum Stock */}
                        <div>
                            <label className="block text-stone-300 mb-2">Minimum Stock</label>
                            <input
                                type="number"
                                step="0.01"
                                value={data.minimum_stock}
                                onChange={e => setData('minimum_stock', e.target.value)}
                                placeholder="0"
                                className="w-full rounded-lg bg-stone-900 border border-stone-700 px-4 py-3 text-white"
                            />
                        </div>

                        {/* Maximum Stock (full row feel but still 2-column layout) */}
                        <div className="md:col-span-2">
                            <label className="block text-stone-300 mb-2">Maximum Stock</label>
                            <input
                                type="number"
                                step="0.01"
                                value={data.maximum_stock}
                                onChange={e => setData('maximum_stock', e.target.value)}
                                placeholder="Optional"
                                className="w-full rounded-lg bg-stone-900 border border-stone-700 px-4 py-3 text-white"
                            />
                        </div>

                    </div>

                    {/* ACTIONS */}
                    <div className="flex justify-end gap-4">

                        <Link
                            href={route('supplier.materials.index')}
                            className="px-6 py-3 rounded-lg bg-stone-700 text-white"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className={`px-6 py-3 rounded-lg flex items-center justify-center gap-2 text-white transition ${processing
                                ? 'bg-amber-500 cursor-not-allowed opacity-70'
                                : 'bg-amber-600 hover:bg-amber-700'
                                }`}
                        >
                            {processing && (
                                <svg
                                    className="animate-spin h-5 w-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                            )}

                            {processing ? 'Saving...' : 'Save Raw Material'}
                        </button>
                    </div>

                </form>

            </div>

        </SupplierLayout>
    );
}
