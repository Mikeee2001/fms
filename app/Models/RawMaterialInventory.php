<?php

namespace App\Models;

use App\Models\RawMaterial;
use App\Models\RawMaterialInventoryLog;
use Illuminate\Database\Eloquent\Model;

class RawMaterialInventory extends Model
{
    protected $table = 'raw_material_inventory';

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

    public function getStatusAttribute()
    {
        if ($this->current_stock <= 0) {
            return 'Out of Stock';
        }

        if ($this->current_stock <= $this->minimum_stock) {
            return 'Low Stock';
        }

        return 'In Stock';
    }
}
