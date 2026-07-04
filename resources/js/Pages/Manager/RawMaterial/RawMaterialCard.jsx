import { router, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { useToast } from "@/Contexts/ToastContext";



export default function RawMaterialCard({ material, }) {


    const { showToast } = useToast();
    const { flash } = usePage().props;

    if (!material) return null;

    const image = material?.images?.[0]?.image_path;
    const stock = Number(material.inventory?.current_stock ?? 0);
    const isOut = stock === 0;
    const isLow = stock > 0 && stock <= (material.inventory?.minimum_stock ?? 10);

    const addToCart = (material) => {
        router.post("/manager/cart", {
            raw_material_id: material.id,
            supplier_id: material.supplier_id,
            quantity: 1,
        }, {
            preserveScroll: true,

            onSuccess: () => {
                showToast(
                    "success",
                    "Success",
                    "Added to cart successfully!"
                );

                router.reload({
                    only: ["managerCartCount"]
                });
            },

            onError: () => {
                showToast(
                    "error",
                    "Error",
                    "Failed to update cart"
                );
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
        <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">

            {/* IMAGE SECTION */}
            <div className="relative h-52 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">

                {image ? (
                    <img
                        src={`/storage/${image}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-400 font-medium">
                        No Image Available
                    </div>
                )}

                {/* STATUS BADGE */}
                <div className="absolute top-3 right-3">
                    <span className={`
                px-3 py-1 text-xs font-semibold rounded-full shadow-sm
                ${isOut
                            ? "bg-red-500 text-white"
                            : isLow
                                ? "bg-yellow-400 text-black"
                                : "bg-green-500 text-white"
                        }
            `}>
                        {isOut ? "Out of Stock" : isLow ? "Low Stock" : "Available"}
                    </span>
                </div>
            </div>

            {/* CONTENT */}
            <div className="p-5 space-y-3">

                {/* TITLE */}
                <h2 className="text-lg font-bold text-gray-900 leading-snug">
                    {material.material_name}
                </h2>

                {/* META INFO (CLEAN GRID STYLE) */}
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">

                    <div className="space-y-1">
                        <p><span className="text-gray-400">Category</span></p>
                        <p className="font-medium text-gray-900">
                            {material.category?.raw_category_name}
                        </p>
                    </div>

                    <div className="space-y-1">
                        <p><span className="text-gray-400">Supplier</span></p>
                        <p className="font-medium text-gray-900">
                            {material.supplier?.company_name}
                        </p>
                    </div>

                    <div className="space-y-1">
                        <p><span className="text-gray-400">Unit</span></p>
                        <p className="font-medium text-gray-900">
                            {material.unit?.name}
                        </p>
                    </div>

                    {material.size && (
                        <div className="space-y-1">
                            <p><span className="text-gray-400">Size</span></p>
                            <p className="font-medium text-gray-900">
                                {material.size.name}
                            </p>
                        </div>
                    )}
                </div>

                {/* STOCK + PRICE ROW */}
                <div className="flex items-center justify-between pt-2">

                    <div>
                        <p className="text-xs text-gray-400">Available Stock</p>
                        <p className="font-semibold text-black">
                            {stock.toFixed(0)}
                        </p>
                    </div>

                    <div className="text-right">
                        <p className="text-xs text-gray-400">Price</p>
                        <p className="text-lg font-bold text-gray-900">
                            ₱{Number(material.purchase_price).toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* DESCRIPTION */}
                {material.description && (
                    <p className="text-sm text-gray-500 line-clamp-2">
                        {material.description}
                    </p>
                )}

                {/* BUTTON */}
                <button
                    onClick={() => addToCart(material)}
                    disabled={isOut}
                    className={`
                w-full mt-3 py-3 rounded-xl font-semibold transition-all duration-200
                ${isOut
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-black text-white hover:bg-gray-800 active:scale-[0.98]"
                        }
            `}
                >
                    {isOut ? "Unavailable" : "Add to Cart"}
                </button>
            </div>
        </div>
    );
}

