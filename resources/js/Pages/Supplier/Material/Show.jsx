import SupplierLayout from "@/Layouts/SupplierLayout";
import { Head, Link } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";

export default function Show({ material }) {
    return (
        <SupplierLayout>
            <Head title={material.material_name} />

            <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white">
                            {material.material_name}
                        </h1>

                        <p className="text-stone-400 mt-1">
                            Material Details
                        </p>
                    </div>

                    <Link
                        href={route("supplier.materials.index")}
                        className="flex items-center gap-2 px-4 py-2 bg-stone-700 hover:bg-stone-600 text-white rounded-lg"
                    >
                        <ArrowLeft size={18} />
                        Back
                    </Link>
                </div>

                <div className="bg-black border border-stone-800 rounded-xl p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div>
                            <label className="text-stone-400 text-sm">
                                Material Name
                            </label>

                            <p className="text-white text-lg font-medium">
                                {material.material_name}
                            </p>
                        </div>

                        <div>
                            <label className="text-stone-400 text-sm">
                                Category
                            </label>

                            <p className="text-white">
                                {material.category?.raw_category_name ?? "-"}
                            </p>
                        </div>

                        <div>
                            <label className="text-stone-400 text-sm">
                                Unit
                            </label>

                            <p className="text-white">
                                {material.unit?.name ?? "-"}
                            </p>
                        </div>

                        <div>
                            <label className="text-stone-400 text-sm">
                                Size
                            </label>

                            <p className="text-white">
                                {material.size?.size_name ?? "-"}
                            </p>
                        </div>

                        <div>
                            <label className="text-stone-400 text-sm">
                                Purchase Price
                            </label>

                            <p className="text-emerald-400 font-semibold">
                                ₱{Number(material.purchase_price).toFixed(2)}
                            </p>
                        </div>

                        <div>
                            <label className="text-stone-400 text-sm">
                                Current Stock
                            </label>

                            <p className="text-white">
                                {material.inventory?.current_stock ?? 0}
                            </p>
                        </div>

                        <div>
                            <label className="text-stone-400 text-sm">
                                Minimum Stock
                            </label>

                            <p className="text-white">
                                {material.inventory?.minimum_stock ?? 0}
                            </p>
                        </div>

                        <div>
                            <label className="text-stone-400 text-sm">
                                Status
                            </label>

                            <p
                                className={`font-semibold ${
                                    material.is_active
                                        ? "text-green-400"
                                        : "text-red-400"
                                }`}
                            >
                                {material.is_active
                                    ? "Active"
                                    : "Inactive"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </SupplierLayout>
    );
}
