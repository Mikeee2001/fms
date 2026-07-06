import { router, Head } from "@inertiajs/react";
import { useState } from "react";
import { useToast } from "@/Contexts/ToastContext";
import RawMaterialLayout from "@/Layouts/RawMaterialLayout";

export default function Index({ cart, total }) {

    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);

    const submit = () => {
        setLoading(true);

        router.post(route("manager.checkout.store"), {}, {
            onSuccess: () => {
                showToast("success", "Success", "Order placed successfully");
            },
            onFinish: () => setLoading(false)
        });
    };

    return (
        <RawMaterialLayout showSidebar={false}>
            <Head title="Checkout" />

            <div className="min-h-screen bg-gray-100 p-6 text-gray-900">

                {/* CART ITEMS */}
                <div className="bg-white p-5 rounded-xl shadow mb-4 border border-gray-200">
                    <h2 className="font-bold text-xl text-gray-900 mb-4">
                        Items
                    </h2>

                    {cart.map(item => (
                        <div
                            key={item.id}
                            className="flex justify-between py-3 border-b border-gray-100 text-gray-800"
                        >
                            <span className="font-medium">
                                {item.rawMaterial?.material_name ??
                                    item.raw_material?.material_name ??
                                    "No Material"}
                            </span>

                            <span className="font-semibold text-gray-900">
                                x{item.quantity}
                            </span>
                        </div>
                    ))}
                </div>

                {/* TOTAL */}
                <div className="bg-white p-5 rounded-xl shadow mb-4 border border-gray-200">
                    <h2 className="font-bold text-xl text-gray-900">
                        Total
                    </h2>

                    <p className="text-2xl font-extrabold text-black mt-2">
                        ₱{total}
                    </p>
                </div>

                {/* PAYMENT METHOD */}
                <div className="bg-white p-6 rounded-2xl shadow mb-4 border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                        Payment Method
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div className="border-2 border-indigo-600 bg-white rounded-xl p-5 flex items-center justify-between">

                            <div>
                                <p className="font-bold text-gray-900 text-lg">
                                    Cash on Delivery
                                </p>

                                <p className="text-sm text-gray-600">
                                    Pay when items are received
                                </p>
                            </div>

                            <div className="w-5 h-5 rounded-full border-2 border-indigo-600 flex items-center justify-center">
                                <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
                            </div>

                        </div>

                    </div>
                </div>

                {/* BUTTON */}
                <button
                    onClick={submit}
                    disabled={loading}
                    className="w-full py-4 bg-black hover:bg-gray-800 text-white rounded-xl font-bold text-lg transition"
                >
                    {loading ? "Processing..." : "Place Order"}
                </button>

            </div>
        </RawMaterialLayout>
    );
}
