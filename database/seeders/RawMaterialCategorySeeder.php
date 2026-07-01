<?php

namespace Database\Seeders;

use App\Models\RawMaterialCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class RawMaterialCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            'Wood',
            'Lumber',
            'Plywood',
            'Foam',
            'Fabric',
            'Metal',
            'Glass',
            'Paint',
            'Hardware',
            'Upholstery Materials',
        ];

        foreach ($categories as $name) {
            RawMaterialCategory::firstOrCreate([
                'raw_category_name' => $name,
            ], [
                'slug' => Str::slug($name),
            ]);
        }
    }
}
