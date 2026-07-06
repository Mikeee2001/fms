import { router, usePage } from "@inertiajs/react";
import { useEffect } from "react";
import { useToast } from "@/Contexts/ToastContext";

export default function RawMaterialCard({ material }) {
    const { showToast } = useToast();
    const { flash } = usePage().props;

    if (!material) return null;

    const image = material?.images?.[0]?.image_path;
    const stock = Number(material.inventory?.current_stock ?? 0);
    const isOut = stock === 0;
    const isLow = stock > 0 && stock <= (material.inventory?.minimum_stock ?? 10);

    const addToCart = (material) => {
        router.post(
            "/manager/cart",
            {
                raw_material_id: material.id,
                supplier_id: material.supplier_id,
                quantity: 1,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    showToast("success", "Added", "Item added to cart");
                    router.reload({ only: ["managerCartCount"] });
                },
                onError: () => {
                    showToast("error", "Error", "Failed to add item");
                },
            }
        );
    };

    useEffect(() => {
        if (flash?.success) showToast("success", "Success", flash.success);
        if (flash?.error) showToast("error", "Error", flash.error);
        if (flash?.info) showToast("info", "Info", flash.info);
    }, [flash]);

    return (
        <div className="group bg-white rounded-2xl border border-[#f1f1f1] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">

            {/* IMAGE */}
            <div className="relative h-52 bg-gradient-to-br from-[#fff7ed] to-[#fff] overflow-hidden">

                {image ? (
                    <img
                        src={`/storage/${image}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                ) : (
                    <div className="h-full flex items-center justify-center font-medium text-[#c4b5fd]">
                        No Image Available
                    </div>
                )}

                {/* STATUS BADGE */}
                <div className="absolute top-3 right-3">
                    <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full shadow-sm
                        ${isOut
                                ? "bg-red-500 text-white"
                                : isLow
                                    ? "bg-amber-400 text-black"
                                    : "bg-emerald-500 text-white"
                            }`}
                    >
                        {isOut ? "Out of Stock" : isLow ? "Low Stock" : "Available"}
                    </span>
                </div>
            </div>

            {/* CONTENT */}
            <div className="p-5 space-y-3">

                {/* TITLE */}
                <h2 className="text-lg font-bold text-[#111827]">
                    {material.material_name}
                </h2>

                {/* GRID INFO */}
                <div className="grid grid-cols-2 gap-3 text-sm">

                    <div>
                        <p className="text-xs text-[#a78bfa]">Category</p>
                        <p className="font-semibold text-[#111827]">
                            {material.category?.raw_category_name}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-[#a78bfa]">Supplier</p>
                        <p className="font-semibold text-[#111827]">
                            {material.supplier?.company_name}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-[#a78bfa]">Unit</p>
                        <p className="font-semibold text-[#111827]">
                            {material.unit?.name}
                        </p>
                    </div>

                    {material.size && (
                        <div>
                            <p className="text-xs text-[#a78bfa]">Size</p>
                            <p className="font-semibold text-[#111827]">
                                {material.size.name}
                            </p>
                        </div>
                    )}
                </div>

                {/* STOCK + PRICE */}
                <div className="flex items-end justify-between pt-2">

                    <div>
                        <p className="text-xs text-[#a78bfa]">Stock</p>
                        <p className="font-bold text-[#111827]">{stock}</p>
                    </div>

                    <div className="text-right">
                        <p className="text-xs text-[#a78bfa]">Price</p>
                        <p className="text-lg font-extrabold text-[#111827]">
                            ₱{Number(material.purchase_price).toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* BUTTON */}
                <button
                    onClick={() => addToCart(material)}
                    disabled={isOut}
                    className={`w-full mt-3 py-3 rounded-xl font-semibold transition-all duration-200
                        ${isOut
                            ? "bg-[#f3f4f6] text-[#9ca3af] cursor-not-allowed"
                            : "bg-gradient-to-r from-[#111827] to-[#1f2937] text-white hover:opacity-90 active:scale-[0.98]"
                        }
                    `}
                >
                    {isOut ? "Unavailable" : "Add to Cart"}
                </button>
            </div>
        </div>
    );
}
