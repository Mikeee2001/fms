<?php

namespace App\Models;

use App\Models\GoodsReceiptItem;
use App\Models\PurchaseOrder;
use App\Models\RawMaterial;
use Illuminate\Database\Eloquent\Model;

class PurchaseOrderItem extends Model
{
    protected $fillable = [
        'purchase_order_id',
        'raw_material_id',
        'quantity',
        'unit_price',
        'subtotal',
    ];

    public function getComputedSubtotalAttribute()
    {
        return $this->quantity * $this->unit_price;
    }

    public function purchaseOrder()
    {
        return $this->belongsTo(PurchaseOrder::class, 'purchase_order_id');
    }

    public function rawMaterial()
    {
        return $this->belongsTo(RawMaterial::class, 'raw_material_id');
    }

    public function receiptItems()
    {
        return $this->hasMany(GoodsReceiptItem::class);
    }

}
