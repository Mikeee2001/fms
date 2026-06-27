<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'company_logo',
        'company_name',
        'contact_person',
        'contact_number',
        'product_category',
        'address',
        'notes',
        'status',
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
        return $this->materials()->count();
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
