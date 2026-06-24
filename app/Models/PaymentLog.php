<?php

namespace App\Models;

use App\Models\Order;
use Illuminate\Database\Eloquent\Model;

class PaymentLog extends Model
{
    protected $table = 'payment_logs';

    protected $fillable = [
        'order_id',
        'paymongo_event_type',
        'paymongo_payment_id',
        'payload',
        'status',
    ];

    protected $casts = [
        'payload' => 'array',
    ];

    /**
     * Order relationship
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
