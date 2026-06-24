import { useState, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import LoginPromptModal from '../../../Components/LoginPromptModal'; // Ensure this path matches your directory structure
import {
    Minus,
    Plus,
    ShoppingBag,
    Truck,
    Shield,
    Heart
} from 'lucide-react';

export default function Show({ product }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const [mainImage, setMainImage] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedCustomizations, setSelectedCustomizations] = useState({});
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);

    useEffect(() => {
        if (product.images?.length) {
            setMainImage(`/storage/${product.images[0].image_path}`);
        }
    }, [product]);

    const handleSizeToggle = (size) => {
        if (selectedSize?.id === size.id) {
            setSelectedSize(null);
        } else {
            setSelectedSize(size);
        }
    };

    const handleCustomizationToggle = (categoryId, optionId) => {
        setSelectedCustomizations(prev => {
            const current = prev[categoryId];

            if (current?.id === optionId) {
                const updated = { ...prev };
                delete updated[categoryId];
                return updated;
            }

            const option = product.customizations[categoryId].find(
                o => o.id === optionId
            );

            return {
                ...prev,
                [categoryId]: option
            };
        });
    };

    const calculatePrice = () => {
        let price = parseFloat(product.base_price || product.price || 0);

        if (selectedSize) {
            price += parseFloat(selectedSize.additional_price || 0);
        }

        Object.values(selectedCustomizations).forEach(option => {
            price += parseFloat(option.price_modifier || 0);
        });

        return price * quantity;
    };

    // Shared payload assembler for clean data mapping
    const buildCustomizationsPayload = () => {
        const customizationsData = {};
        Object.entries(selectedCustomizations).forEach(([categoryId, option]) => {
            if (option) {
                customizationsData[categoryId] = [
                    {
                        id: option.id,
                        name: option.name,
                        price_modifier: option.price_modifier,
                    },
                ];
            }
        });
        return customizationsData;
    };

    const handleAddToCart = () => {
        // Intercept action if user is unauthenticated
        if (!user) {
            setShowLoginPrompt(true);
            return;
        }

        const requestData = {
            quantity: quantity,
            customizations: buildCustomizationsPayload(),
        };

        if (selectedSize && selectedSize.id) {
            requestData.size_id = selectedSize.id;
        }

        router.post(route('cart.add', product.id), requestData, {
            preserveScroll: true,
            onError: (errors) => {
                console.error('Add to cart error:', errors);
            },
        });
    };

    const handleBuyNow = () => {
        // Intercept action if user is unauthenticated
        if (!user) {
            setShowLoginPrompt(true);
            return;
        }

        const requestData = {
            quantity: quantity,
            customizations: buildCustomizationsPayload(),
        };

        if (selectedSize && selectedSize.id) {
            requestData.size_id = selectedSize.id;
        }

        router.post(route('cart.add', product.id), requestData, {
            preserveScroll: true,
            onSuccess: () => {
                router.get(route('checkout.index'));
            },
            onError: (errors) => {
                console.error('Buy Now checkout error:', errors);
            },
        });
    };

    return (
        <CustomerLayout>
            <Head title={product.name} />

            {/* MAIN BACKGROUND */}
            <div className="min-h-screen bg-white text-zinc-800 antialiased selection:bg-amber-500 selection:text-black py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-start">

                        {/* LEFT SIDE: Media Canvas & Gallery Showcase */}
                        <div className="space-y-4 lg:sticky lg:top-6">
                            <div className="rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-200 aspect-[4/3] shadow-md relative group">
                                <img
                                    src={mainImage || '/placeholder.jpg'}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-all duration-500 ease-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent pointer-events-none" />
                            </div>

                            {/* Thumbnail Strips */}
                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-200 scrollbar-track-transparent">
                                {product.images?.map((image, index) => {
                                    const imgUrl = `/storage/${image.image_path}`;
                                    const isCurrent = mainImage === imgUrl;
                                    return (
                                        <button
                                            key={index}
                                            onClick={() => setMainImage(imgUrl)}
                                            className={`w-20 h-20 rounded-xl overflow-hidden bg-white border-2 transition-all shrink-0 ${isCurrent
                                                    ? 'border-amber-500 scale-95 shadow-md shadow-amber-500/10'
                                                    : 'border-zinc-200 hover:border-zinc-400'
                                                }`}
                                        >
                                            <img
                                                src={imgUrl}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    );
                                })}

                                {Object.values(selectedCustomizations).map(option =>
                                    option.preview_image_url ? (
                                        <button
                                            key={option.id}
                                            onClick={() => setMainImage(option.preview_image_url)}
                                            className={`w-20 h-20 rounded-xl overflow-hidden bg-white border-2 transition-all shrink-0 ${mainImage === option.preview_image_url
                                                    ? 'border-amber-500 scale-95 shadow-md shadow-amber-500/10'
                                                    : 'border-zinc-200 hover:border-amber-500/60'
                                                }`}
                                        >
                                            <img
                                                src={option.preview_image_url}
                                                alt={option.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ) : null
                                )}
                            </div>
                        </div>

                        {/* RIGHT SIDE: Product Configurator Panel */}
                        <div className="space-y-8 bg-zinc-50/60 border border-zinc-100 rounded-2xl p-6 lg:p-8 text-zinc-900">
                            <div>
                                {product.category?.name && (
                                    <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                                        {product.category.name}
                                    </span>
                                )}
                                <h1 className="text-3xl font-bold text-zinc-950 tracking-tight mt-3">
                                    {product.name}
                                </h1>

                                <div className="mt-4 flex items-baseline gap-3">
                                    <span className="text-3xl font-black text-amber-600 tracking-tight">
                                        ₱{calculatePrice().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                    <span className="text-xs text-zinc-400 font-medium tracking-wide">
                                        (Total calculated item configuration)
                                    </span>
                                </div>
                            </div>

                            <p className="text-zinc-600 text-sm leading-relaxed border-t border-zinc-200 pt-5">
                                {product.description}
                            </p>

                            {/* Trust badges row */}
                            <div className="grid grid-cols-3 gap-3 pt-2">
                                <div className="flex flex-col sm:flex-row items-center gap-2 bg-white border border-zinc-200 px-3 py-2.5 rounded-xl text-zinc-700 text-center sm:text-left shadow-sm">
                                    <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span className="text-xs font-medium tracking-wide">Premium Quality</span>
                                </div>
                                <div className="flex flex-col sm:flex-row items-center gap-2 bg-white border border-zinc-200 px-3 py-2.5 rounded-xl text-zinc-700 text-center sm:text-left shadow-sm">
                                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500/5 shrink-0" />
                                    <span className="text-xs font-medium tracking-wide">Handcrafted</span>
                                </div>
                                <div className="flex flex-col sm:flex-row items-center gap-2 bg-white border border-zinc-200 px-3 py-2.5 rounded-xl text-zinc-700 text-center sm:text-left shadow-sm">
                                    <Truck className="w-4 h-4 text-amber-600 shrink-0" />
                                    <span className="text-xs font-medium tracking-wide">Free Delivery</span>
                                </div>
                            </div>

                            {/* Sizes Selection */}
                            {product.sizes?.length > 0 && (
                                <div className="border-t border-zinc-200 pt-6">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3.5">
                                        Select Size Option
                                    </h3>
                                    <div className="flex flex-wrap gap-2.5">
                                        {product.sizes.map(size => {
                                            const isSelected = selectedSize?.id === size.id;
                                            return (
                                                <button
                                                    key={size.id}
                                                    onClick={() => handleSizeToggle(size)}
                                                    className={`px-4 py-2.5 rounded-xl text-xs font-bold border tracking-wide transition-all ${isSelected
                                                            ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/10 scale-[0.98]'
                                                            : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 shadow-sm'
                                                        }`}
                                                >
                                                    {size.size || size.name}
                                                    {parseFloat(size.additional_price) > 0 && (
                                                        <span className={`ml-1.5 font-extrabold ${isSelected ? 'text-white' : 'text-amber-600'}`}>
                                                            +₱{parseFloat(size.additional_price).toLocaleString()}
                                                        </span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Customizations Option Grid */}
                            {Object.entries(product.customizations || {}).map(([categoryId, options]) => (
                                <div key={categoryId} className="border-t border-zinc-200 pt-6">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3.5">
                                        Customization Option
                                    </h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {options.map(option => {
                                            const isSelected = selectedCustomizations[categoryId]?.id === option.id;
                                            return (
                                                <button
                                                    key={option.id}
                                                    onClick={() => handleCustomizationToggle(categoryId, option.id)}
                                                    className={`border rounded-xl p-2.5 text-left transition-all relative flex flex-col justify-between group shadow-sm ${isSelected
                                                            ? 'border-amber-500 bg-amber-500/5 shadow-inner scale-[0.98]'
                                                            : 'border-zinc-200 bg-white hover:border-zinc-300'
                                                        }`}
                                                >
                                                    {option.preview_image_url && (
                                                        <div className="w-full aspect-square rounded-lg overflow-hidden bg-zinc-50 mb-2 border border-zinc-200">
                                                            <img
                                                                src={option.preview_image_url}
                                                                alt={option.name}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="pt-1">
                                                        <div className="text-xs font-semibold text-zinc-800 line-clamp-2">
                                                            {option.name}
                                                        </div>
                                                        {parseFloat(option.price_modifier) > 0 && (
                                                            <div className="text-xs font-black text-amber-600 mt-1">
                                                                +₱{parseFloat(option.price_modifier).toLocaleString()}
                                                            </div>
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}

                            {/* Quantity Picker */}
                            <div className="border-t border-zinc-200 pt-6">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3.5">
                                    Quantity
                                </h3>
                                <div className="inline-flex items-center bg-white border border-zinc-200 rounded-xl p-1 shadow-sm">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-9 h-9 border border-zinc-200 rounded-lg flex items-center justify-center bg-zinc-50 text-zinc-500 hover:text-zinc-800 hover:border-zinc-300 transition-all active:scale-95"
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <span className="font-bold text-zinc-800 px-6 text-sm min-w-[3.5rem] text-center">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-9 h-9 border border-zinc-200 rounded-lg flex items-center justify-center bg-zinc-50 text-zinc-500 hover:text-zinc-800 hover:border-zinc-300 transition-all active:scale-95"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>
                            </div>

                            {/* Operational Actions */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-zinc-200">
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-200 hover:border-zinc-300 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex justify-center items-center gap-2 transition-all active:scale-[0.99] shadow-sm"
                                >
                                    <ShoppingBag size={15} className="text-amber-600" />
                                    Add to Cart
                                </button>

                                <button
                                    onClick={handleBuyNow}
                                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-md shadow-amber-500/10 active:scale-[0.99]"
                                >
                                    Buy Now
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Login Prompt Modal Setup */}
            <LoginPromptModal
                isOpen={showLoginPrompt}
                onClose={() => setShowLoginPrompt(false)}
                productName={product?.name}
                returnUrl={window.location.pathname + window.location.search}
            />
        </CustomerLayout>
    );
}
