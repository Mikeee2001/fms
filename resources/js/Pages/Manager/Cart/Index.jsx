import { router, Head, usePage } from "@inertiajs/react";
import RawMaterialLayout from "@/Layouts/RawMaterialLayout";
import { Trash2, Minus, Plus } from "lucide-react";
import { useToast } from "@/Contexts/ToastContext";

export default function Index({ cart = [], total_items }) {
    const { showToast } = useToast();
    const { flash } = usePage().props;

    const subtotal = cart.reduce((sum, item) => {
        const price = Number(item.material?.purchase_price ?? 0);
        return sum + Number(item.quantity) * price;
    }, 0);

    const updateQty = (id, qty) => {
        if (qty < 1) return;

        router.patch(route("manager.cart.update", id), {
            quantity: qty,
        }, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                showToast("success", "Success", "Cart updated successfully");

                router.reload({
                    only: ["cart", "total_items", "managerCartCount"],
                });
            },
            onError: () => {
                showToast("error", "Error", "Failed to update cart");
            },
        });
    };

    const removeItem = (id) => {
        router.delete(route("manager.cart.destroy", id), {
            preserveScroll: true,
            onSuccess: () => {
                showToast("success", "Success", "Item removed from cart");

                router.reload({
                    only: ["cart", "total_items", "managerCartCount"],
                });
            },
            onError: () => {
                showToast("error", "Error", "Failed to remove item");
            },
        });
    };

    const clearCart = () => {
        router.delete(route("manager.cart.clear"), {
            onSuccess: () => {
                showToast("success", "Success", "Cart cleared");

                router.reload({
                    only: ["cart", "total_items", "managerCartCount"],
                });
            },
        });
    };

    return (
        <RawMaterialLayout showHeader showSidebar={false}>
            <Head title="Shopping Cart" />

            <div className="max-w-7xl mx-auto p-6">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-black">
                        Shopping Cart
                    </h1>

                    <button
                        onClick={clearCart}
                        className="text-red-600 font-bold"
                    >
                        Clear Cart
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* LEFT */}
                    <div className="lg:col-span-2 space-y-4">

                        {cart.length === 0 ? (
                            <div className="p-10 border rounded-xl text-center">
                                <p className="text-black font-bold">
                                    Your cart is empty
                                </p>
                            </div>
                        ) : (
                            cart.map((item) => {
                                const material = item.material;

                                const image =
                                    material?.primaryImage?.image_path ||
                                    material?.images?.[0]?.image_path;

                                const price = Number(material?.purchase_price ?? 0);

                                const total = Number(item.quantity) * price;

                                return (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between bg-white border rounded-2xl p-4 hover:shadow-md transition"
                                    >
                                        {/* LEFT */}
                                        <div className="flex items-center gap-4">

                                            {image ? (
                                                <img
                                                    src={`/storage/${image}`}
                                                    className="w-24 h-24 object-cover rounded-xl border"
                                                />
                                            ) : (
                                                <div className="w-24 h-24 bg-gray-100 flex items-center justify-center rounded-xl border text-xs text-gray-500">
                                                    No Image
                                                </div>
                                            )}

                                            <div className="space-y-1">
                                                <h2 className="text-lg font-bold text-black">
                                                    {material?.material_name ?? "Unknown"}
                                                </h2>

                                                <p className="text-black font-semibold">
                                                    ₱{price.toLocaleString()}
                                                </p>

                                                <p className="text-black font-bold">
                                                    Subtotal: ₱{total.toLocaleString()}
                                                </p>

                                                {/* QTY */}
                                                <div className="flex items-center gap-2 mt-2">
                                                    <button
                                                        onClick={() =>
                                                            updateQty(item.id, Number(item.quantity) - 1)
                                                        }
                                                        className="w-9 h-9 flex items-center justify-center border rounded-lg"
                                                    >
                                                        <Minus size={16} />
                                                    </button>

                                                    <span className="px-4 font-bold text-black">
                                                        {item.quantity}
                                                    </span>

                                                    <button
                                                        onClick={() =>
                                                            updateQty(item.id, Number(item.quantity) + 1)
                                                        }
                                                        className="w-9 h-9 flex items-center justify-center border rounded-lg"
                                                    >
                                                        <Plus size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* REMOVE */}
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-red-600 font-bold flex items-center gap-2"
                                        >
                                            <Trash2 size={16} />
                                            Remove
                                        </button>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* RIGHT */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6 bg-white border rounded-2xl p-5 shadow-sm">

                            <h2 className="text-xl font-bold text-black mb-4">
                                Order Summary
                            </h2>

                            <div className="flex justify-between mb-2">
                                <span className="text-black">Items</span>
                                <span className="font-bold text-black">{total_items}</span>
                            </div>

                            <div className="flex justify-between mb-4">
                                <span className="text-black">Subtotal</span>
                                <span className="font-bold text-black">
                                    ₱{subtotal.toLocaleString()}
                                </span>
                            </div>

                            <div className="border-t pt-4 flex justify-between">
                                <span className="text-black font-bold">Total</span>
                                <span className="text-orange-600 font-bold">
                                    ₱{subtotal.toLocaleString()}
                                </span>
                            </div>

                            <button className="mt-5 w-full bg-black text-white py-3 rounded-xl font-bold">
                                Checkout
                            </button>

                        </div>
                    </div>

                </div>
            </div>
        </RawMaterialLayout>
    );
}
