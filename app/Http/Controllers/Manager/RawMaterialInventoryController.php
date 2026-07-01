<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Models\RawMaterialInventory;
use Inertia\Inertia;

class RawMaterialInventoryController extends Controller
{
    public function index()
    {
        $materials = RawMaterialInventory::with([
            'rawMaterial.category',
            'rawMaterial.supplier',
            'rawMaterial.unit',
        ])->get();

        return Inertia::render('Manager/Inventory/Index', [
            'materials' => $materials,
        ]);
    }
}
