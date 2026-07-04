<?php

namespace App\Http\Controllers\Supplier;

use App\Http\Controllers\Controller;
use App\Models\RawMaterial;
use App\Models\RawMaterialCategory;
use App\Models\RawMaterialImage;
use App\Models\RawMaterialInventory;
use App\Models\RawMaterialInventoryLog;
use App\Models\Size;
use App\Models\Unit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class MaterialController extends Controller
{

    public function index(Request $request)
    {
        $supplier = auth()->user()->supplier;

        $status = $request->status ?? 'all';

        /*
        |--------------------------------------------------------------------------
        | Statistics Cards
        |--------------------------------------------------------------------------
        */
        $allMaterials = RawMaterial::with('inventory')
            ->where('supplier_id', $supplier->id)
            ->get();

        $statistics = [
            'total_materials' => $allMaterials->count(),

            'active_materials' => $allMaterials
                ->where('is_active', 1)
                ->count(),

            'inactive_materials' => $allMaterials
                ->where('is_active', 0)
                ->count(),

            // Only active materials are considered
            'low_stock_materials' => $allMaterials
                ->where('is_active', 1)
                ->filter(function ($material) {
                    return ($material->inventory->current_stock ?? 0)
                        <= ($material->inventory->minimum_stock ?? 0);
                })
                ->count(),

            // Only active materials contribute to inventory value
            'inventory_value' => $allMaterials
                ->where('is_active', 1)
                ->sum(function ($material) {
                    return ($material->inventory->current_stock ?? 0)
                        * ($material->purchase_price ?? 0);
                }),
        ];

        /*
        |--------------------------------------------------------------------------
        | Archived Materials
        |--------------------------------------------------------------------------
        */
        if ($status === 'archived') {

            $materials = RawMaterial::onlyTrashed()
                ->with([
                    'category',
                    'unit',
                    'inventory',
                    'size',
                    'images'
                ])
                ->where('supplier_id', $supplier->id)
                ->latest()
                ->paginate(10);

            return Inertia::render('Supplier/Material/Index', [
                'materials' => $materials,
                'statistics' => $statistics,
                'filters' => [
                    'status' => $status,
                ],
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Active / Inactive / All
        |--------------------------------------------------------------------------
        */
        $query = RawMaterial::with([
            'category',
            'unit',
            'inventory',
            'size',
            'images',
            'primaryImage'
        ])->where('supplier_id', $supplier->id);

        if ($status === 'active') {
            $query->where('is_active', 1);
        }

        if ($status === 'inactive') {
            $query->where('is_active', 0);
        }

        $materials = $query
            ->latest()
            ->paginate(10);

        return Inertia::render('Supplier/Material/Index', [
            'materials' => $materials,
            'statistics' => $statistics,
            'filters' => [
                'status' => $status,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Supplier/Material/Create', [
            'categories' => RawMaterialCategory::all(),
            'units' => Unit::where('is_active', 1)->get(),
            'sizes' => Size::orderBy('name')->get(),
        ]);
    }
    public function store(Request $request)
    {
        $request->validate([
            'raw_material_category_id' => 'required|exists:raw_material_categories,id',
            'material_name' => 'required|string|max:255',
            'unit_id' => 'required|exists:units,id',
            'purchase_price' => 'required|numeric|min:0',

            'material_images' => 'nullable|array',
            'material_images.*' => 'image|mimes:jpg,jpeg,png,webp|max:2048',

            'current_stock' => 'required|numeric|min:0',
            'minimum_stock' => 'required|numeric|min:0',

            'size_id' => 'required',
            'size_custom' => 'nullable|max:100',
        ]);

        DB::transaction(function () use ($request) {

            $supplier = auth()->user()->supplier;

            /*
            |--------------------------------------------------------------------------
            | Size
            |--------------------------------------------------------------------------
            */

            if ($request->size_id === 'custom') {

                $size = Size::firstOrCreate([
                    'name' => $request->size_custom,
                ]);

                $sizeId = $size->id;

            } else {

                $sizeId = $request->size_id;
            }

            /*
            |--------------------------------------------------------------------------
            | Raw Material
            |--------------------------------------------------------------------------
            */

            $rawMaterial = RawMaterial::create([
                'supplier_id' => $supplier->id,
                'raw_material_category_id' => $request->raw_material_category_id,
                'unit_id' => $request->unit_id,
                'size_id' => $sizeId,
                'material_name' => $request->material_name,
                'slug' => Str::slug(
                    $request->material_name . '-' . time()
                ),
                'purchase_price' => $request->purchase_price,
                'is_active' => true,
            ]);

            /*
            |--------------------------------------------------------------------------
            | Raw Material Images
            |--------------------------------------------------------------------------
            */

            if ($request->hasFile('material_images')) {

                foreach (
                    $request->file('material_images')
                    as $index => $image
                ) {

                    $path = $image->store(
                        'raw-materials',
                        'public'
                    );

                    RawMaterialImage::create([
                        'raw_material_id' => $rawMaterial->id,
                        'image_path' => $path,
                        'is_primary' => $index === 0,
                    ]);
                }
            }

            /*
            |--------------------------------------------------------------------------
            | Inventory
            |--------------------------------------------------------------------------
            */

            $inventory = RawMaterialInventory::create([
                'raw_material_id' => $rawMaterial->id,
                'current_stock' => $request->current_stock,
                'minimum_stock' => $request->minimum_stock,
                'maximum_stock' => $request->maximum_stock,
                'last_restock_date' => now(),
            ]);

            /*
            |--------------------------------------------------------------------------
            | Inventory Log
            |--------------------------------------------------------------------------
            */

            RawMaterialInventoryLog::create([
                'raw_material_inventory_id' => $inventory->id,
                'raw_material_id' => $rawMaterial->id,
                'supplier_id' => $supplier->id,

                'type' => 'initial_stock',

                'quantity' => $request->current_stock,

                'stock_before' => 0,

                'stock_after' => $request->current_stock,

                'remarks' => 'Initial stock upon material creation.',
            ]);
        });

        return redirect()
            ->route('supplier.materials.index')
            ->with(
                'success',
                'Raw material added successfully.'
            );
    }

    public function show(RawMaterial $material)
    {
        return Inertia::render('Supplier/Material/Show', [
            'material' => $material->load([
                'category',
                'unit',
                'size',
                'inventory',
            ]),
        ]);
    }

    public function edit(RawMaterial $material)
    {
        abort_if(
            $material->supplier_id != auth()->user()->supplier->id,
            403
        );

        return Inertia::render('Supplier/Material/Edit', [
            'material' => $material->load([
                'inventory',
                'category',
                'unit',
                'size',
            ]),
            'categories' => RawMaterialCategory::all(),
            'units' => Unit::where('is_active', 1)->get(),
            'sizes' => Size::orderBy('name')->get(),
        ]);
    }

    public function update(Request $request, RawMaterial $material)
    {
        // SECURITY: ensure supplier owns material
        abort_if(
            $material->supplier_id != auth()->user()->supplier->id,
            403
        );

        $request->validate([
            'material_name' => 'required|max:255',
            'purchase_price' => 'required|numeric|min:0',
            'current_stock' => 'required|numeric|min:0',
        ]);

        // update material
        $material->update([
            'material_name' => $request->material_name,
            'purchase_price' => $request->purchase_price,
        ]);

        // update stock (inventory table)
        $material->inventory()->update([
            'current_stock' => $request->current_stock,
        ]);

        return redirect()->route('supplier.materials.index')
            ->with('success', 'Material updated successfully.');
    }

    public function destroy(RawMaterial $material)
    {
        abort_if(
            $material->supplier_id != auth()->user()->supplier->id,
            403
        );

        $material->delete();

        return back()->with('success', 'Raw material archived successfully.');
    }

    public function updateStatus(Request $request, RawMaterial $material)
    {
        $request->validate([
            'is_active' => 'required|boolean',
        ]);

        $material->update([
            'is_active' => $request->is_active,
        ]);

        return back()->with('success', 'Status updated.');
    }

    public function addStock(RawMaterial $material)
    {
        return Inertia::render('Supplier/Material/AddStock', [
            'material' => $material->load([
                'inventory',
                'category',
                'unit',
                'size',
            ]),
        ]);
    }

    public function storeStock(Request $request, RawMaterial $material)
    {
        abort_if(
            $material->supplier_id != auth()->user()->supplier->id,
            403
        );

        $request->validate([
            'quantity' => 'required|numeric|min:1',
            'remarks' => 'nullable|string|max:255',
        ]);

        DB::transaction(function () use ($request, $material) {

            $inventory = $material->inventory;

            $before = $inventory->current_stock;
            $after = $before + $request->quantity;

            $inventory->update([
                'current_stock' => $after,
                'last_restock_date' => now(),
            ]);

            RawMaterialInventoryLog::create([
                'raw_material_inventory_id' => $inventory->id,
                'raw_material_id' => $material->id,
                'supplier_id' => auth()->user()->supplier->id,
                'type' => 'stock_in',
                'quantity' => $request->quantity,
                'stock_before' => $before,
                'stock_after' => $after,
                'remarks' => $request->remarks ?: 'Stock added by supplier.',
            ]);
        });

        return redirect()
            ->route('supplier.materials.index')
            ->with('success', 'Stock added successfully.');
    }

    public function logs(RawMaterial $material)
    {
        return Inertia::render('Supplier/Material/Logs', [
            'material' => $material->load([
                'inventory',
            ]),
            'logs' => RawMaterialInventoryLog::where(
                'raw_material_id',
                $material->id
            )
                ->latest()
                ->get(),
        ]);
    }

    public function archive(RawMaterial $material)
    {
        $material->delete();

        return back()->with(
            'success',
            'Material archived successfully.'
        );
    }

    public function restore($id)
    {
        $material = RawMaterial::onlyTrashed()
            ->where('supplier_id', auth()->user()->supplier->id)
            ->findOrFail($id);

        $material->restore();

        return back()->with('success', 'Raw material restored successfully.');
    }

    public function forceDelete($id)
    {
        $material = RawMaterial::onlyTrashed()->findOrFail($id);

        $material->forceDelete();

        return back()->with(
            'success',
            'Material permanently deleted.'
        );
    }

}
