import React, { useState, useEffect } from 'react';
import { Shield, Truck, Plus, Eye, Edit, Trash2, FileText, Settings, Search, Users } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import { usePage, router, Head, Link } from '@inertiajs/react';
import { confirmDialog } from 'primereact/confirmdialog';
import { useToast } from '@/Contexts/ToastContext';

export default function Index({ users, filters = {} }) {
    const { showToast } = useToast();
    const { flash } = usePage().props;

    const [activeTab, setActiveTab] = useState(filters?.role || 'all');
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');

    const tabs = [
        { id: 'all', label: 'All' },
        { id: 'admin', label: 'Admin' },
        { id: 'manager', label: 'Manager' },
        { id: 'delivery', label: 'Delivery' }
    ];

    useEffect(() => {
        if (filters?.role) setActiveTab(filters.role);
        if (filters?.search) setSearchQuery(filters.search);
    }, [filters]);

    // Triggers background fetch immediately without reloading the actual window layout
    const handleTabChange = (roleId) => {
        setActiveTab(roleId);

        router.get(route('admin.staff.index'), {
            role: roleId,
            search: searchQuery
        }, {
            preserveState: true,
            preserveScroll: true,
            showProgress: false,
            replace: true,
            only: ['users', 'filters'] // Only request the table prop slice from Laravel
        });
    };

    // Handles live keystroke searches instantly via background partial components swap
    const handleSearch = (e) => {
        const val = e.target.value;
        setSearchQuery(val);

        router.get(route('admin.staff.index'), {
            role: activeTab,
            search: val
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            only: ['users', 'filters']
        });
    };

    useEffect(() => {
        if (flash?.success) showToast('success', 'Success', flash.success);
        if (flash?.error) showToast('error', 'Error', flash.error);
        if (flash?.info) showToast('info', 'Info', flash.info);
    }, [flash]);

    const confirmDelete = (staff) => {
        confirmDialog({
            header: 'Delete Staff',
            message: `Are you sure you want to delete "${staff.name}"?`,
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: () => {
                router.delete(route('admin.staff.destroy', staff.id), {
                    preserveScroll: true,
                    onError: () => {
                        showToast('error', 'Delete Failed', 'Unable to delete staff member.');
                    }
                });
            },
            reject: () => {
                showToast('info', 'Cancelled', 'Deletion cancelled.');
            }
        });
    };

    const getRoleBadge = (role_as) => {
        if (role_as === 'manager') {
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-900/30 text-amber-400 border border-amber-800/50">
                    <Shield className="w-3.5 h-3.5" /> Manager
                </span>
            );
        }
        if (role_as === 'delivery') {
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-900/30 text-blue-400 border border-blue-800/50">
                    <Truck className="w-3.5 h-3.5" /> Delivery
                </span>
            );
        }
        if (role_as === 'admin') {
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-purple-900/30 text-purple-400 border border-purple-800/50">
                    <Settings className="w-3.5 h-3.5" /> Admin
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-stone-800 text-stone-400 border border-stone-700">
                {role_as}
            </span>
        );
    };

    return (
        <AdminLayout>
            <div className="py-12 bg-stone-950 min-h-screen text-stone-100">
                <Head title="Staff Management" />

                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* Header Title Bar */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
                            <p className="text-stone-400 mt-1 text-sm">Manage systems administrators, managers, and logistics dispatch personnel.</p>
                        </div>
                        <Link
                            href={route('admin.staff.create')}
                            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-black font-semibold px-4 py-2 rounded-md transition-colors text-sm"
                        >
                            <Plus className="w-4 h-4" /> Add Staff
                        </Link>
                    </div>

                    {/* Navigation Filters and Search Bar Section */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div className="flex flex-wrap gap-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => handleTabChange(tab.id)}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-150 ${activeTab === tab.id
                                        ? 'bg-amber-600 text-black font-semibold shadow-md scale-[1.02]'
                                        : 'bg-stone-900 text-stone-400 hover:bg-stone-800 hover:text-stone-200'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="relative w-full sm:w-72">
                            <span className="absolute inset-y-0 left-3 flex items-center text-stone-500 pointer-events-none">
                                <Search className="w-4 h-4" />
                            </span>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearch}
                                placeholder="Search staff..."
                                className="w-full bg-stone-900/80 border border-stone-800 rounded-md pl-9 pr-4 py-2 text-sm text-white placeholder-stone-600 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Table Matrix Container */}
                    <div className="bg-black border border-stone-800 rounded-lg overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-stone-800 bg-stone-900/50 text-stone-400 text-xs font-semibold uppercase tracking-wider">
                                    <th className="px-6 py-4">Staff Code</th>
                                    <th className="px-6 py-4">Name Details</th>
                                    <th className="px-6 py-4">Role Profile</th>
                                    <th className="px-6 py-4">Profile Metadata Details</th>
                                    <th className="px-6 py-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-800 text-sm">
                                {users.data.length > 0 ? (
                                    users.data.map((user) => (
                                        <tr key={user.id} className="hover:bg-stone-900/20 transition-colors">
                                            <td className="px-6 py-4 font-mono text-xs text-stone-400 tracking-wider font-semibold">
                                                #STF-{user.id.toString().padStart(6, '0')}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-white">{user.name}</div>
                                                <div className="text-stone-500 text-xs mt-0.5">{user.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {getRoleBadge(user.role_as)}
                                            </td>
                                            <td className="px-6 py-4">
                                                {user.role_as === 'manager' && user.manager && (
                                                    <div className="text-xs space-y-1">
                                                        <p className="text-stone-300 flex items-center gap-1.5">
                                                            <FileText className="w-3.5 h-3.5 text-amber-500" />
                                                            Spec: <span className="font-medium text-white">{user.manager.specification || 'General'}</span>
                                                        </p>
                                                        <p className="text-stone-400">
                                                            Status: <span className="capitalize text-stone-300">{user.manager.status}</span>
                                                        </p>
                                                    </div>
                                                )}
                                                {user.role_as === 'delivery' && user.delivery_personnel && (
                                                    <div className="text-xs space-y-1">
                                                        <p className="text-stone-300 capitalize">
                                                            Vehicle: <span className="font-medium text-white">{user.delivery_personnel.vehicle_type}</span>
                                                        </p>
                                                        <p className="text-stone-400 font-mono text-[11px]">
                                                            Plate: {user.delivery_personnel.plate_number || 'N/A'}
                                                        </p>
                                                    </div>
                                                )}
                                                {user.role_as !== 'manager' && user.role_as !== 'delivery' && (
                                                    <span className="text-stone-500 text-xs italic">No metadata parameters</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-3">
                                                    <Link href={route('admin.staff.show', user.id)} className="inline-flex items-center p-1.5 text-stone-400 hover:text-white transition-colors">
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                    <Link href={route('admin.staff.edit', user.id)} className="inline-flex items-center p-1.5 text-amber-500 hover:text-amber-400 transition-colors">
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => confirmDelete(user)}
                                                        className="inline-flex items-center p-1.5 text-red-500 hover:text-red-400 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                                                <div className="p-4 bg-stone-900 border border-stone-800 text-stone-500 rounded-full mb-4">
                                                    <Users className="w-8 h-8 stroke-[1.5]" />
                                                </div>
                                                <h3 className="text-sm font-semibold text-stone-200 uppercase tracking-wider">No Records Found</h3>
                                                <p className="text-xs text-stone-500 mt-1">
                                                    We couldn't find any {activeTab !== 'all' ? `${activeTab} ` : ''}staff files matching those configuration settings.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Pagination Footer */}
                        {users.links && users.links.length > 3 && users.data.length > 0 && (
                            <div className="px-6 py-4 border-t border-stone-800 bg-stone-900/20 flex items-center justify-center gap-1">
                                {users.links.map((link, index) => {
                                    let labelContent = link.label;
                                    if (labelContent.includes('Previous')) labelContent = '« Previous';
                                    if (labelContent.includes('Next')) labelContent = 'Next »';

                                    return (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            dangerouslySetInnerHTML={{ __html: labelContent }}
                                            only={['users', 'filters']}
                                            preserveScroll
                                            preserveState
                                            className={`px-3 py-1.5 rounded text-xs transition-all ${link.active
                                                ? 'bg-amber-600 text-black font-bold'
                                                : 'text-stone-400 bg-stone-900/40 hover:bg-stone-800 border border-stone-900'
                                                } ${!link.url ? 'opacity-30 cursor-not-allowed pointer-events-none' : ''}`}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
