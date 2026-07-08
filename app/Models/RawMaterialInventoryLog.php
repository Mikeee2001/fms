<?php

namespace App\Models;

use App\Models\RawMaterial;
use App\Models\RawMaterialInventory;
use App\Models\Supplier;
use Illuminate\Database\Eloquent\Model;

class RawMaterialInventoryLog extends Model
{
    protected $table = 'raw_material_inventory_logs';

    protected $fillable = [
        'raw_material_inventory_id',
        'raw_material_id',
        'supplier_id',
        'type',
        'quantity',
        'stock_before',
        'stock_after',
        'remarks',
    ];

    public function inventory()
    {
        return $this->belongsTo(
            RawMaterialInventory::class,
            'raw_material_inventory_id'
        );
    }

    public function material()
    {
        return $this->belongsTo(RawMaterial::class);
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function rawMaterial()
    {
        return $this->belongsTo(RawMaterial::class);
    }


}
