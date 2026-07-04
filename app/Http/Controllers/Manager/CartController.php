<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Models\Manager;
use App\Models\PurchaseOrderCart;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{


    public function index()
    {
        $manager = Manager::where('user_id', auth()->id())->first();

        $cart = PurchaseOrderCart::with([
            'material.primaryImage',
            'material.images',
            'material.category',
            'material.supplier',
            'material.unit',
        ])
            ->where('manager_id', $manager->id)
            ->get();

        return Inertia::render('Manager/Cart/Index', [
            'cart' => $cart,
            'total_items' => $cart->sum('quantity'),
            'managerCartCount' => $cart->sum('quantity'),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'raw_material_id' => 'required|exists:raw_materials,id',
            'supplier_id' => 'required|exists:suppliers,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $manager = Manager::where('user_id', auth()->id())->first();

        // ✅ find existing cart item
        $cartItem = PurchaseOrderCart::where('manager_id', $manager->id)
            ->where('raw_material_id', $request->raw_material_id)
            ->first();

        if ($cartItem) {
            // ✅ update quantity if exists
            $cartItem->increment('quantity', $request->quantity);
        } else {
            // ✅ create new cart item
            PurchaseOrderCart::create([
                'manager_id' => $manager->id,
                'supplier_id' => $request->supplier_id,
                'raw_material_id' => $request->raw_material_id,
                'quantity' => $request->quantity,
            ]);
        }

        // ✅ total cart quantity (optional badge counter)
        $count = PurchaseOrderCart::where('manager_id', $manager->id)
            ->sum('quantity');

        $count = PurchaseOrderCart::where('manager_id', $manager->id)->sum('quantity');

        return back()->with([
            'managerCartCount' => $count
        ]);
    }

    /**
     * UPDATE QUANTITY
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'required|numeric|min:1',
        ]);

        $manager = Manager::where('user_id', auth()->id())->firstOrFail();

        $cart = PurchaseOrderCart::where('manager_id', $manager->id)
            ->where('id', $id)
            ->firstOrFail();

        $cart->update([
            'quantity' => $request->quantity,
        ]);

        $cartItems = PurchaseOrderCart::where('manager_id', $manager->id)->get();

        return back()->with([
            'managerCartCount' => $cartItems->sum('quantity'),
            'success' => 'Updated'
        ]);
    }
    /**
     * REMOVE SINGLE ITEM
     */
    public function destroy($id)
    {
        $manager = Manager::where('user_id', auth()->id())->firstOrFail();

        PurchaseOrderCart::where('manager_id', $manager->id)
            ->where('id', $id);

        $cartItems = PurchaseOrderCart::where('manager_id', $manager->id)->get();

        return back()->with([
            'managerCartCount' => $cartItems->sum('quantity'),
            'success' => 'Deleted'
        ]);
    }

    /**
     * CLEAR CART
     */
    public function clear()
    {
        $manager = Manager::where('user_id', auth()->id())->firstOrFail();

        PurchaseOrderCart::where('manager_id', $manager->id);

        return back()->with([
            'managerCartCount' => 0,
            'success' => 'Cart cleared'
        ]);
    }
}
