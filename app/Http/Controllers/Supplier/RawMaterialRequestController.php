<?php

namespace App\Http\Controllers\Supplier;

use App\Http\Controllers\Controller;
use App\Models\PurchaseOrder;
use App\Notifications\PurchaseOrderStatusUpdatedNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class RawMaterialRequestController extends Controller
{
    public function index()
    {
        $supplierId = Auth::user()->supplier->id;

        $requests = PurchaseOrder::with([
            'manager.user',
            'items.rawMaterial',
            'supplier'
        ])
            ->where('supplier_id', $supplierId)
            ->whereIn('status', [
                'pending',
                'approved',
                'shipped',
                'received'
            ])
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render(
            'Supplier/RawMaterialRequest/Index',
            [
                'requests' => $requests
            ]
        );
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

    public function updateStatus(Request $request, PurchaseOrder $purchaseOrder)
    {
        $request->validate([
            'status' => 'required|in:approved,shipped,cancelled'
        ]);

        try {

            $currentStatus = $purchaseOrder->status;
            $newStatus = $request->status;

            /*
            |--------------------------------------------------------------------------
            | Prevent changes after received
            |--------------------------------------------------------------------------
            */
            if ($currentStatus === 'received') {
                return back()->with([
                    'error' => 'This Purchase Order has already been received and can no longer be modified.'
                ]);
            }

            /*
            |--------------------------------------------------------------------------
            | Define allowed status transitions
            |--------------------------------------------------------------------------
            */
            $allowedTransitions = [
                'pending' => ['approved', 'cancelled'],
                'approved' => ['shipped'],
                'shipped' => [],
                'cancelled' => [],
            ];

            if (
                !isset($allowedTransitions[$currentStatus]) ||
                !in_array($newStatus, $allowedTransitions[$currentStatus])
            ) {
                return back()->with([
                    'error' => "Cannot change status from {$currentStatus} to {$newStatus}."
                ]);
            }

            $purchaseOrder->update([
                'status' => $newStatus
            ]);

            $purchaseOrder->load([
                'manager.user'
            ]);

            if ($purchaseOrder->manager?->user) {
                $purchaseOrder->manager->user->notify(
                    new PurchaseOrderStatusUpdatedNotification(
                        $purchaseOrder
                    )
                );
            }

            return back()->with([
                'success' => 'Purchase Order status updated successfully.'
            ]);

        } catch (\Exception $e) {

            \Log::error($e->getMessage());

            return back()->with([
                'error' => $e->getMessage()
            ]);
        }
    }

}
