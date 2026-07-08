<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\RawMaterialInventoryLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RawStockLogController extends Controller
{

    public function index(Request $request)
    {
        $query = RawMaterialInventoryLog::with([
            'rawMaterial.category',
            'rawMaterial.unit',
            'rawMaterial.primaryImage',
            'supplier',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Search Material
        |--------------------------------------------------------------------------
        */
        if ($request->filled('search')) {
            $query->whereHas('rawMaterial', function ($q) use ($request) {
                $q->where('material_name', 'like', '%' . $request->search . '%');
            });
        }

        /*
        |--------------------------------------------------------------------------
        | Filter Supplier
        |--------------------------------------------------------------------------
        */
        if ($request->filled('supplier')) {
            $query->where('supplier_id', $request->supplier);
        }

        /*
        |--------------------------------------------------------------------------
        | Filter Type
        |--------------------------------------------------------------------------
        */
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        /*
        |--------------------------------------------------------------------------
        | Date Filter
        |--------------------------------------------------------------------------
        */
        if ($request->filled('from')) {
            $query->whereDate('created_at', '>=', $request->from);
        }

        if ($request->filled('to')) {
            $query->whereDate('created_at', '<=', $request->to);
        }

        /*
        |--------------------------------------------------------------------------
        | Latest First
        |--------------------------------------------------------------------------
        */
        $logs = $query
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Manager/Inventory/StockLogs', [

            'logs' => $logs,

            'filters' => $request->only([
                'search',
                'supplier',
                'type',
                'from',
                'to',
            ]),

            'suppliers' => \App\Models\Supplier::orderBy('company_name')->get(),

            'types' => [
                'initial_stock',
                'stock_in',
                'stock_out',
                'adjustment',
                'purchase_request',
                'restocked',
            ],

        ]);
    }
}
