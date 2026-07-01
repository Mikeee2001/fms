<?php

namespace App\Models;

use App\Models\RawMaterial;
use Illuminate\Database\Eloquent\Model;

class RawMaterialCategory extends Model
{
    protected $fillable = [
        'raw_category_name',
        'slug',
    ];

    public function materials()
    {
        return $this->hasMany(RawMaterial::class, 'raw_material_category_id');
    }


    public static function getDefaultCategories(): array
    {
        return [
            'Wood' => [
                'Mahogany',
                'Oak',
                'Pine',
                'Teak',
                'Acacia',
            ],
            'Lumber' => [
                '2x2 Lumber',
                '2x4 Lumber',
                '2x6 Lumber',
                'Hardwood Lumber',
            ],
            'Plywood' => [
                'Marine Plywood',
                'Ordinary Plywood',
                'Phenolic Board',
                'Flexible Plywood',
            ],
            'Foam' => [
                'High Density Foam',
                'Medium Density Foam',
                'Low Density Foam',
                'Memory Foam',
            ],
            'Fabric' => [
                'Velvet',
                'Leatherette',
                'Linen',
                'Cotton',
                'Polyester',
            ],
            'Metal' => [
                'Steel Tube',
                'Aluminum',
                'Stainless Steel',
                'Iron Rod',
            ],
            'Glass' => [
                'Tempered Glass',
                'Clear Glass',
                'Tinted Glass',
                'Frosted Glass',
            ],
            'Paint' => [
                'Wood Stain',
                'Primer',
                'Gloss Paint',
                'Matte Paint',
            ],
            'Hardware' => [
                'Wood Screws',
                'Nails',
                'Bolts',
                'Hinges',
                'Drawer Slides',
            ],
            'Upholstery Materials' => [
                'Buttons',
                'Thread',
                'Elastic Webbing',
                'Zippers',
            ],
        ];
    }


    public function rawMaterials()
    {
        return $this->hasMany(
            RawMaterial::class,
            'raw_material_category_id'
        );
    }


}
