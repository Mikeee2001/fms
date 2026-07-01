import React, { useState, useEffect } from 'react';
import { Shield, Truck, Eye, Edit, Trash2, Settings, Search, Users } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import { usePage, router, Head, Link, useForm } from '@inertiajs/react';
import { confirmDialog } from 'primereact/confirmdialog';
import { useToast } from '@/Contexts/ToastContext';

export default function Index({ users, filters = {} }) {
    const { showToast } = useToast();
    const { flash } = usePage().props;

    const [activeTab, setActiveTab] = useState(filters?.role || 'all');
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');
    const [showCreateModal, setShowCreateModal] = useState(false);

    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
    } = useForm({
        name: '',
        email: '',
        role_as: 'admin',
        specification: '',
    });

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

    useEffect(() => {
        if (flash?.success) {
            showToast('success', 'Success', flash.success);
        }

        if (flash?.error) {
            showToast('error', 'Error', flash.error);
        }

        if (flash?.info) {
            showToast('info', 'Info', flash.info);
        }
    }, [flash, showToast]);

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
        setActiveTab(filters?.role || 'all');
        setSearchQuery(filters?.search || '');
    }, [filters]);

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

    const getRoleBadge = (role) => {
        const styles = {
            admin: 'bg-purple-900/30 text-purple-400 border-purple-800/50',
            manager: 'bg-amber-900/30 text-amber-400 border-amber-800/50',
            delivery: 'bg-blue-900/30 text-blue-400 border-blue-800/50',
        };

        const icons = {
            admin: <Settings className="w-3.5 h-3.5" />,
            manager: <Shield className="w-3.5 h-3.5" />,
            delivery: <Truck className="w-3.5 h-3.5" />,
        };

        return (
            <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${styles[role]}`}
            >
                {icons[role]}
                {role.charAt(0).toUpperCase() + role.slice(1)}
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
                        <button
                            type="button"
                            onClick={() => setShowCreateModal(true)}
                            className="bg-amber-600 hover:bg-amber-500 text-black px-4 py-2 rounded-lg font-medium"
                        >
                            + Add Staff
                        </button>
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
                                    <th className="px-6 py-4">Created Date</th>
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

                                            <td className="px-6 py-4 text-stone-400 text-sm">
                                                {new Date(user.created_at).toLocaleDateString()}
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
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 w-full max-w-md">

                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">
                                Create Staff Account
                            </h2>

                            <button
                                type="button"
                                onClick={() => setShowCreateModal(false)}
                                className="text-stone-400 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();

                                post(route('admin.staff.store'), {
                                    preserveScroll: true,
                                    onSuccess: () => {
                                        reset();
                                        setShowCreateModal(false);
                                    }
                                });
                            }}
                        >
                            <div className="space-y-4">

                                <div>
                                    <label className="block text-sm mb-2">
                                        Full Name
                                    </label>

                                    <input
                                        type="text"
                                        value={data.name}
                                        placeholder='Enter Fullname'
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        className="w-full bg-black border border-stone-700 rounded-lg p-3 text-white"
                                    />

                                    {errors.name && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm mb-2">
                                        Email Address
                                    </label>

                                    <input
                                        type="email"
                                        value={data.email}
                                        placeholder='Enter Email address'
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        className="w-full bg-black border border-stone-700 rounded-lg p-3 text-white"
                                    />

                                    {errors.email && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm mb-2">
                                        Role
                                    </label>

                                    <select
                                        value={data.role_as}
                                        onChange={(e) =>
                                            setData('role_as', e.target.value)
                                        }
                                        className="w-full bg-black border border-stone-700 rounded-lg p-3 text-white"
                                    >
                                        <option value="admin">Administrator</option>
                                        <option value="manager">Manager</option>
                                        <option value="delivery">Delivery Personnel</option>
                                    </select>
                                </div>

                                {data.role_as === 'manager' && (
                                    <div>
                                        <label className="block text-sm mb-2">
                                            Manager Specification
                                        </label>

                                        <select
                                            value={data.specification}
                                            onChange={(e) =>
                                                setData('specification', e.target.value)
                                            }
                                            className="w-full bg-black border border-stone-700 rounded-lg p-3 text-white"
                                        >
                                            <option value="">Select Specification</option>
                                            <option value="Inventory Management">Inventory Management</option>
                                            <option value="Sales Management">Sales Management</option>
                                            <option value="Operations Management">Operations Management</option>
                                            <option value="Warehouse Management">Warehouse Management</option>
                                        </select>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-amber-600 hover:bg-amber-500 text-black py-3 rounded-lg font-semibold"
                                >
                                    {processing
                                        ? 'Creating Account...'
                                        : 'Create Staff Account'}
                                </button>

                            </div>
                        </form>

                    </div>
                </div>
            )}

        </AdminLayout>
    );
}
