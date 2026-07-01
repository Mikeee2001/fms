<?php

namespace App\Models;

use App\Models\RawMaterial;
use Illuminate\Database\Eloquent\Model;

class Size extends Model
{

    protected $table = 'sizes';
    protected $fillable = [
        'name',
    ];
  
    public function rawMaterials()
    {
        return $this->hasMany(
            RawMaterial::class,
            'size_id'
        );
    }
}
