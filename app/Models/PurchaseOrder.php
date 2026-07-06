<?php

namespace App\Models;

use App\Models\Manager;
use App\Models\PurchaseOrderItem;
use App\Models\Supplier;
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
        'paid_amount',
        'payment_type',
        'balance',
        'notes',
    ];

    public function items()
    {
        return $this->hasMany(PurchaseOrderItem::class, 'purchase_order_id');
    }

    public function totalItems()
    {
        return $this->items()->sum('quantity');
    }

    public function totalAmount()
    {
        return $this->items()->sum('subtotal');
    }

    public function manager()
    {
        return $this->belongsTo(Manager::class, 'manager_id');
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class, 'supplier_id');
    }
  

}
