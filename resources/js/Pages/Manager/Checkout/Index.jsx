import { router, Head } from "@inertiajs/react";
import { useState } from "react";
import { useToast } from "@/Contexts/ToastContext";
import RawMaterialLayout from "@/Layouts/RawMaterialLayout";

import {
    ShoppingBag,
    CreditCard,
    Truck,
    ShieldCheck,
} from "lucide-react";

export default function Index({ cart, total }) {

    const { showToast } = useToast();

    const [loading, setLoading] = useState(false);

    const submit = () => {

        setLoading(true);

        router.post(route("manager.checkout.store"), {}, {

            onSuccess: () => {

                showToast(
                    "success",
                    "Success",
                    "Order placed successfully."
                );

            },

            onFinish: () => setLoading(false),

        });

    };
    return (
        <RawMaterialLayout showSidebar={false}>

            <Head title="Checkout" />

            <div className="min-h-screen bg-slate-100">

                <div className="bg-white shadow">

                    <div className="max-w-7xl mx-auto px-8 py-8">

                        <h1 className="text-4xl font-bold text-black">
                            Checkout
                        </h1>

                        <p className="text-black mt-2">
                            Review your raw material order before placing your purchase request.
                        </p>

                    </div>

                </div>

                <div className="max-w-7xl mx-auto py-8 px-8">

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                        {/* LEFT */}

                        <div className="xl:col-span-2 space-y-8">
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

                                <div className="px-6 py-5 border-b flex items-center gap-3">

                                    <ShoppingBag
                                        size={28}
                                        className="text-orange-600"
                                    />

                                    <h2 className="text-2xl font-bold text-black">

                                        Order Summary

                                    </h2>

                                </div>

                                <div className="divide-y">

                                    {cart.map((item) => {

                                        const material = item.raw_material;

                                        if (!material) {
                                            return (
                                                <div
                                                    key={item.id}
                                                    className="p-6 bg-red-50 rounded-xl"
                                                >
                                                    <p className="font-bold text-red-600">
                                                        Material not found.
                                                    </p>
                                                </div>
                                            );
                                        }

                                        const image =
                                            material?.primary_image?.image_path ??
                                            material?.images?.[0]?.image_path ??
                                            "";

                                        const price = Number(material.purchase_price ?? 0);

                                        const subtotal = Number(item.subtotal ?? (price * item.quantity));

                                        return (

                                            <div
                                                key={item.id}
                                                className="flex justify-between items-center p-6 border-b hover:bg-slate-50 transition"
                                            >

                                                {/* LEFT */}

                                                <div className="flex gap-5">

                                                    <img
                                                        src={
                                                            image
                                                                ? `/storage/${image}`
                                                                : "/images/no-image.png"
                                                        }
                                                        alt={material.material_name}
                                                        className="w-24 h-24 rounded-xl border object-cover"
                                                    />

                                                    <div>

                                                        <h2 className="text-xl font-bold text-black">
                                                            {material.material_name}
                                                        </h2>

                                                        {material.other_name && (

                                                            <p className="text-black">
                                                                {material.other_name}
                                                            </p>

                                                        )}

                                                        <p className="mt-2 text-black">

                                                            Supplier :

                                                            <span className="font-semibold ml-2">

                                                                {material.supplier?.company_name ?? "-"}

                                                            </span>

                                                        </p>

                                                        <p className="text-black">

                                                            Category :

                                                            <span className="font-semibold ml-2">

                                                                {material.category?.raw_category_name ?? "-"}

                                                            </span>

                                                        </p>

                                                        <p className="text-black">

                                                            Unit :

                                                            <span className="font-semibold ml-2">

                                                                {material.unit?.name ?? "-"}

                                                            </span>

                                                        </p>

                                                        <p className="text-black">

                                                            Size :

                                                            <span className="font-semibold ml-2">

                                                                {material.size?.name ?? "-"}

                                                            </span>

                                                        </p>

                                                    </div>

                                                </div>

                                                {/* RIGHT */}

                                                <div className="text-right">

                                                    <p className="text-black font-bold text-lg">

                                                        ₱{price.toLocaleString()}

                                                    </p>

                                                    <p className="text-black mt-2">

                                                        Qty : {item.quantity}

                                                    </p>

                                                    <p className="text-green-700 text-2xl font-bold mt-2">

                                                        ₱{subtotal.toLocaleString()}

                                                    </p>

                                                </div>

                                            </div>

                                        );

                                    })}

                                </div>

                            </div>
                            {/* DELIVERY INFORMATION */}

                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

                                <div className="px-6 py-5 border-b flex items-center gap-3">

                                    <Truck
                                        size={28}
                                        className="text-orange-600"
                                    />

                                    <h2 className="text-2xl font-bold text-black">
                                        Delivery Information
                                    </h2>

                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">

                                    <div className="border rounded-xl p-5">

                                        <p className="text-sm font-semibold uppercase text-black">
                                            Delivery Method
                                        </p>

                                        <h3 className="text-xl font-bold text-black mt-2">
                                            Supplier Delivery
                                        </h3>

                                        <p className="text-black mt-2">
                                            Materials will be delivered by the supplier.
                                        </p>

                                    </div>

                                    <div className="border rounded-xl p-5">

                                        <p className="text-sm font-semibold uppercase text-black">
                                            Payment Type
                                        </p>

                                        <h3 className="text-xl font-bold text-black mt-2">
                                            Cash on Delivery
                                        </h3>

                                        <p className="text-black mt-2">
                                            Payment will be made after receiving the materials.
                                        </p>

                                    </div>

                                    <div className="border rounded-xl p-5">

                                        <p className="text-sm font-semibold uppercase text-black">
                                            Receiving Status
                                        </p>

                                        <h3 className="text-xl font-bold text-orange-600 mt-2">
                                            Waiting for Delivery
                                        </h3>

                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* RIGHT SIDE */}

                        <div className="xl:col-span-1">

                            <div className="sticky top-8 space-y-6">

                                {/* PAYMENT */}

                                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

                                    <div className="px-6 py-5 border-b flex items-center gap-3">

                                        <CreditCard
                                            size={28}
                                            className="text-orange-600"
                                        />

                                        <h2 className="text-2xl font-bold text-black">
                                            Payment Method
                                        </h2>

                                    </div>

                                    <div className="p-6">

                                        <div className="border-2 border-orange-500 rounded-xl p-5">

                                            <div className="flex justify-between items-center">

                                                <div>

                                                    <h3 className="text-xl font-bold text-black">
                                                        Cash on Delivery
                                                    </h3>

                                                    <p className="text-black mt-2">
                                                        Pay after the supplier delivers the raw materials.
                                                    </p>

                                                </div>

                                                <div className="w-6 h-6 rounded-full bg-orange-500"></div>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                                {/* ORDER TOTAL */}

                                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

                                    <div className="px-6 py-5 border-b">

                                        <h2 className="text-2xl font-bold text-black">
                                            Order Total
                                        </h2>

                                    </div>

                                    <div className="p-6 space-y-5">

                                        <div className="flex justify-between">

                                            <span className="font-semibold text-black">
                                                Materials Total
                                            </span>

                                            <span className="font-bold text-black">
                                                ₱{Number(total).toLocaleString()}
                                            </span>

                                        </div>

                                        <div className="flex justify-between">

                                            <span className="font-semibold text-black">
                                                Delivery Fee
                                            </span>

                                            <span className="font-bold text-green-700">
                                                FREE
                                            </span>

                                        </div>

                                        <div className="flex justify-between">

                                            <span className="font-semibold text-black">
                                                Tax
                                            </span>

                                            <span className="font-bold text-black">
                                                ₱0.00
                                            </span>

                                        </div>

                                        <hr />

                                        <div className="flex justify-between">

                                            <span className="text-2xl font-bold text-black">
                                                GRAND TOTAL
                                            </span>

                                            <span className="text-3xl font-extrabold text-green-700">
                                                ₱{Number(total).toLocaleString()}
                                            </span>

                                        </div>

                                    </div>

                                </div>
                                {/* SECURE PURCHASE */}

                                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

                                    <div className="p-6">

                                        <div className="flex items-start gap-4">

                                            <div className="bg-green-100 p-3 rounded-xl">

                                                <ShieldCheck
                                                    size={34}
                                                    className="text-green-700"
                                                />

                                            </div>

                                            <div>

                                                <h3 className="text-xl font-bold text-black">
                                                    Secure Purchase
                                                </h3>

                                                <p className="text-black mt-2 leading-relaxed">
                                                    Your purchase request will be sent directly to the
                                                    supplier. The order will remain pending until the
                                                    supplier approves it and prepares the delivery.
                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                                {/* ORDER DETAILS */}

                                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

                                    <div className="px-6 py-5 border-b">

                                        <h2 className="text-xl font-bold text-black">
                                            Order Details
                                        </h2>

                                    </div>

                                    <div className="p-6 space-y-4">

                                        <div className="flex justify-between">

                                            <span className="font-semibold text-black">
                                                Number of Items
                                            </span>

                                            <span className="font-bold text-black">
                                                {cart.length}
                                            </span>

                                        </div>

                                        <div className="flex justify-between">

                                            <span className="font-semibold text-black">
                                                Payment
                                            </span>

                                            <span className="font-bold text-green-700">
                                                Cash on Delivery
                                            </span>

                                        </div>

                                        <div className="flex justify-between">

                                            <span className="font-semibold text-black">
                                                Order Status
                                            </span>

                                            <span className="font-bold text-orange-600">
                                                Pending
                                            </span>

                                        </div>

                                    </div>

                                </div>

                                {/* PLACE ORDER BUTTON */}

                                <button
                                    onClick={submit}
                                    disabled={loading}
                                    className="w-full bg-green-700 hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-white py-5 rounded-2xl font-bold text-xl shadow-lg"
                                >
                                    {loading
                                        ? "Processing Order..."
                                        : "Place Purchase Order"}
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </RawMaterialLayout>
    )
}
