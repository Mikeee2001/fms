import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);

    const addToCart = (material, quantity = 1) => {
        setCart(prev => {
            const existing = prev.find(
                item => item.raw_material_id === material.id
            );

            if (existing) {
                return prev.map(item =>
                    item.raw_material_id === material.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }

            return [
                ...prev,
                {
                    id: Date.now(),
                    raw_material_id: material.id,
                    material,
                    quantity,
                },
            ];
        });
    };

    return (
        <CartContext.Provider value={{ cart, addToCart }}>
            {children}
        </CartContext.Provider>
    );
}

export default function useCart() {
    return useContext(CartContext);
}
