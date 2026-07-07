<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Models\GoodsReceipt;
use App\Models\GoodsReceiptItem;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use App\Models\RawMaterialInventory;
use App\Models\RawMaterialInventoryLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class GoodsReceiptController extends Controller
{
    public function index()
    {
        $purchaseOrders = PurchaseOrder::with([
            'supplier',
            'items',
            'goodsReceipts.items'
        ])
            ->whereIn('status', [
                'approved',
                'shipped',
                'partially_received',
                'received'
            ])
            ->latest()
            ->get();

        return inertia(
            'Manager/GoodsReceipt/Index',
            [
                'purchaseOrders' => $purchaseOrders,
            ]
        );
    }
    public function create(PurchaseOrder $purchaseOrder)
    {
        $purchaseOrder->load([
            'supplier',
            'items.rawMaterial.unit',
        ]);

        $totalOrdered = $purchaseOrder->items->sum('quantity');

        return inertia(
            'Manager/GoodsReceipt/Create',
            [
                'purchaseOrder' => $purchaseOrder,

                'summary' => [
                    'total_ordered' => $totalOrdered,
                ],
            ]
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'purchase_order_id' => 'required|exists:purchase_orders,id',
            'received_date' => 'required|date',
            'items' => 'required|array',
            'items.*.purchase_order_item_id' => 'required|exists:purchase_order_items,id',
            'items.*.received_quantity' => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($request) {

            $purchaseOrder = PurchaseOrder::with([
                'items'
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

            foreach ($request->items as $item) {

                $poItem = PurchaseOrderItem::findOrFail(
                    $item['purchase_order_item_id']
                );

                $orderedQty = $poItem->quantity;

                $receivedQty = (float) $item['received_quantity'];

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
                    ? 'partially_received'
                    : 'received',
            ]);
        });

        return redirect()
            ->route('manager.goods-receipts.index')
            ->with(
                'success',
                'Goods Receipt created successfully.'
            );
    }

    public function show(GoodsReceipt $goodsReceipt)
    {
        $goodsReceipt->load([
            'purchaseOrder.supplier',
            'purchaseOrder.items.rawMaterial.unit',
            'items.purchaseOrderItem',
            'items.rawMaterial.unit',
            'receiver',
        ]);

        return inertia(
            'Manager/GoodsReceipt/Show',
            [
                'receipt' => $goodsReceipt,
            ]
        );
    }
}
