<?php

namespace App\Http\Controllers\Supplier;

use App\Http\Controllers\Controller;
use App\Models\PurchaseOrder;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PurchaseOrderController extends Controller
{
    public function index()
    {
        return Inertia::render('Supplier/PurchaseOrders/Index', [
            'orders' => PurchaseOrder::with('items.rawMaterial')
                ->where('supplier_id', Auth::user()->supplier->id)
                ->latest()
                ->get()
        ]);
    }

    public function show(PurchaseOrder $purchaseOrder)
    {
        $purchaseOrder->load([
            'items.rawMaterial.unit',
            'supplier',
            'manager.user'
        ]);

        return Inertia::render(
            'Supplier/PurchaseOrders/Show',
            [
                'purchaseOrder' => $purchaseOrder
            ]
        );
    }
}
