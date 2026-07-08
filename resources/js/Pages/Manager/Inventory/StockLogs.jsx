import ManagerLayout from "@/Layouts/ManagerLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";

export default function StockLogs() {

    const { logs } = usePage().props;

    return (
        <ManagerLayout>

            <Head title="Stock Logs" />

            <div className="p-6">

                <div className="flex justify-between items-center mb-6">

                    <div>

                        <h1 className="text-3xl font-bold text-white">
                            Stock Logs
                        </h1>

                        <p className="text-stone-400">
                            Inventory movement history
                        </p>

                    </div>

                    <Link
                        href={route("manager.inventory.index")}
                        className="px-4 py-2 rounded-lg bg-stone-800 text-white hover:bg-stone-700"
                    >
                        <div className="flex items-center gap-2">
                            <ArrowLeft size={18} />
                            Back
                        </div>
                    </Link>

                </div>

                <div className="bg-stone-900 rounded-xl overflow-hidden border border-stone-800">

                    <table className="w-full">

                        <thead className="bg-stone-950">

                            <tr>

                                <th className="p-4 text-left">Material</th>

                                <th className="p-4 text-left">Supplier</th>

                                <th className="p-4 text-center">Type</th>

                                <th className="p-4 text-center">Quantity</th>

                                <th className="p-4 text-center">Before</th>

                                <th className="p-4 text-center">After</th>

                                <th className="p-4 text-left">Remarks</th>

                                <th className="p-4 text-center">Date</th>

                            </tr>

                        </thead>

                        <tbody>

                            {logs.data.map((log) => (

                                <tr
                                    key={log.id}
                                    className="border-t border-stone-800"
                                >

                                    <td className="p-4">

                                        <div className="flex items-center gap-3">

                                            {log.material?.primary_image ? (
                                                <img
                                                    src={`/storage/${log.material.primary_image.image_path}`}
                                                    className="w-12 h-12 rounded object-cover"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded bg-stone-700"></div>
                                            )}

                                            <div>

                                                <div className="font-semibold text-white">
                                                    {log.material?.material_name}
                                                </div>

                                                <div className="text-xs text-stone-400">
                                                    {log.material?.category?.raw_category_name}
                                                </div>

                                            </div>

                                        </div>

                                    </td>

                                    <td className="p-4">
                                        {log.supplier?.company_name}
                                    </td>

                                    <td className="text-center p-4">

                                        <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs">

                                            {log.type}

                                        </span>

                                    </td>

                                    <td className="text-center p-4">

                                        {log.quantity}

                                    </td>

                                    <td className="text-center p-4">

                                        {log.stock_before}

                                    </td>

                                    <td className="text-center p-4">

                                        {log.stock_after}

                                    </td>

                                    <td className="p-4">

                                        {log.remarks}

                                    </td>

                                    <td className="text-center p-4">

                                        {new Date(log.created_at).toLocaleDateString()}

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
