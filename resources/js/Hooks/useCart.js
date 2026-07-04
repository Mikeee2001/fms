import { useEffect, useState } from "react";

export default function useCart() {
    const [cart, setCart] = useState([]);

    // load cart
    useEffect(() => {
        const stored = localStorage.getItem("cart");
        if (stored) setCart(JSON.parse(stored));
    }, []);

    // sync storage
    const saveCart = (newCart) => {
        setCart(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
    };

    // ADD TO CART
    const addToCart = (material) => {
        const exists = cart.find(i => i.raw_material_id === material.id);

        let newCart;

        if (exists) {
            newCart = cart.map(i =>
                i.raw_material_id === material.id
                    ? { ...i, quantity: i.quantity + 1 }
                    : i
            );
        } else {
            newCart = [
                ...cart,
                {
                    id: Date.now(),
                    raw_material_id: material.id,
                    supplier_id: material.supplier_id,
                    quantity: 1,
                    material,
                },
            ];
        }

        saveCart(newCart);
    };

    const updateQty = (id, qty) => {
        const newCart = cart.map(i =>
            i.id === id ? { ...i, quantity: Math.max(1, qty) } : i
        );
        saveCart(newCart);
    };

    const removeItem = (id) => {
        saveCart(cart.filter(i => i.id !== id));
    };

    const clearCart = () => {
        saveCart([]);
    };

    const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

    return {
        cart,
        addToCart,
        updateQty,
        removeItem,
        clearCart,
        cartCount,
    };
}
