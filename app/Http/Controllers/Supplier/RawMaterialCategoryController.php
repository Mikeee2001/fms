<?php

namespace App\Http\Controllers\Supplier;

use App\Http\Controllers\Controller;
use App\Models\RawMaterialCategory;
use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class RawMaterialCategoryController extends Controller
{
    public function index()
    {
        $supplier = auth()->user()->supplier;

        // Categories already assigned to this supplier
        $categories = $supplier->rawMaterialCategories()
            ->select(
                'raw_material_categories.id',
                'raw_material_categories.name',
                'raw_material_categories.slug'
            )
            ->orderBy('name')
            ->get();

        // IDs already assigned
        $assignedIds = $categories->pluck('id');

        // Categories not yet assigned
        $allCategories = RawMaterialCategory::select('id', 'name')
            ->whereNotIn('id', $assignedIds)
            ->orderBy('name')
            ->get();

        return Inertia::render('Supplier/RawMaterialCategories/Index', [
            'categories' => $categories,
            'allCategories' => $allCategories,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'raw_material_category_id' => 'required|exists:raw_material_categories,id',
        ]);

        $supplier = auth()->user()->supplier;

        // prevent duplicate attach
        $exists = $supplier->rawMaterialCategories()
            ->where('raw_material_category_id', $request->raw_material_category_id)
            ->exists();

        if ($exists) {
            return back()->withErrors([
                'raw_material_category_id' => 'Category already added.'
            ]);
        }

        $supplier->rawMaterialCategories()->attach($request->raw_material_category_id);

        return back()->with('success', 'Category added successfully');
    }
}
