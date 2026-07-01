<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Material;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class InventoryController extends Controller
{
      public function index()
    {
        $inventory = Material::with([
            'supplier',
            'unit',
            'rawMaterialCategory'
        ])
        ->orderBy('material_name')
        ->paginate(20);

        return Inertia::render('Admin/Inventory/Index', [

            'materials' => $inventory,

            'stats' => [

                'total_materials' => Material::count(),

                'low_stock' => Material::whereColumn(
                    'stock',
                    '<=',
                    'minimum_stock'
                )->count(),

                'out_of_stock' => Material::where('stock',0)->count(),

                'total_value' => Material::sum(
                    DB::raw('stock * purchase_price')
                ),

            ],

        ]);
}
}
