<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Models\Manager;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderCart;
use App\Models\PurchaseOrderItem;
use App\Models\Supplier;
use App\Notifications\SupplierNewPurchaseOrderNotification;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class CheckOutController extends Controller
{
    /**
     * Checkout Page
     */
    public function page()
    {
        $manager = Manager::where('user_id', auth()->id())->firstOrFail();

        $cart = PurchaseOrderCart::with([
            'rawMaterial.primaryImage',
            'rawMaterial.images',
            'rawMaterial.supplier',
        ])
            ->where('manager_id', $manager->id)
            ->get();

        if ($cart->isEmpty()) {
            return redirect()
                ->route('manager.cart.index')
                ->with('error', 'Your cart is empty.');
        }

        $total = $cart->sum(function ($item) {
            return $item->quantity * $item->rawMaterial->purchase_price;
        });

        return Inertia::render('Manager/Checkout/Index', [
            'cart' => $cart,
            'total' => $total,
        ]);
    }

    /**
     * Place Purchase Orders
     */
    public function store()
    {
        $manager = Manager::where('user_id', auth()->id())->firstOrFail();

        $cartItems = PurchaseOrderCart::with([
            'rawMaterial',
            'supplier.user'
        ])
            ->where('manager_id', $manager->id)
            ->get();

        if ($cartItems->isEmpty()) {
            return redirect()
                ->route('manager.cart.index')
                ->with('error', 'Cart is empty.');
        }

        DB::beginTransaction();

        try {

            // Group cart by supplier
            $grouped = $cartItems->groupBy('supplier_id');

            foreach ($grouped as $supplierId => $items) {

                $supplier = Supplier::with('user')->findOrFail($supplierId);

                $total = 0;

                foreach ($items as $item) {
                    $total +=
                        $item->quantity *
                        $item->rawMaterial->purchase_price;
                }

                // Create Purchase Order
                $purchaseOrder = PurchaseOrder::create([
                    'supplier_id' => $supplier->id,
                    'manager_id' => $manager->id,
                    'po_number' => 'PO-' . now()->format('YmdHis') . rand(100, 999),
                    'order_date' => now(),
                    'status' => 'draft',
                    'payment_type' => 'cash',
                    'total_amount' => $total,
                    'paid_amount' => 0,
                    'balance' => $total,
                ]);

                // Create Purchase Order Items
                foreach ($items as $item) {

                    $unitPrice = $item->rawMaterial->purchase_price;


                    PurchaseOrderItem::create([
                        'purchase_order_id' => $purchaseOrder->id,
                        'raw_material_id' => $item->raw_material_id,
                        'quantity' => $item->quantity,
                        'unit_price' => $unitPrice,
                        'price' => $item->rawMaterial->purchase_price,
                        'subtotal' => $item->quantity * $item->rawMaterial->purchase_price,
                    ]);
                }

                /*
                |--------------------------------------------------------------------------
                | Notify Supplier
                |--------------------------------------------------------------------------
                */

                if ($supplier->user) {
                    $supplier->user->notify(
                        new SupplierNewPurchaseOrderNotification($purchaseOrder)
                    );
                } else {
                    Log::error('Supplier has no user', [
                        'supplier_id' => $supplier->id
                    ]);
                }
            }

            // Clear Cart
            PurchaseOrderCart::where('manager_id', $manager->id)->delete();

            DB::commit();

            return redirect()
                ->route('manager.request.index')
                ->with('success', 'Purchase Order Created Successfully.');

        } catch (\Exception $e) {

            DB::rollBack();

            Log::error($e);

            return redirect()
                ->back()
                ->with('error', $e->getMessage());
        }
    }
}
