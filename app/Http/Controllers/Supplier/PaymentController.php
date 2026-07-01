<?php

namespace App\Http\Controllers\Supplier;

use App\Http\Controllers\Controller;
use App\Models\SupplierPayment;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PaymentController extends Controller
{
     public function index()
    {
        return Inertia::render('Supplier/Payments/Index',[
            'payments'=>SupplierPayment::whereHas('purchaseOrder',function($q){
                $q->where('supplier_id',Auth::user()->supplier->id);
            })
            ->latest()
            ->get()
        ]);
    }
}
