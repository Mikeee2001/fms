<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Models\RawMaterial;
use App\Models\RawMaterialCategory;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RawMaterialPageController extends Controller
{
    public function rawMaterialPage()
    {
        $materials = RawMaterial::with([
            'supplier',
            'category',
            'unit',
            'size'
        ])->latest()->take(8)->get();

        return inertia('Manager/RawMaterialPage', [
            'materials' => $materials,
        ]);
    }
}
