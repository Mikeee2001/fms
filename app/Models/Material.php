<?php

namespace App\Models;

use App\Models\CustomizationOption;
use App\Models\MaterialStockLog;
use App\Models\RawMaterialCategory;
use App\Models\Supplier;
use App\Models\Unit;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Material extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'supplier_id',
        'raw_material_category_id',
        'material_name',
        'slug',
        'unit_id',
        'stock',
        'minimum_stock',
        'purchase_price',
        'is_active',
    ];



    protected $casts = [
        'stock' => 'decimal:2',
        'minimum_stock' => 'decimal:2',
        'cost_per_unit' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($material) {
            $material->slug = Str::slug($material->name);
        });
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function customizationOptions()
    {
        return $this->hasMany(CustomizationOption::class);
    }

    public function stockLogs()
    {
        return $this->hasMany(MaterialStockLog::class);
    }

    public function getStockStatusAttribute()
    {
        if ($this->stock <= 0) {
            return ['status' => 'out_of_stock', 'label' => 'Out of Stock', 'color' => 'red'];
        } elseif ($this->stock <= $this->minimum_stock) {
            return ['status' => 'low_stock', 'label' => 'Low Stock', 'color' => 'yellow'];
        } else {
            return ['status' => 'in_stock', 'label' => 'In Stock', 'color' => 'green'];
        }
    }

    public function category()
    {
        return $this->belongsTo(RawMaterialCategory::class, 'raw_material_category_id');
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }

    public function rawMaterialCategory()
    {
        return $this->belongsTo(RawMaterialCategory::class);
    }


}
