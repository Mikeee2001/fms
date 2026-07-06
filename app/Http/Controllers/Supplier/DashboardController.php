<?php

namespace App\Http\Controllers\Supplier;

use App\Http\Controllers\Controller;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use App\Models\RawMaterial;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $supplier = Auth::user()->supplier;

        if (!$supplier) {
            return Inertia::render('Supplier/Dashboard', [
                'stats' => $this->emptyStats()
            ]);
        }

        $stats = [
            // Total unique materials supplied via purchase orders
            'materials' => PurchaseOrderItem::whereHas('purchaseOrder', function ($q) use ($supplier) {
                $q->where('supplier_id', $supplier->id);
            })
                ->distinct('raw_material_id')
                ->count('raw_material_id'),

            // Orders by status
            'newOrders' => PurchaseOrder::where('supplier_id', $supplier->id)
                ->whereDate('created_at', today())
                ->count(),

            'pendingOrders' => PurchaseOrder::where('supplier_id', $supplier->id)
                ->where('status', 'pending')
                ->count(),

            'approvedOrders' => PurchaseOrder::where('supplier_id', $supplier->id)
                ->where('status', 'approved')
                ->count(),

            'completedOrders' => PurchaseOrder::where('supplier_id', $supplier->id)
                ->where('status', 'completed')
                ->count(),

            'cancelledOrders' => PurchaseOrder::where('supplier_id', $supplier->id)
                ->where('status', 'cancelled')
                ->count(),

            'totalOrders' => PurchaseOrder::where('supplier_id', $supplier->id)
                ->count(),

            'totalAmount' => PurchaseOrder::where('supplier_id', $supplier->id)
                ->sum('total_amount'),

            'lowStock' => RawMaterial::where('supplier_id', $supplier->id)
                ->whereHas('inventory', function ($q) {
                    $q->whereColumn('current_stock', '<', 'minimum_stock');
                })
                ->count(),

            // Recent orders
            'recentOrders' => PurchaseOrder::where('supplier_id', $supplier->id)
                ->latest()
                ->take(5)
                ->get(),
        ];

        $notifications = auth()->user()
            ->notifications()
            ->latest()
            ->take(10)
            ->get();

        $unreadCount = auth()->user()
            ->unreadNotifications()
            ->count();

        return Inertia::render('Supplier/Dashboard', [
            'stats' => $stats,
            'notifications' => $notifications,
            'unreadCount' => $unreadCount,
        ]);
    }

    private function emptyStats()
    {
        return [
            'materials' => 0,
            'newOrders' => 0,
            'pendingOrders' => 0,
            'approvedOrders' => 0,
            'completedOrders' => 0,
            'cancelledOrders' => 0,
            'totalOrders' => 0,
            'totalAmount' => 0,
            'lowStock' => 0,
            'recentOrders' => [],
        ];
    }
}
