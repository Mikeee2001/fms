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

    public function index(Request $request)
    {

        // $materials = RawMaterial::with('inventory')->get();

        // dd($materials->toArray());

        $query = RawMaterial::query()->with([
            'supplier',
            'category',
            'unit',
            'size',
            'inventory',
            'images'
        ]);

        /*
        |--------------------------------------------------------------------------
        | Search
        |--------------------------------------------------------------------------
        */

        if ($request->filled('search')) {

            $query->where('material_name', 'like', '%' . $request->search . '%');

        }

        /*
        |--------------------------------------------------------------------------
        | Category
        |--------------------------------------------------------------------------
        */

        if ($request->filled('category')) {

            $query->where(
                'raw_material_category_id',
                $request->category
            );

        }

        /*
        |--------------------------------------------------------------------------
        | Supplier
        |--------------------------------------------------------------------------
        */

        if ($request->filled('supplier')) {

            $query->where(
                'supplier_id',
                $request->supplier
            );

        }

        /*
        |--------------------------------------------------------------------------
        | Materials
        |--------------------------------------------------------------------------
        */

        $materials = $query
            ->latest()
            ->paginate(9)
            ->withQueryString();

        return Inertia::render(
            'Manager/RawMaterial/Index',
            [
                'materials' => $materials,
                'filters' => $request->only([
                    'search',
                    'category',
                    'supplier'
                ]),
                'categories' => RawMaterialCategory::orderBy(
                    'raw_category_name'
                )->get(),
                'suppliers' => Supplier::orderBy(
                    'company_name'
                )->get(),
            ]
        );
    }

    public function show(RawMaterial $material)
    {
        $material->load([
            'supplier',
            'category',
            'unit',
            'size',
            'inventory'
        ]);

        return Inertia::render(
            'Manager/RawMaterial/Show',
            [
                'material' => $material
            ]
        );
    }

}
