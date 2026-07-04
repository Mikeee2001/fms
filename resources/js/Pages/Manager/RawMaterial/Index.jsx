import { useState, useEffect } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import RawMaterialCard from "@/Pages/Manager/RawMaterial/RawMaterialCard";
import RawMaterialLayout from "@/Layouts/RawMaterialLayout";
import { useToast } from "@/Contexts/ToastContext";

export default function Index({
    materials,
    categories,
    suppliers,
    filters,
}) {
    const [search, setSearch] = useState(filters?.search || "");
    const [category, setCategory] = useState(filters?.category || "");
    const [supplier, setSupplier] = useState(filters?.supplier || "");
    const [loading, setLoading] = useState(false);

    const { flash } = usePage().props;
    const { showToast } = useToast();

    const applyFilters = () => {
        setLoading(true);

        router.reload({
            only: ["materials"],
            data: {
                search,
                category,
                supplier,
            },
            preserveState: true,
            preserveScroll: true,
            replace: true,
            onFinish: () => setLoading(false),
        });
    };

    const addToCart = (material) => {
        router.post("/manager/cart", {
            raw_material_id: material.id,
            supplier_id: material.supplier_id,
            quantity: 1,
        }, {
            preserveScroll: true,

            onSuccess: () => {
                showToast("success", "Success", "Added to cart successfully!");

                router.reload({
                    only: ["managerCartCount"]
                });
            },

            onError: () => {
                showToast("error", "Error", "Failed to update cart");
            }
        });
    };

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


    return (
        <RawMaterialLayout
            materials={materials}
            categories={categories}
            suppliers={suppliers}
            search={search}
            setSearch={setSearch}
            category={category}
            setCategory={setCategory}
            supplier={supplier}
            setSupplier={setSupplier}
            loading={loading}
            applyFilters={applyFilters}
            showHeader={true}
            filter={true}

        >

            <Head title="Raw Materials" />

            {/* Title */}
            <div className="mb-5">
                <h2 className="text-xl font-bold text-gray-900">
                    Raw Materials
                </h2>

                <p className="text-gray-500 mt-1">
                    {materials.total} item(s) found
                </p>
            </div>

            {/* Cards */}
            <div className="relative">

                {loading && (
                    <div className="absolute inset-0 z-20 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-xl">
                        <div className="text-center">
                            <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                            <p className="mt-3 text-gray-800 font-medium">
                                Loading materials...
                            </p>
                        </div>
                    </div>
                )}
                {materials.data.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {materials.data.map((material) => (
                                <RawMaterialCard
                                    key={material.id}
                                    material={material}
                                    addToCart={addToCart}
                                />
                            ))}
                        </div>

                        <div className="flex justify-center gap-2 mt-8 flex-wrap">
                            {materials.links.map((link, index) => (
                                <button
                                    key={index}
                                    disabled={!link.url || loading}
                                    onClick={() => {
                                        if (!link.url) return;

                                        router.visit(link.url, {
                                            only: ["materials"],
                                            preserveState: true,
                                            preserveScroll: true,
                                            replace: true,
                                            onStart: () => setLoading(true),
                                            onFinish: () => setLoading(false),
                                        });
                                    }}
                                    className={`px-4 py-2 rounded-lg border transition
                                                ${link.active
                                            ? "bg-amber-600 text-white border-amber-600"
                                            : "bg-white text-gray-900 hover:bg-gray-100"
                                        }
                                                ${!link.url
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                        }`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="bg-white rounded-2xl border shadow-sm p-10 text-center">
                        <div className="text-5xl mb-3">📦</div>

                        <h3 className="text-lg font-semibold text-gray-900">
                            No materials found
                        </h3>

                        <p className="text-gray-700 mt-2">
                            Try changing your search or filter criteria.
                        </p>
                    </div>
                )}

            </div>

        </RawMaterialLayout>
    );
}
