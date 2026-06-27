<?php

namespace Database\Seeders;

use App\Models\SupplierCategory;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SupplierCategorySeeder extends Seeder
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

    foreach ($categories as $category) {
        SupplierCategory::create([
            'name' => $category
        ]);
    }
    }
}
