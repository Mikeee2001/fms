import React, { useState } from 'react';
import { useForm, Head, Link, usePage } from '@inertiajs/react';
import { Building2, User, Phone, Mail, MapPin, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputLabel from '@/Components/InputLabel';
import axios from 'axios';

export default function RegisterSupplier() {
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [localErrors, setLocalErrors] = useState({});
    const [preview, setPreview] = useState(null);

    const { flash } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        password_confirmation: '',
        company_name: '',
        contact_person: '',
        contact_number: '',
        address: '',
        company_logo: null,
    });

    const inputClasses =
        "w-full pl-10 pr-10 py-2 border rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 outline-none";

    const companyFields = [
        {
            label: 'Company Name',
            id: 'company_name',
            icon: Building2,
            placeholder: 'Enter company name',
        },
        {
            label: 'Contact Person',
            id: 'contact_person',
            icon: User,
            placeholder: 'Enter contact person',
        },
        {
            label: 'Contact Number',
            id: 'contact_number',
            icon: Phone,
            placeholder: '9123456789',
        },
        {
            label: 'Address',
            id: 'address',
            icon: MapPin,
            placeholder: 'Enter company address',
        },
    ];

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setData('company_logo', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleNext = async (e) => {
        e.preventDefault();

        let validationErrors = {};

        if (!data.email.trim()) {
            validationErrors.email = 'Email is required';
        }

        if (!data.password) {
            validationErrors.password = 'Password is required';
        } else if (data.password.length < 8) {
            validationErrors.password = 'Password must be at least 8 characters';
        }

        if (!data.password_confirmation) {
            validationErrors.password_confirmation = 'Confirm your password';
        } else if (data.password !== data.password_confirmation) {
            validationErrors.password_confirmation = 'Passwords do not match';
        }

        if (Object.keys(validationErrors).length > 0) {
            setLocalErrors(validationErrors);
            return;
        }

        try {
            const response = await axios.post(route('check.email'), {
                email: data.email,
            });

            if (response.data.exists) {
                setLocalErrors({
                    email: 'This email address is already registered.',
                });
                return;
            }

            setLocalErrors({});
            setStep(2);
        } catch (error) {
            console.error(error);
        }
    };

    const submit = (e) => {
        e.preventDefault();

        let validationErrors = {};

        if (!data.company_name.trim()) {
            validationErrors.company_name = 'Company name is required';
        }

        if (!data.contact_person.trim()) {
            validationErrors.contact_person = 'Contact person is required';
        }

        if (!data.contact_number) {
            validationErrors.contact_number = 'Contact number is required';
        } else if (!/^9\d{9}$/.test(data.contact_number)) {
            validationErrors.contact_number =
                'Enter a valid Philippine mobile number';
        }

        if (!data.address.trim()) {
            validationErrors.address = 'Address is required';
        }

        if (Object.keys(validationErrors).length > 0) {
            setLocalErrors(validationErrors);
            return;
        }

        post(route('supplier.register.store'), {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    return (
        <GuestLayout>
            <Head title="Supplier Registration" />

            <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10 px-4">
                <div className="w-full max-w-lg bg-white rounded-2xl border border-gray-200 shadow-sm p-8">

                    {/* HEADER */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <div className="h-16 w-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                                <Building2 className="h-8 w-8 text-white" />
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold text-gray-900">
                            Create Supplier Account
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Join us to start supplying materials
                        </p>
                    </div>

                    {/* STEP INDICATOR */}
                    <div className="flex gap-2 mb-8">
                        <div className={`h-2 flex-1 rounded-full ${step >= 1 ? 'bg-orange-500' : 'bg-gray-200'}`} />
                        <div className={`h-2 flex-1 rounded-full ${step >= 2 ? 'bg-orange-500' : 'bg-gray-200'}`} />
                    </div>

                    <form onSubmit={submit}>

                        {/* STEP 1 */}
                        {step === 1 && (
                            <div className="space-y-4">

                                {/* EMAIL */}
                                <div>
                                    <InputLabel value="Email" />
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                        <input
                                            type="email"
                                            value={data.email}
                                            placeholder='Enter email'
                                            onChange={(e) =>
                                                setData('email', e.target.value)
                                            }
                                            className={inputClasses}
                                        />
                                    </div>
                                    {localErrors.email && (
                                        <p className="text-red-500 text-xs">{localErrors.email}</p>
                                    )}
                                </div>

                                {/* PASSWORD */}
                                <div>
                                    <InputLabel value="Password" />

                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />

                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={data.password}
                                            placeholder="Enter password"
                                            onChange={(e) => setData('password', e.target.value)}
                                            className={inputClasses}
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-3 text-gray-500"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-5 h-5" />
                                            ) : (
                                                <Eye className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>

                                    {localErrors.password && (
                                        <p className="text-red-500 text-xs">{localErrors.password}</p>
                                    )}
                                </div>

                                {/* CONFIRM PASSWORD */}
                                <div>
                                    <InputLabel value="Confirm Password" />

                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />

                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            placeholder="Enter confirm password"
                                            value={data.password_confirmation}
                                            onChange={(e) =>
                                                setData('password_confirmation', e.target.value)
                                            }
                                            className={inputClasses}
                                        />

                                        {/* 👁️ EYE ICON ADDED HERE */}
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-3 text-gray-500"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="w-5 h-5" />
                                            ) : (
                                                <Eye className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>

                                    {localErrors.password_confirmation && (
                                        <p className="text-red-500 text-xs">
                                            {localErrors.password_confirmation}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="w-full bg-black text-white py-3 rounded-lg flex justify-center items-center gap-2"
                                >
                                    Continue <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        {/* STEP 2 */}
                        {/* STEP 2 */}
                        {step === 2 && (
                            <div className="space-y-4">

                                {/* LOGO */}
                                <div>
                                    <InputLabel value="Company Logo" />

                                    <input
                                        type="file"
                                        onChange={handleImageChange}
                                        className="w-full border rounded-lg p-2"
                                        accept="image/*"
                                    />

                                    {preview && (
                                        <img
                                            src={preview}
                                            className="h-24 w-24 object-cover rounded mt-2"
                                        />
                                    )}
                                </div>

                                {/* COMPANY FIELDS */}
                                {companyFields.map((field) => (
                                    <div key={field.id}>
                                        <InputLabel value={field.label} />

                                        {/* ✅ CONTACT NUMBER WITH +63 */}
                                        {field.id === 'contact_number' ? (
                                            <div className="flex">
                                                {/* +63 PREFIX */}
                                                <span className="flex items-center px-3 border border-r-0 rounded-l-lg bg-gray-100 text-gray-700">
                                                    +63
                                                </span>

                                                <input
                                                    type="tel"
                                                    value={data.contact_number}
                                                    placeholder="9123456789"
                                                    onChange={(e) =>
                                                        setData(
                                                            'contact_number',
                                                            e.target.value
                                                                .replace(/\D/g, '') // numbers only
                                                                .slice(0, 10) // max 10 digits
                                                        )
                                                    }
                                                    className="w-full py-2 border rounded-r-lg text-gray-900 focus:ring-2 focus:ring-orange-500 outline-none"
                                                />
                                            </div>
                                        ) : (
                                            <div className="relative">
                                                <field.icon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />

                                                <input
                                                    value={data[field.id]}
                                                    onChange={(e) =>
                                                        setData(field.id, e.target.value)
                                                    }
                                                    placeholder={field.placeholder}
                                                    className={inputClasses}
                                                />
                                            </div>
                                        )}

                                        {/* ERROR MESSAGE */}
                                        {localErrors[field.id] && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {localErrors[field.id]}
                                            </p>
                                        )}
                                    </div>
                                ))}

                                {/* BUTTONS */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-orange-500 text-white py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-70"
                                >
                                    {processing && (
                                        <svg
                                            className="w-5 h-5 animate-spin"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                                fill="none"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v8H4z"
                                            />
                                        </svg>
                                    )}

                                    {processing ? 'Creating...' : 'Create Account'}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="w-full bg-black text-white py-3 rounded-lg"
                                >
                                    Back
                                </button>
                            </div>
                        )}

                    </form>

                    {/* FLASH MESSAGE */}
                    {flash.success && (
                        <div className="mt-4 bg-green-100 text-green-700 p-3 rounded">
                            {flash.success}
                        </div>
                    )}

                </div>
            </div>
        </GuestLayout>
    );
}
