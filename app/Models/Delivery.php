<?php

namespace App\Models;

use App\Models\DeliveryPersonnel;
use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Delivery extends Model
{
    protected $table = 'deliveries';

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    // The user/customer who placed the order
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function deliveryPersonnel(): BelongsTo
    {
        // Explicitly defining the foreign key ensures it matches the snake_case naming convention
        return $this->belongsTo(DeliveryPersonnel::class, 'delivery_personnel_id');
    }
}
