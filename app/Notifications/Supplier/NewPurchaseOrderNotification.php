<?php

namespace App\Notifications;

use App\Models\PurchaseOrder;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewPurchaseOrderNotification extends Notification
{
    use Queueable;

    public $purchaseOrder;

    public function __construct(PurchaseOrder $purchaseOrder)
    {
        $this->purchaseOrder = $purchaseOrder;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'type' => 'new_purchase_order',

            'message' => 'You have received a new purchase order.',

            'po_number' => $this->purchaseOrder->po_number,

            'purchase_order_id' => $this->purchaseOrder->id,

            'action_url' => route(
                'supplier.purchase-orders.show',
                $this->purchaseOrder->id
            ),
        ];
    }
}
