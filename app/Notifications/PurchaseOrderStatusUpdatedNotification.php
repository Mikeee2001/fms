<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class PurchaseOrderStatusUpdatedNotification extends Notification
{
    use Queueable;

    protected $purchaseOrder;

    public function __construct($purchaseOrder)
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

            'type' => 'purchase_order_status_updated',

            'title' => 'Purchase Order Status Updated',

            'message' =>
                'Purchase Order #' .
                $this->purchaseOrder->po_number .
                ' has been updated to ' .
                strtoupper($this->purchaseOrder->status),

            'po_id' => $this->purchaseOrder->id,

            'po_number' => $this->purchaseOrder->po_number,

            'status' => $this->purchaseOrder->status,

            // remove this temporarily if route causes issues
            'action_url' => null,
        ];
    }
}
