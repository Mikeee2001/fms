<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Models\PurchaseOrder;
use Barryvdh\DomPDF\Facade\Pdf;


class PurchaseOrderController extends Controller
{
    public function show(PurchaseOrder $purchaseOrder)
    {
        $purchaseOrder->load([
            'supplier',
            'items.rawMaterial.unit',
        ]);

        return inertia(
            'Manager/PurchaseOrder/Show',
            [
                'purchaseOrder' => $purchaseOrder,
            ]
        );
    }

    public function generatePDF($id)
    {

        $purchaseOrder = PurchaseOrder::with([
            'items.rawMaterial.unit',
            'supplier',
            'manager.user'
        ])->findOrFail($id);


        $pdf = Pdf::loadView(
            'pdf.purchase-order',
            [
                'purchaseOrder' => $purchaseOrder
            ]
        );


        return $pdf->download(
            'Purchase_Order_'.$purchaseOrder->po_number.'.pdf'
        );

    }
}
