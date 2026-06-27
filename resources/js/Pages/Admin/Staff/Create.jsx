import React, { useState } from 'react';
import { useForm, Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft, Save, UserPlus } from 'lucide-react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        role_as: 'admin',
        specification: '',
        vehicle_type: '',
        plate_number: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.staff.store'));
    };

    return (
        <AdminLayout>
            <div className="py-12 bg-stone-950 min-h-screen text-stone-100">
                <Head title="Add New Staff" />
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">

                    <div className="flex items-center gap-4 mb-8">
                        <Link href={route('admin.staff.index')} className="p-2 hover:bg-stone-900 rounded-full transition">
                            <ArrowLeft className="w-5 h-5 text-stone-400" />
                        </Link>
                        <h1 className="text-2xl font-bold">Register New Staff Member</h1>
                    </div>

                    <form onSubmit={submit} className="bg-stone-900 border border-stone-800 rounded-lg p-8 shadow-xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Base Fields */}
                            <div className="col-span-2">
                                <label className="block text-xs font-semibold uppercase text-stone-500 mb-2">Full Name</label>
                                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} placeholder='Enter Fullname' className="w-full bg-black border border-stone-800 rounded-md p-2.5 text-white" />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>

                            <div className="col-span-2">
                                <label className="block text-xs font-semibold uppercase text-stone-500 mb-2">Email Address</label>
                                <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} placeholder='Enter Email address' className="w-full bg-black border border-stone-800 rounded-md p-2.5 text-white" />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>

                            <div className="col-span-2">
                                <label className="block text-xs font-semibold uppercase text-stone-500 mb-2">System Role</label>
                                <select value={data.role_as} onChange={e => setData('role_as', e.target.value)} className="w-full bg-black border border-stone-800 rounded-md p-2.5 text-white">
                                    <option value="admin">Administrator</option>
                                    <option value="manager">Manager</option>
                                    <option value="delivery">Delivery Personnel</option>
                                </select>
                            </div>

                            {/* Conditional Manager Fields */}
                            {data.role_as === 'manager' && (
                                <div className="col-span-2 border-t border-stone-800 pt-6 mt-2">
                                    <label className="block text-xs font-semibold uppercase text-stone-500 mb-2">Manager Specification</label>
                                    <input type="text" value={data.specification} onChange={e => setData('specification', e.target.value)} placeholder="e.g. Operations Lead" className="w-full bg-black border border-stone-800 rounded-md p-2.5 text-white" />
                                </div>
                            )}

                            {/* Conditional Delivery Fields */}
                            {data.role_as === 'delivery' && (
                                <div className="col-span-2 md:col-span-1 border-t border-stone-800 pt-6 mt-2">
                                    <label className="block text-xs font-semibold uppercase text-stone-500 mb-2">Vehicle Type</label>
                                    <input type="text" value={data.vehicle_type} onChange={e => setData('vehicle_type', e.target.value)} placeholder="e.g. Mulit-cab" className="w-full bg-black border border-stone-800 rounded-md p-2.5 text-white" />
                                </div>
                            )}
                            {data.role_as === 'delivery' && (
                                <div className="col-span-2 md:col-span-1 border-t border-stone-800 pt-6 mt-2">
                                    <label className="block text-xs font-semibold uppercase text-stone-500 mb-2">Plate Number</label>
                                    <input type="text" value={data.plate_number} onChange={e => setData('plate_number', e.target.value)} placeholder="ABC-123" className="w-full bg-black border border-stone-800 rounded-md p-2.5 text-white" />
                                </div>
                            )}

                        </div>

                        <div className="mt-8 flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-black px-6 py-2.5 rounded-md font-semibold transition-all"
                            >
                                <Save className="w-4 h-4" />
                                {processing ? 'Registering...' : 'Create Staff Member'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
