<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Models\GoodsReceipt;
use App\Models\GoodsReceiptItem;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use App\Models\RawMaterialInventory;
use App\Models\RawMaterialInventoryLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Request;
use Inertia\Inertia;

class RawMaterialInventoryController extends Controller
{
    public function index()
    {
        $materials = RawMaterialInventory::with([
            'rawMaterial.category',
            'rawMaterial.supplier',
            'rawMaterial.unit',
            'rawMaterial.primaryImage',
        ])
            ->whereHas('rawMaterial.purchaseOrderItems.receiptItems.goodsReceipt', function ($query) {
                $query->whereIn('status', ['partial', 'completed']);
            })
            ->get()
            ->map(function ($inventory) {

                $material = $inventory->rawMaterial;

                if (!$material) {
                    return null;
                }

                // Get only the latest goods receipt
                $latestReceipt = GoodsReceiptItem::with('goodsReceipt')
                    ->where('raw_material_id', $material->id)
                    ->whereHas('goodsReceipt', function ($query) {
                    $query->whereIn('status', ['partial', 'completed']);
                })
                    ->latest('created_at')
                    ->first();

                return [

                    'id' => $inventory->id,

                    'rawMaterial' => [
                        'id' => $material->id,
                        'name' => $material->material_name,
                        'purchase_price' => $material->purchase_price,
                        'category' => $material->category,
                        'supplier' => $material->supplier,
                        'unit' => $material->unit,
                        'primaryImage' => $material->primaryImage,
                    ],

                    // Current Inventory
                    'current_stock' => $inventory->current_stock,
                    'stock_status' => $inventory->stock_status,

                    // purchase
                    'received_quantity' => $latestReceipt->received_quantity,
                    'ordered_quantity' => $latestReceipt->ordered_quantity,
                    'remaining_quantity' => $latestReceipt->remaining_quantity,

                    'receipt_status' => optional(optional($latestReceipt)->goodsReceipt)->status,

                    'last_received_date' => optional(optional($latestReceipt)->goodsReceipt)->received_date,
                ];
            })
            ->filter()
            ->values();

        return Inertia::render('Manager/Inventory/Index', [
            'materials' => $materials,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'purchase_order_id' => [
                'required',
                'exists:purchase_orders,id',
            ],

            'received_date' => [
                'required',
                'date',
            ],

            'items' => [
                'required',
                'array',
            ],

            'items.*.purchase_order_item_id' => [
                'required',
                'exists:purchase_order_items,id',
            ],

            'items.*.received_quantity' => [
                'required',
                'numeric',
                'min:0',
            ],
        ]);

        DB::transaction(function () use ($request) {

            $purchaseOrder = PurchaseOrder::with([
                'items',
                'supplier',
            ])->findOrFail(
                    $request->purchase_order_id
                );

            $receipt = GoodsReceipt::create([
                'purchase_order_id' => $purchaseOrder->id,
                'received_by' => Auth::id(),
                'receipt_number' => 'GR-' . now()->format('YmdHis'),
                'received_date' => $request->received_date,
                'status' => 'pending',
                'remarks' => $request->remarks,
            ]);

            $isPartial = false;

            foreach ($request->items as $data) {

                $poItem = PurchaseOrderItem::findOrFail(
                    $data['purchase_order_item_id']
                );

                $orderedQty = $poItem->quantity;

                $receivedQty = $data['received_quantity'];

                $remainingQty = max(
                    0,
                    $orderedQty - $receivedQty
                );

                if ($remainingQty > 0) {
                    $isPartial = true;
                }

                GoodsReceiptItem::create([
                    'goods_receipt_id' => $receipt->id,
                    'purchase_order_item_id' => $poItem->id,
                    'raw_material_id' => $poItem->raw_material_id,
                    'ordered_quantity' => $orderedQty,
                    'received_quantity' => $receivedQty,
                    'remaining_quantity' => $remainingQty,
                    'remarks' => null,
                ]);

                $inventory = RawMaterialInventory::firstOrCreate(
                    [
                        'raw_material_id' => $poItem->raw_material_id,
                    ],
                    [
                        'current_stock' => 0,
                        'minimum_stock' => 0,
                    ]
                );

                $before = $inventory->current_stock;

                $after = $before + $receivedQty;

                $inventory->update([
                    'current_stock' => $after,
                    'last_restock_date' => now(),
                ]);

                RawMaterialInventoryLog::create([
                    'raw_material_inventory_id' => $inventory->id,
                    'raw_material_id' => $poItem->raw_material_id,
                    'supplier_id' => $purchaseOrder->supplier_id,
                    'type' => 'stock_in',
                    'quantity' => $receivedQty,
                    'stock_before' => $before,
                    'stock_after' => $after,
                    'remarks' => 'Goods Receipt #' . $receipt->receipt_number,
                ]);
            }

            $receipt->update([
                'status' => $isPartial
                    ? 'partial'
                    : 'completed',
            ]);

            $purchaseOrder->update([
                'status' => $isPartial
                    ? 'shipped'
                    : 'received',
            ]);
        });

        return redirect()
            ->route('/Manaer/GoodesReceipt/Create')
            ->with(
                'success',
                'Goods receipt created successfully.'
            );
    }

}
