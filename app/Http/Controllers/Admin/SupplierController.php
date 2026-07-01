<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\SupplierStatusMail;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class SupplierController extends Controller
{
    public function index(Request $request)
    {
        $query = Supplier::query();

        // ACTIVE / INACTIVE
        if ($request->status === 'active' || $request->status === 'inactive') {
            $query->where('status', $request->status);
        }

        // ARCHIVED (SOFT DELETED)
        if ($request->status === 'archived') {
            $query->onlyTrashed();
        }

        $suppliers = $query->latest()->paginate(10);

        return inertia('Admin/Suppliers/Index', [
            'suppliers' => $suppliers,
            'filters' => $request->only('status'),
        ]);
    }

    public function updateStatusSupplier(Request $request, Supplier $supplier)
    {
        $request->validate([
            'status' => 'required|in:active,inactive',
        ]);

        $supplier->update([
            'status' => $request->status,
        ]);

        $supplier->load('user');

        // send email
        if ($supplier->user && $supplier->user->email) {
            Mail::to($supplier->user->email)
                ->send(new SupplierStatusMail($supplier));
        }

        return back()->with('success', 'Supplier status updated successfully.');
    }

    public function archive(Supplier $supplier)
    {
        if ($supplier->materials()->exists()) {
            return back()->with(
                'error',
                'Cannot archive supplier because it has associated materials.'
            );
        }

        // SOFT DELETE ONLY ONCE
        $supplier->delete();

        return back()->with('success', 'Supplier archived successfully.');
    }

    public function restore($id)
    {
        $supplier = Supplier::onlyTrashed()->findOrFail($id);
        $supplier->restore();

        return back()->with('success', 'Supplier restored successfully.');
    }

    public function forceDelete($id)
    {
        $supplier = Supplier::onlyTrashed()->findOrFail($id);

        $user = $supplier->user;

        $supplier->forceDelete();

        if ($user) {
            $user->forceDelete(); // or $user->delete() if using SoftDeletes
        }

        return back()->with('success', 'Supplier permanently deleted.');
    }

}
