<?php

namespace App\Models;

use App\Models\GoodsReceipt;
use App\Models\PurchaseOrderItem;
use App\Models\RawMaterial;
use Illuminate\Database\Eloquent\Model;

class GoodsReceiptItem extends Model
{
    protected $fillable = [
        'goods_receipt_id',
        'purchase_order_item_id',
        'raw_material_id',
        'ordered_quantity',
        'received_quantity',
        'remaining_quantity',
        'remarks',
    ];

    public function goodsReceipt()
    {
        return $this->belongsTo(GoodsReceipt::class);
    }

    public function purchaseOrderItem()
    {
        return $this->belongsTo(PurchaseOrderItem::class);
    }

    public function rawMaterial()
    {
        return $this->belongsTo(RawMaterial::class);
    }
}
