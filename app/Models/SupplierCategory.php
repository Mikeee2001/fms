<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SupplierCategory extends Model
{
    protected $fillable = [
        'name'
    ];

    public function suppliers()
    {
        return $this->belongsToMany(
            Supplier::class,
            'category_supplier'
        );
    }
}
