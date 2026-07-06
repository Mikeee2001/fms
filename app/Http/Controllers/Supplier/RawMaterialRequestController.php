<?php

namespace App\Http\Controllers\Supplier;

use App\Http\Controllers\Controller;
use App\Models\PurchaseOrder;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class RawMaterialRequestController extends Controller
{
    public function index()
    {
        $supplierId = Auth::user()->supplier->id;

        $draftRequests = PurchaseOrder::with([
            'manager.user',
            'items.rawMaterial'
        ])
            ->where('supplier_id', $supplierId)
            ->where('status', 'draft')
            ->latest()
            ->get();

        return Inertia::render('Supplier/RawMaterialRequest/Index', [
            'draftRequests' => $draftRequests
        ]);
    }
}
