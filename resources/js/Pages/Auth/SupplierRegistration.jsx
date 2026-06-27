import React, { useState } from 'react';
import { useForm, Head, Link } from '@inertiajs/react';
import { Building2, User, Phone, Mail, MapPin, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputLabel from '@/Components/InputLabel';

export default function RegisterSupplier() {
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [localErrors, setLocalErrors] = useState({});
    const [preview, setPreview] = useState(null);


    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        password_confirmation: '',
        company_name: '',
        contact_person: '',
        contact_number: '',
        address: '',
        company_logo: null,
        categories: [],
    });

    const supplierCategories = [
        'Wood',
        'Lumber',
        'Plywood',
        'Foam',
        'Fabric',
        'Metal',
        'Glass',
        'Paint',
        'Hardware',
        'Upholstery Materials',
    ];

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setData('company_logo', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleNext = (e) => {
        e.preventDefault();
        let validationErrors = {};

        if (!data.email.trim()) validationErrors.email = 'Email is required';
        if (!data.password) validationErrors.password = 'Password is required';
        if (data.password.length < 8) validationErrors.password = 'Password must be at least 8 characters';
        if (data.password !== data.password_confirmation) validationErrors.password_confirmation = 'Passwords do not match';

        setLocalErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            setStep(2);
        }
    };

    const submit = (e) => {
        e.preventDefault();

        console.log(data.company_logo);

        // Post the FormData directly
        post(route('supplier.register.store'), {
            preserveScroll: true,
            forceFormData: true,
        });
    };
    // Helper for input classes to keep code clean
    const inputClasses = "w-full pl-10 pr-10 py-2 border rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 outline-none";

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
            placeholder: 'Enter contact number',
        },
        {
            label: 'Address',
            id: 'address',
            icon: MapPin,
            placeholder: 'Enter company address',
        },
    ];
    return (
        <GuestLayout>
            <Head title="Supplier Registration" />
            <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10 px-4">
                <div className="w-full max-w-lg bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                    {/* Replace your current header div with this to match "Screenshot 2026-06-27 195401.png" */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <div className="h-16 w-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                                <Building2 className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">Create an account</h2>
                        <p className="mt-2 text-sm text-gray-600">Join us to start shopping</p>
                    </div>

                    <div className="flex gap-2 mb-8">
                        <div className={`h-2 flex-1 rounded-full ${step >= 1 ? 'bg-orange-500' : 'bg-gray-200'}`} />
                        <div className={`h-2 flex-1 rounded-full ${step >= 2 ? 'bg-orange-500' : 'bg-gray-200'}`} />
                        <div className={`h-2 flex-1 rounded-full ${step >= 3 ? 'bg-orange-500' : 'bg-gray-200'}`} />
                    </div>

                    <form onSubmit={submit}>
                        {step === 1 && (
                            <div className="space-y-4">
                                <div>
                                    <InputLabel
                                        htmlFor="email"
                                        value="Email"
                                        className="text-sm font-medium text-gray-700 mb-1"
                                    />

                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />

                                        <input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className={inputClasses}
                                            placeholder="example@email.com"
                                        />
                                    </div>

                                    {(localErrors.email || errors.email) && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {localErrors.email || errors.email}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="password"
                                        value="Password"
                                        className="text-sm font-medium text-gray-700 mb-1"
                                    />

                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />

                                        <input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Enter Password"
                                            value={data.password}
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
                                        <p className="text-red-500 text-xs mt-1">
                                            {localErrors.password}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="password_confirmation"
                                        value="Confirm Password"
                                        className="text-sm font-medium text-gray-700 mb-1"
                                    />

                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />

                                        <input
                                            id="password_confirmation"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            placeholder="Confirm Password"
                                            value={data.password_confirmation}
                                            onChange={(e) =>
                                                setData('password_confirmation', e.target.value)
                                            }
                                            className={inputClasses}
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowConfirmPassword(!showConfirmPassword)
                                            }
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
                                        <p className="text-red-500 text-xs mt-1">
                                            {localErrors.password_confirmation}
                                        </p>
                                    )}
                                </div>

                                <button type="button" onClick={handleNext} className="w-full bg-black text-white py-3 rounded-lg flex justify-center items-center gap-2">
                                    Continue <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-4">

                                <div>
                                    <InputLabel
                                        htmlFor="company_logo"
                                        value="Company Logo"
                                        className="text-sm font-medium text-gray-700 mb-1"
                                    />

                                    <input
                                        id="company_logo"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="w-full border rounded-lg p-2"
                                    />

                                    <p className="text-xs text-gray-500 mt-1">
                                        Upload JPG, PNG, or WEBP (Max: 2MB)
                                    </p>

                                    {preview && (
                                        <div className="mt-4">
                                            <img
                                                src={preview}
                                                alt="Company Logo Preview"
                                                className="h-32 w-32 object-cover rounded-lg border"
                                            />
                                        </div>
                                    )}
                                </div>

                                {companyFields.map((field) => (
                                    <div key={field.id}>
                                        <InputLabel
                                            htmlFor={field.id}
                                            value={field.label}
                                            className="text-sm font-medium text-gray-700 mb-1"
                                        />

                                        <div className="relative">
                                            <field.icon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                            <input
                                                id={field.id}
                                                value={data[field.id]}
                                                onChange={(e) => setData(field.id, e.target.value)}
                                                placeholder={field.placeholder}
                                                className={inputClasses}
                                            />
                                        </div>

                                        {errors[field.id] && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors[field.id]}
                                            </p>
                                        )}
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={() => {
                                        let validationErrors = {};

                                        if (!data.company_name.trim()) {
                                            validationErrors.company_name = 'Company name is required';
                                        }

                                        if (!data.contact_person.trim()) {
                                            validationErrors.contact_person = 'Contact person is required';
                                        }

                                        if (!data.contact_number.trim()) {
                                            validationErrors.contact_number = 'Contact number is required';
                                        }

                                        if (!data.address.trim()) {
                                            validationErrors.address = 'Address is required';
                                        }

                                        setLocalErrors(validationErrors);

                                        if (Object.keys(validationErrors).length === 0) {
                                            setStep(3);
                                        }
                                    }}
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg"
                                >
                                    Continue
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="w-full bg-black text-white py-3 rounded-lg flex justify-center items-center gap-2"
                                >
                                    Back
                                </button>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-4">
                                <InputLabel
                                    value="Products / Materials You Supply"
                                    className="text-sm font-medium text-gray-700 mb-2"
                                />

                                <div className="grid grid-cols-2 gap-3 border rounded-lg p-4">
                                    {supplierCategories.map((category) => (
                                        <label
                                            key={category}
                                            className="flex items-center gap-2"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={data.categories.includes(category)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setData('categories', [...data.categories, category]);
                                                    } else {
                                                        setData(
                                                            'categories',
                                                            data.categories.filter(item => item !== category)
                                                        );
                                                    }
                                                }}
                                            />

                                            <span className="text-sm text-gray-700">
                                                {category}
                                            </span>
                                        </label>
                                    ))}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg"
                                >
                                    {processing ? 'Registering...' : 'Complete Registration'}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="w-full bg-black text-white py-3 rounded-lg"
                                >
                                    Back
                                </button>
                            </div>
                        )}
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link
                                href={route('login')}
                                className="font-medium text-orange-600 hover:text-orange-500 transition-colors"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>

                       {/* Terms Hint */}
                <div className="text-center">
                    <p className="text-xs text-gray-500">
                        By creating an account, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </div>

                </div>

            </div>
        </GuestLayout>
    );
}
