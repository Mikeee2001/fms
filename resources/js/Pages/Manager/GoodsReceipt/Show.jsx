import ManagerLayout from "@/Layouts/ManagerLayout";
import { Head } from "@inertiajs/react";

export default function Show({ receipt }) {

    const totalOrdered =
        receipt.items.reduce(
            (sum, item) =>
                sum + Number(item.ordered_quantity),
            0
        );

    const totalReceived =
        receipt.items.reduce(
            (sum, item) =>
                sum + Number(item.received_quantity),
            0
        );

    return (
        <ManagerLayout>

            <Head title="Goods Receipt Details" />

            <div className="p-6 space-y-6">

                <div>
                    <h1 className="text-3xl font-bold text-white">
                        Goods Receipt
                    </h1>

                    <p className="text-stone-400">
                        {receipt.receipt_number}
                    </p>
                </div>

                <div className="grid md:grid-cols-4 gap-4">

                    <div className="bg-stone-900 rounded-xl p-5 border border-stone-800">
                        <p className="text-stone-400 text-sm">
                            PO Number
                        </p>

                        <h2 className="text-white font-semibold mt-2">
                            {receipt.purchase_order.po_number}
                        </h2>
                    </div>

                    <div className="bg-stone-900 rounded-xl p-5 border border-stone-800">
                        <p className="text-stone-400 text-sm">
                            Supplier
                        </p>

                        <h2 className="text-white font-semibold mt-2">
                            {
                                receipt.purchase_order
                                    .supplier
                                    .company_name
                            }
                        </h2>
                    </div>

                    <div className="bg-stone-900 rounded-xl p-5 border border-stone-800">
                        <p className="text-stone-400 text-sm">
                            Ordered
                        </p>

                        <h2 className="text-blue-400 text-2xl font-bold mt-2">
                            {totalOrdered}
                        </h2>
                    </div>

                    <div className="bg-stone-900 rounded-xl p-5 border border-stone-800">
                        <p className="text-stone-400 text-sm">
                            Received
                        </p>

                        <h2 className="text-green-400 text-2xl font-bold mt-2">
                            {totalReceived}
                        </h2>
                    </div>

                </div>

                <div className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden">

                    <table className="w-full">

                        <thead className="bg-stone-950">
                            <tr>
                                <th className="px-6 py-4 text-left text-stone-400">
                                    Material
                                </th>

                                <th className="px-6 py-4 text-center text-stone-400">
                                    Ordered
                                </th>

                                <th className="px-6 py-4 text-center text-stone-400">
                                    Received
                                </th>

                                <th className="px-6 py-4 text-center text-stone-400">
                                    Remaining
                                </th>
                            </tr>
                        </thead>

                        <tbody>

                            {receipt.items.map((item) => (

                                <tr
                                    key={item.id}
                                    className="border-t border-stone-800"
                                >
                                    <td className="px-6 py-4 text-white">
                                        {
                                            item.raw_material
                                                ?.material_name
                                        }
                                    </td>

                                    <td className="px-6 py-4 text-center text-blue-400">
                                        {item.ordered_quantity}
                                    </td>

                                    <td className="px-6 py-4 text-center text-green-400">
                                        {item.received_quantity}
                                    </td>

                                    <td className="px-6 py-4 text-center text-red-400">
                                        {item.remaining_quantity}
                                    </td>
                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

        </ManagerLayout>
    );
}
