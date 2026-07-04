import { Head, useForm } from "@inertiajs/react";

export default function Create({ material }) {
    const { data, setData, post, processing } =
        useForm({
            raw_material_id: material.id,
            quantity: 1,
            notes: "",
        });

    const submit = (e) => {
        e.preventDefault();

        post(
            route(
                "manager.purchase-orders.store"
            )
        );
    };

    return (
        <>
            <Head title="Create Purchase Order" />

            <div className="max-w-xl mx-auto p-6">

                <div className="bg-white rounded-xl shadow p-6">

                    <h1 className="text-2xl font-bold mb-5">
                        Purchase Order
                    </h1>

                    <p>
                        Material:
                        <strong>
                            {material.material_name}
                        </strong>
                    </p>

                    <p>
                        Supplier:
                        <strong>
                            {
                                material.supplier
                                    ?.company_name
                            }
                        </strong>
                    </p>

                    <p>
                        Price:
                        <strong>
                            ₱
                            {material.purchase_price}
                        </strong>
                    </p>

                    <form
                        onSubmit={submit}
                        className="mt-5 space-y-4"
                    >
                        <input
                            type="number"
                            min="1"
                            value={data.quantity}
                            onChange={(e) =>
                                setData(
                                    "quantity",
                                    e.target.value
                                )
                            }
                            className="w-full border rounded-lg p-3"
                        />

                        <textarea
                            value={data.notes}
                            onChange={(e) =>
                                setData(
                                    "notes",
                                    e.target.value
                                )
                            }
                            className="w-full border rounded-lg p-3"
                            placeholder="Notes"
                        />

                        <button
                            disabled={processing}
                            className="w-full bg-amber-600 text-white py-3 rounded-lg"
                        >
                            Create Purchase Order
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
