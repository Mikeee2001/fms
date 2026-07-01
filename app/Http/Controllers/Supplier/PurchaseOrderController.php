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
        return Inertia::render('Supplier/PurchaseOrders/Index',[
            'orders'=>PurchaseOrder::with('items.material')
                ->where('supplier_id',Auth::user()->supplier->id)
                ->latest()
                ->get()
        ]);
    }
}
