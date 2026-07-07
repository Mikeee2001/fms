<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class SupplierNewPurchaseOrderNotification extends Notification
{
    use Queueable;

    public $po;

    public function __construct($po)
    {
        $this->po = $po;
    }

    public function via($notifiable)
    {
        return ['database']; // ❗ REQUIRED
    }

    public function toDatabase($notifiable)
    {
        return [
            'title' => 'New Purchase Order',

            'message' => 'A new purchase order has been submitted.',

            'po_id' => $this->po->id,

            'po_number' => $this->po->po_number,

            'status' => $this->po->status,

            'total_amount' => $this->po->total_amount,
        ];
    }
}
