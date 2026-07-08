import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import ManagerLayout from "@/Layouts/ManagerLayout";
import DeliveryMap from "./DeliveryMap";

import {
    Truck,
    MapPinned,
    PackageCheck,
    Eye,
} from "lucide-react";

export default function Index({
    deliveries = [],
    shop,
}) {
    const [deliveryList, setDeliveryList] = useState(deliveries);

    const [selectedDelivery, setSelectedDelivery] = useState(
        deliveries.length ? deliveries[0] : null
    );

    const receiveOrder = (id) => {
        router.post(
            route("manager.deliveries.receive", id),
            {},
            {
                preserveScroll: true,

                onSuccess: () => {

                    // Update the delivery list
                    setDeliveryList((prev) =>
                        prev.map((delivery) =>
                            delivery.id === id
                                ? { ...delivery, status: "received" }
                                : delivery
                        )
                    );

                    // Update the selected delivery
                    setSelectedDelivery((prev) =>
                        prev
                            ? { ...prev, status: "received" }
                            : prev
                    );
                },
            }
        );
    };

    return (
        <ManagerLayout>
            <Head title="Deliveries" />

            <div className="p-6 space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white">
                            Deliveries
                        </h1>

                        <p className="text-stone-400 mt-1">
                            Track supplier deliveries to your shop.
                        </p>
                    </div>

                    <div className="bg-amber-600 text-white px-5 py-3 rounded-xl flex items-center gap-2">
                        <Truck size={22} />

                        <span className="font-semibold">
                            {deliveryList.length} Shipment(s)
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-6">

                    {/* LEFT SIDEBAR */}
                    <div className="col-span-4">

                        <div className="bg-stone-900 rounded-xl border border-stone-800 overflow-hidden">

                            <div className="px-5 py-4 border-b border-stone-800 text-white font-semibold flex items-center gap-2">
                                <PackageCheck size={18} />
                                Shipped Purchase Orders
                            </div>

                            <div className="divide-y divide-stone-800 max-h-[720px] overflow-y-auto">

                                {deliveryList.length > 0 ? (

                                    deliveryList.map((delivery) => (

                                        <div
                                            key={delivery.id}
                                            className={`p-5 cursor-pointer transition ${selectedDelivery?.id === delivery.id
                                                    ? "bg-amber-600/10 border-l-4 border-amber-500"
                                                    : "hover:bg-stone-800"
                                                }`}
                                        >

                                            <div className="flex justify-between items-center">

                                                <h2 className="text-white font-bold">
                                                    {delivery.po_number}
                                                </h2>

                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs ${delivery.status === "received"
                                                            ? "bg-green-500/20 text-green-400"
                                                            : "bg-blue-500/20 text-blue-400"
                                                        }`}
                                                >
                                                    {delivery.status}
                                                </span>

                                            </div>

                                            <div className="mt-3 text-sm text-stone-400">

                                                <p>
                                                    <strong className="text-white">
                                                        Supplier:
                                                    </strong>{" "}
                                                    {delivery.supplier?.company_name}
                                                </p>

                                                <p className="mt-1">
                                                    ₱{Number(delivery.total_amount).toLocaleString()}
                                                </p>

                                            </div>

                                            <button
                                                onClick={() => setSelectedDelivery(delivery)}
                                                className="w-full mt-4 bg-amber-600 hover:bg-amber-700 rounded-lg py-2 text-white"
                                            >
                                                View Delivery
                                            </button>

                                        </div>

                                    ))

                                ) : (

                                    <div className="p-10 text-center text-stone-400">
                                        No shipped deliveries.
                                    </div>

                                )}

                            </div>

                        </div>

                    </div>

                    {/* RIGHT CONTENT */}
                    <div className="col-span-8">

                        {selectedDelivery ? (

                            <div className="space-y-5">

                                <div className="bg-stone-900 rounded-xl border border-stone-800 p-6">

                                    <div className="flex justify-between items-center">

                                        <div>

                                            <h2 className="text-3xl font-bold text-white">
                                                {selectedDelivery.po_number}
                                            </h2>

                                            <p className="text-stone-400">
                                                Supplier Delivery Route
                                            </p>

                                        </div>

                                        <button
                                            onClick={() =>
                                                receiveOrder(selectedDelivery.id)
                                            }
                                            disabled={
                                                selectedDelivery.status === "received"
                                            }
                                            className={`px-6 py-3 rounded-lg font-semibold ${selectedDelivery.status === "received"
                                                ? "bg-stone-700 text-stone-500"
                                                : "bg-green-600 hover:bg-green-700 text-white"
                                                }`}
                                        >
                                            {selectedDelivery.status === "received"
                                                ? "Received"
                                                : "Receive Order"}
                                        </button>

                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mt-6 mb-6">

                                        <div className="bg-stone-800 rounded-lg p-5">

                                            <h3 className="text-white font-semibold">
                                                Supplier
                                            </h3>

                                            <p className="text-stone-300 mt-2">
                                                {selectedDelivery.supplier.company_name}
                                            </p>

                                            <p className="text-stone-500 text-sm">
                                                {selectedDelivery.supplier.address}
                                            </p>

                                        </div>

                                        <div className="bg-stone-800 rounded-lg p-5">

                                            <h3 className="text-white font-semibold">
                                                Destination
                                            </h3>

                                            <p className="text-stone-300 mt-2">
                                                {shop.name}
                                            </p>

                                            <p className="text-stone-500 text-sm">
                                                {shop.address}
                                            </p>

                                        </div>

                                    </div>

                                    <DeliveryMap
                                        supplier={selectedDelivery.supplier}
                                        shop={shop}
                                        status={selectedDelivery.status}
                                    />

                                </div>

                            </div>

                        ) : (

                            <div className="h-[700px] rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center">

                                <div className="text-center">

                                    <MapPinned
                                        size={70}
                                        className="mx-auto text-stone-600"
                                    />

                                    <h2 className="mt-5 text-white text-2xl font-bold">
                                        Select a Delivery
                                    </h2>

                                    <p className="text-stone-400 mt-2">
                                        Choose a purchase order to display its route.
                                    </p>

                                </div>

                            </div>

                        )}

                    </div>

                </div>
            </div>
        </ManagerLayout>
    );
}
