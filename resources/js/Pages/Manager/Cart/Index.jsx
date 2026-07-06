import { router, Head, Link } from "@inertiajs/react";
import RawMaterialLayout from "@/Layouts/RawMaterialLayout";
import { useState } from 'react';

import {
    Minus,
    Plus,
    Trash2,
    ArrowLeft,
    Truck,
    ShieldCheck,
    Headphones,
    ShoppingCart,
} from "lucide-react";
import { useToast } from "@/Contexts/ToastContext";

export default function Index({ cart = [], total_items }) {
    const { showToast } = useToast();

    const [loading, setLoading] = useState(false);

    const subtotal = cart.reduce((sum, item) => {
        const price = Number(item.raw_material?.purchase_price ?? 0);
        return sum + item.quantity * price;
    }, 0);

    const updateQty = (id, qty) => {
        if (qty < 1) return;

        router.patch(
            route("manager.cart.update", id),
            { quantity: qty },
            {
                preserveScroll: true,
                onSuccess: () => {
                    showToast("success", "Updated", "Cart updated");
                },
            }
        );
    };

    const removeItem = (id) => {
        router.delete(route("manager.cart.destroy", id), {
            preserveScroll: true,
            onSuccess: () => {
                showToast("success", "Removed", "Item removed");
            },
        });
    };

    const clearCart = () => {
        router.delete(route("manager.cart.clear"), {
            preserveScroll: true,
            onSuccess: () => {
                showToast("success", "Cleared", "Cart cleared");
            },
        });
    };

    const checkout = () => {
        if (loading || cart.length === 0) return;

        setLoading(true);

        router.get(route("manager.checkout.page"), {
            preserveScroll: true,

            onSuccess: () => {
                showToast(
                    "success",
                    "Checkout",
                    "Proceeding to checkout..."
                );
            },

            onError: () => {
                showToast(
                    "error",
                    "Checkout Failed",
                    "Unable to open the checkout page."
                );
            },

            onFinish: () => {
                setLoading(false);
            },
        });
    };
    return (
        <RawMaterialLayout showSidebar={false}>
            <Head title="Shopping Cart" />

            <div className="min-h-screen bg-[#f4f6fb]">

                {/* HEADER */}
                <div className="max-w-6xl mx-auto px-6 pt-10 flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-4xl font-extrabold text-black">
                            Shopping Cart
                        </h1>
                        <p className="mt-2 text-slate-600">
                            Review your items before checkout
                        </p>
                    </div>

                    <div className="flex gap-3 mt-5 md:mt-0">
                        <Link
                            href="/manager/raw-materials"
                            className="px-5 py-3 rounded-2xl bg-white shadow-sm hover:shadow-md transition flex items-center gap-2 font-semibold text-black"
                        >
                            <ArrowLeft size={18} />
                            Continue Shopping
                        </Link>

                        {cart.length > 0 && (
                            <button
                                onClick={clearCart}
                                className="px-5 py-3 rounded-2xl bg-red-500 text-white font-semibold hover:bg-red-600 transition"
                            >
                                Clear Cart
                            </button>
                        )}
                    </div>
                </div>

                {/* MAIN GRID */}
                <div className="max-w-6xl mx-auto px-6 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* LEFT CART */}
                    <div className="lg:col-span-8 flex flex-col gap-6">

                        {cart.length === 0 ? (
                            <div className="bg-white rounded-2xl shadow-sm p-14 text-center flex flex-col items-center justify-center">

                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-5 shadow-md">
                                    <ShoppingCart size={34} className="text-white" />
                                </div>

                                <h2 className="text-2xl font-bold text-black">
                                    Your cart is empty
                                </h2>

                                <p className="mt-2 text-slate-600">
                                    Start adding items to build your order
                                </p>

                                <Link
                                    href="/manager/raw-materials"
                                    className="mt-6 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold shadow-md hover:opacity-90 transition"
                                >
                                    Browse Products
                                </Link>
                            </div>
                        ) : (
                            cart.map((item) => {
                                const material = item.raw_material;

                                const image =
                                    material?.primary_image?.image_path ??
                                    material?.images?.[0]?.image_path ??
                                    "";

                                const price = Number(material?.purchase_price ?? 0);
                                const total = price * item.quantity;

                                return (
                                    <div
                                        key={item.id}
                                        className="bg-white rounded-2xl shadow-sm p-5 flex items-center justify-between hover:shadow-md transition"
                                    >
                                        {/* LEFT */}
                                        <div className="flex items-center gap-5">

                                            <img
                                                src={`/storage/${image}`}
                                                alt={material.material_name}
                                                className="w-28 h-28 rounded-xl object-cover border"
                                            />

                                            <div>

                                                {/* NAME + OTHER NAME */}
                                                <h2 className="text-xl font-bold text-black">
                                                    {material?.material_name}
                                                </h2>

                                                {(material?.other_name || material?.alt_name) && (
                                                    <p className="text-sm text-slate-600 mt-1">
                                                        {material.other_name || material.alt_name}
                                                    </p>
                                                )}

                                                <p className="mt-2 font-semibold text-black">
                                                    ₱{price.toLocaleString()}
                                                </p>

                                                <p className="mt-1 font-extrabold text-black text-lg">
                                                    ₱{total.toLocaleString()}
                                                </p>

                                                {/* QTY */}
                                                <div className="flex items-center gap-3 mt-4 bg-white border border-slate-200 shadow-sm w-fit px-3 py-1 rounded-full">

                                                    <button
                                                        onClick={() =>
                                                            updateQty(item.id, Number(item.quantity) - 1)
                                                        }
                                                        className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center hover:bg-indigo-200"
                                                    >
                                                        <Minus size={14} />
                                                    </button>

                                                    <span className="font-bold text-slate-700 w-6 text-center">
                                                        {item.quantity}
                                                    </span>

                                                    <button
                                                        onClick={() =>
                                                            updateQty(item.id, Number(item.quantity) + 1)
                                                        }
                                                        className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center hover:bg-indigo-200"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* REMOVE */}
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-500 font-semibold hover:bg-red-100 transition"
                                        >
                                            <Trash2 size={16} />
                                            Remove
                                        </button>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* RIGHT SUMMARY */}
                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-2xl shadow-md p-6 sticky top-6">

                            <h2 className="text-2xl font-extrabold text-black mb-6">
                                Order Summary
                            </h2>

                            <div className="space-y-4 text-black">
                                <div className="flex justify-between">
                                    <span>Items</span>
                                    <span className="font-bold">{total_items}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="font-bold">
                                        ₱{subtotal.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={checkout}
                                disabled={cart.length === 0 || loading}
                                className="w-full mt-6 py-3 rounded-2xl bg-black text-white font-bold hover:opacity-80 transition disabled:opacity-40 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
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
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v8H4z"
                                            />
                                        </svg>

                                        Loading Checkout...
                                    </>
                                ) : (
                                    "Checkout"
                                )}
                            </button>

                            {/* FEATURES */}
                            <div className="mt-6 space-y-4">

                                <Feature
                                    icon={<Truck size={18} />}
                                    title="Fast Delivery"
                                    desc="Quick and reliable delivery"
                                />

                                <Feature
                                    icon={<ShieldCheck size={18} />}
                                    title="Secure Payment"
                                    desc="100% safe checkout system"
                                />

                                <Feature
                                    icon={<Headphones size={18} />}
                                    title="24/7 Support"
                                    desc="We are always ready to help"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </RawMaterialLayout>
    );
}

/* FEATURE COMPONENT */
function Feature({ icon, title, desc }) {
    return (
        <div className="flex items-center gap-3 p-3 border rounded-xl bg-white">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-600 text-white">
                {icon}
            </div>

            <div>
                <p className="font-bold text-black">{title}</p>
                <p className="text-sm text-slate-600">{desc}</p>
            </div>
        </div>
    );
}
