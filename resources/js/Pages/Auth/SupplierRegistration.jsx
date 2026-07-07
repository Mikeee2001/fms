import React, { useState } from 'react';
import { useForm, Head, Link, usePage } from '@inertiajs/react';
import { Building2, User, Phone, Mail, MapPin, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputLabel from '@/Components/InputLabel';
import axios from 'axios';
import SupplierMap from "@/Components/SupplierAddressMap";

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
        latitude: '',
        longitude: '',
        company_logo: null,
    });

    const inputClasses =
        "w-full h-12 rounded-lg border border-gray-300 bg-white text-black placeholder:text-gray-400 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500";

    const companyFields = [
        {
            label: "Company Name",
            id: "company_name",
            icon: Building2,
            placeholder: "Enter company name",
            type: "text",
        },
        {
            label: "Contact Person",
            id: "contact_person",
            icon: User,
            placeholder: "Enter contact person",
            type: "text",
        },
        {
            label: "Contact Number",
            id: "contact_number",
            icon: Phone,
            placeholder: "9123456789",
            type: "tel",
        },
        {
            label: "Selected Address",
            id: "address",
            icon: MapPin,
            placeholder: "Search or drag the marker",
            type: "textarea",
            readOnly: true,
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

            <div className="flex justify-center px-4 py-6">
                <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl border border-gray-200 p-6">

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
                            <div className="grid lg:grid-cols-2 gap-6">

                                {/* LEFT */}
                                <div className="bg-white border rounded-xl p-6 shadow-sm space-y-5">

                                    {/* Email */}
                                    <div>
                                        <InputLabel value="Email Address" />

                                        <div className="relative mt-1">
                                            <Mail
                                                size={20}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                                            />

                                            <input
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData("email", e.target.value)}
                                                placeholder="Enter your email"
                                                className={inputClasses}
                                            />
                                        </div>

                                        {localErrors.email && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {localErrors.email}
                                            </p>
                                        )}
                                    </div>

                                    {/* Password */}
                                    <div>
                                        <InputLabel value="Password" />

                                        <div className="relative mt-1">
                                            <Lock
                                                size={20}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                                            />

                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={data.password}
                                                onChange={(e) => setData("password", e.target.value)}
                                                placeholder="Enter password"
                                                className={inputClasses}
                                            />

                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-500"
                                            >
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>

                                        {localErrors.password && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {localErrors.password}
                                            </p>
                                        )}
                                    </div>

                                    {/* Confirm Password */}
                                    <div>
                                        <InputLabel value="Confirm Password" />

                                        <div className="relative mt-1">
                                            <Lock
                                                size={20}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                                            />

                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                value={data.password_confirmation}
                                                onChange={(e) =>
                                                    setData("password_confirmation", e.target.value)
                                                }
                                                placeholder="Confirm password"
                                                className={inputClasses}
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowConfirmPassword(!showConfirmPassword)
                                                }
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-500"
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff size={20} />
                                                ) : (
                                                    <Eye size={20} />
                                                )}
                                            </button>
                                        </div>

                                        {localErrors.password_confirmation && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {localErrors.password_confirmation}
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        className="w-full bg-black hover:bg-gray-900 text-white py-3 rounded-lg"
                                    >
                                        Continue
                                    </button>

                                </div>

                                {/* RIGHT */}
                                <div className="bg-white border rounded-xl overflow-hidden shadow-sm">

                                    <div className="bg-gray-100 px-4 py-3 border-b">
                                        <h3 className="font-semibold text-gray-700">
                                            Select Supplier Address
                                        </h3>
                                    </div>

                                    <SupplierMap
                                        latitude={data.latitude}
                                        longitude={data.longitude}
                                        onChange={(location) => {
                                            setData("address", location.address);
                                            setData("latitude", location.latitude);
                                            setData("longitude", location.longitude);
                                        }}
                                    />

                                </div>

                            </div>
                        )}

                        {/* STEP 2 */}
                        {step === 2 && (
                            <div className="grid lg:grid-cols-2 gap-6">

                                {/* LEFT SIDE FORM DATA */}
                                <div className="bg-white border rounded-xl shadow-sm p-6 space-y-5">

                                    {/* Company Logo */}
                                    <div>
                                        <InputLabel value="Company Logo" />

                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="w-full border rounded-lg p-2"
                                        />

                                        {preview && (
                                            <img
                                                src={preview}
                                                alt="Company Logo Preview"
                                                className="mt-3 h-24 w-24 rounded-lg object-cover border"
                                            />
                                        )}
                                    </div>


                                    {/* Company Name */}
                                    <div>
                                        <InputLabel value="Company Name" />

                                        <div className="relative mt-1">
                                            <Building2
                                                size={20}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                                            />

                                            <input
                                                value={data.company_name}
                                                onChange={(e) =>
                                                    setData("company_name", e.target.value)
                                                }
                                                placeholder="Company Name"
                                                className={inputClasses}
                                            />
                                        </div>

                                        {localErrors.company_name && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {localErrors.company_name}
                                            </p>
                                        )}
                                    </div>


                                    {/* Contact Person */}
                                    <div>
                                        <InputLabel value="Contact Person" />

                                        <div className="relative mt-1">
                                            <User
                                                size={20}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                                            />

                                            <input
                                                value={data.contact_person}
                                                onChange={(e) =>
                                                    setData("contact_person", e.target.value)
                                                }
                                                placeholder="Contact Person"
                                                className={inputClasses}
                                            />
                                        </div>

                                    </div>


                                    {/* Contact Number */}
                                    <div>
                                        <InputLabel value="Contact Number" />

                                        <div className="flex mt-1">
                                            <span className="px-4 flex items-center border border-r-0 rounded-l-lg bg-white text-black font-semibold">
                                                +63
                                            </span>

                                            <input
                                                type="tel"
                                                value={data.contact_number}
                                                onChange={(e) =>
                                                    setData(
                                                        "contact_number",
                                                        e.target.value.replace(/\D/g, "").slice(0, 10)
                                                    )
                                                }
                                                placeholder="9123456789"
                                                className="w-full h-12 px-4 border rounded-r-lg text-black font-medium placeholder-gray-400"
                                            />
                                        </div>
                                    </div>




                                    {/* Address Display */}
                                    <div>
                                        <InputLabel value="Selected Address" />
                                        <textarea
                                            rows={4}
                                            value={data.address}
                                            readOnly
                                            className="
                                            w-full
                                            rounded-lg
                                            border
                                            border-gray-300
                                            bg-white
                                            text-black
                                            p-3
                                            resize-none
                                            focus:outline-none
                                        "
                                        />
                                    </div>



                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg"
                                    >
                                        {processing ? "Creating..." : "Create Account"}
                                    </button>


                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="w-full bg-gray-900 hover:bg-black text-white py-3 rounded-lg"
                                    >
                                        Back
                                    </button>


                                </div>



                                {/* RIGHT SIDE MAP */}
                                <div className="bg-white border rounded-xl overflow-hidden shadow-sm">

                                    <div className="bg-gray-100 px-4 py-3 border-b">
                                        <h3 className="font-semibold text-gray-700">
                                            Select Supplier Location
                                        </h3>
                                    </div>


                                    <SupplierMap
                                        latitude={data.latitude}
                                        longitude={data.longitude}
                                        onChange={(location) => {

                                            setData("address", location.address);

                                            setData(
                                                "latitude",
                                                location.latitude
                                            );

                                            setData(
                                                "longitude",
                                                location.longitude
                                            );

                                        }}
                                    />

                                </div>


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
