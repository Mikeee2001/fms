<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Models\GoodsReceipt;
use App\Models\GoodsReceiptItem;
use App\Models\Manager;
use App\Models\PurchaseOrder;
use App\Models\RawMaterialInventory;
use App\Models\RawMaterialInventoryLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DeliveriesController extends Controller
{
    public function index()
    {
        $manager = Manager::where('user_id', Auth::id())->firstOrFail();

        $deliveries = PurchaseOrder::with([
            'supplier',
            'items.rawMaterial'
        ])
            ->where('manager_id', $manager->id)
            ->whereIn('status', [
                'shipped',
                'partially_received',
                'received'
            ])
            ->latest()
            ->get();

        return inertia('Manager/Delivery/Index', [
            'deliveries' => $deliveries,

            // Fixed destination (Shop)
            'shop' => [
                'name' => "A's ARFEEL'S LUMBER TRADING",
                'address' => "A's ARFEEL'S LUMBER TRADING",
                'latitude' => 8.5323137,
                'longitude' => 124.570573,
            ],
        ]);
    }
    public function receive(PurchaseOrder $purchaseOrder)
    {
        DB::transaction(function () use ($purchaseOrder) {

            if ($purchaseOrder->status === 'received') {
                return back()->with('error', 'This purchase order has already been received.');
            }

            // 1. Update Purchase Order
            $purchaseOrder->update([
                'status' => 'received',
            ]);

            // 2. Create Goods Receipt
            $receipt = GoodsReceipt::create([
                'purchase_order_id' => $purchaseOrder->id,
                'received_by' => auth()->id(),
                'receipt_number' => 'GR-' . now()->format('YmdHis'),
                'received_date' => now(),
                'status' => 'completed',
            ]);

            foreach ($purchaseOrder->items as $item) {

                // 3. Goods Receipt Item
                GoodsReceiptItem::create([
                    'goods_receipt_id' => $receipt->id,
                    'purchase_order_item_id' => $item->id,
                    'raw_material_id' => $item->raw_material_id,
                    'ordered_quantity' => $item->quantity,
                    'received_quantity' => $item->quantity,
                    'remaining_quantity' => 0,
                ]);

                // 4. Inventory
                $inventory = RawMaterialInventory::firstOrCreate(
                    [
                        'raw_material_id' => $item->raw_material_id,
                    ],
                    [
                        'current_stock' => 0,
                        'minimum_stock' => 10,
                        'maximum_stock' => 1000,
                    ]
                );

                $before = $inventory->current_stock;

                $inventory->increment(
                    'current_stock',
                    $item->quantity
                );

                $inventory->refresh();

                // 5. Inventory Log
                RawMaterialInventoryLog::create([
                    'raw_material_inventory_id' => $inventory->id,
                    'raw_material_id' => $item->raw_material_id,
                    'supplier_id' => $purchaseOrder->supplier_id,
                    'type' => 'stock_in',
                    'quantity' => $item->quantity,
                    'stock_before' => $before,
                    'stock_after' => $inventory->current_stock,
                    'remarks' => 'Goods Receipt ' . $receipt->receipt_number,
                ]);
            }
        });

        return back()->with('success', 'Order received successfully.');
    }

}
