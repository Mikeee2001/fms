<?php

namespace App\Models;

use App\Models\RawMaterial;
use App\Models\RawMaterialInventoryLog;
use Illuminate\Database\Eloquent\Model;

class RawMaterialInventory extends Model
{
    protected $table = 'raw_material_inventories';

    protected $fillable = [
        'raw_material_id',
        'current_stock',
        'minimum_stock',
        'maximum_stock',
        'last_restock_date',
    ];

    protected $casts = [
        'last_restock_date' => 'date',
    ];

    protected $appends = [
        'stock_status',
    ];

    public function logs()
    {
        return $this->hasMany(
            RawMaterialInventoryLog::class,
            'raw_material_inventory_id'
        );
    }

    public function rawMaterial()
    {
        return $this->belongsTo(
            RawMaterial::class,
            'raw_material_id'
        );
    }

    public function getStockStatusAttribute()
    {
        $stock = $this->current_stock ?? 0;
        $minimum = $this->minimum_stock ?? 0;

        if ($stock <= 0) {
            return 'out_of_stock';
        }

        if ($stock <= $minimum) {
            return 'low_stock';
        }

        return 'in_stock';
    }
}
