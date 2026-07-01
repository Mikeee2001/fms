<?php

namespace App\Models;

use App\Models\Material;
use Illuminate\Database\Eloquent\Model;

class Unit extends Model
{
    protected $fillable = [
        'name',
        'symbol',
        'is_active',
    ];

    public function materials()
    {
        return $this->hasMany(Material::class);
    }
}
