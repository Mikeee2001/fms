<?php

namespace App\Models;

use App\Models\Material;
use App\Models\PurchaseOrder;
use App\Models\RawMaterial;
use App\Models\RawMaterialCategory;
use App\Models\SupplierCategory;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;

class Supplier extends Model
{
    use HasFactory;
    use SoftDeletes;
    use Notifiable;

    protected $fillable = [
        'user_id',
        'company_logo',
        'company_name',
        'contact_person',
        'contact_number',
        'product_category',
        'address',
        'status',
        'latitude',
        'longitude',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function categories()
    {
        return $this->belongsToMany(
            SupplierCategory::class,
            'category_supplier'
        );
    }

    public function materials()
    {
        return $this->hasMany(Material::class);
    }

    public function getMaterialCountAttribute()
    {
        return $this->rawMaterials()->count();
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }


    public function rawMaterialCategories()
    {
        return $this->hasManyThrough(
            RawMaterialCategory::class,
            Material::class,
            'supplier_id',
            'id',
            'id',
            'raw_material_category_id'
        );
    }

    public function rawMaterials()
    {
        return $this->hasMany(
            RawMaterial::class,
            'supplier_id'
        );
    }

    public function purchaseOrders()
    {
        return $this->hasMany(PurchaseOrder::class, 'supplier_id');
    }


}
