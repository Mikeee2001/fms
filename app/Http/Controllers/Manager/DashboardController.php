<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Models\Material;
use App\Models\PurchaseOrder;
use App\Models\Supplier;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function dashboard()
    {
        return Inertia::render('Manager/Dashboard', [

            'totalSuppliers' => Supplier::count(),

            'totalPurchaseOrders' => PurchaseOrder::count(),

            'pendingPurchaseOrders' => PurchaseOrder::where('status', 'pending')->count(),

            'totalRawMaterials' => Material::count(),

            'lowStockMaterials' => Material::whereColumn(
                'stock',
                '<=',
                'minimum_stock'
            )->count(),
            'activeMaterials' => Material::where('is_active', true)->count(),
        ]);
    }
}
