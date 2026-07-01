<?php

namespace App\Models;

use App\Models\PurchaseOrder;
use App\Models\RawMaterial;
use Illuminate\Database\Eloquent\Model;

class PurchaseOrderItem extends Model
{
    protected $fillable = [
        'purchase_order_id',
        'raw_material_id',
        'quantity',
        'unit_cost',
        'total_cost',
    ];

    public function purchaseOrder()
    {
        return $this->belongsTo(PurchaseOrder::class);
    }

   public function rawMaterial()
{
    return $this->belongsTo(RawMaterial::class);
}
}
