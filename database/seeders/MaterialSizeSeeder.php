<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Size;

class MaterialSizeSeeder extends Seeder
{
    public function run(): void
    {
        $size = [
            ['name' => '2x2'],
            ['name' => '2x4'],
            ['name' => '4x4'],
            ['name' => '1x1'],
            ['name' => 'Small'],
            ['name' => 'Medium'],
            ['name' => 'Large'],
            ['name' => '1kg'],
            ['name' => '5kg'],
            ['name' => '50kg'],
        ];

        foreach ($size as $sizes) {
            Size::create($sizes);
        }
    }
}
