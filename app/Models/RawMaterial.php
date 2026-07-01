<?php

namespace App\Models;

use App\Models\PurchaseOrderItem;
use App\Models\RawMaterialCategory;
use App\Models\RawMaterialInventory;
use App\Models\RawMaterialInventoryLog;
use App\Models\Size;
use App\Models\Supplier;
use App\Models\Unit;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RawMaterial extends Model
{
    use SoftDeletes;

    protected $table = 'raw_materials';
    protected $fillable = [
        'supplier_id',
        'raw_material_category_id',
        'unit_id',
        'material_name',
        'slug',
        'size_id',
        'purchase_price',
        'description',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function size()
    {
        return $this->belongsTo(Size::class);
    }

    public function category()
    {
        return $this->belongsTo(
            RawMaterialCategory::class,
            'raw_material_category_id'
        );
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }

    public function inventory()
    {
        return $this->hasOne(
            RawMaterialInventory::class,
            'raw_material_id'
        );
    }
    public function stockLogs()
    {
        return $this->hasMany(
            RawMaterialInventoryLog::class,
            'raw_material_id'
        );
    }

    public function purchaseOrderItems()
    {
        return $this->hasMany(PurchaseOrderItem::class);
    }

}
