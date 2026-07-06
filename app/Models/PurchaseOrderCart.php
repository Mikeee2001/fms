<?php

namespace App\Models;

use App\Models\Manager;
use App\Models\RawMaterial;
use App\Models\Supplier;
use Illuminate\Database\Eloquent\Model;

class PurchaseOrderCart extends Model
{
    protected $table = 'purchase_order_carts';
    protected $fillable = [
        'manager_id',
        'supplier_id',
        'raw_material_id',
        'quantity'
    ];

    protected $casts = [
        'quantity' => 'integer',
    ];



    public function rawMaterial()
    {
        return $this->belongsTo(RawMaterial::class, 'raw_material_id');
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function manager()
    {
        return $this->belongsTo(Manager::class);
    }




}
