<?php

namespace App\Models;

use App\Models\GoodsReceipt;
use App\Models\Manager;
use App\Models\PurchaseOrderItem;
use App\Models\Supplier;
use App\Models\SupplierPayment;
use Illuminate\Database\Eloquent\Model;

class PurchaseOrder extends Model
{
    protected $fillable = [
        'supplier_id',
        'manager_id',
        'po_number',
        'order_date',
        'status',
        'total_amount',
        'notes',
    ];

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function manager()
    {
        return $this->belongsTo(Manager::class);
    }

    public function items()
    {
        return $this->hasMany(PurchaseOrderItem::class);
    }

    public function payment()
    {
        return $this->hasOne(SupplierPayment::class);
    }

    public function receipt()
    {
        return $this->hasOne(GoodsReceipt::class);
    }
}
