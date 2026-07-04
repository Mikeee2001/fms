<?php

namespace App\Models;

use App\Models\RawMaterial;
use Illuminate\Database\Eloquent\Model;

class RawMaterialImage extends Model
{
    protected $fillable = [
        'raw_material_id',
        'image_path',
        'is_primary',
    ];

    public function rawMaterial()
    {
        return $this->belongsTo(RawMaterial::class);
    }
}
