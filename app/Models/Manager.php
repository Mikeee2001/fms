<?php

namespace App\Models;

use App\Models\ProductionTask;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderCart;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Manager extends Model
{
    protected $table = 'managers';

    protected $fillable = [
        'user_id',
        'specification',
        'status',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function productionTasks(): HasMany
    {
        return $this->hasMany(ProductionTask::class);
    }

    public function purchaseOrders()
    {
        return $this->hasMany(PurchaseOrder::class);
    }

    public function cart()
    {
        return $this->hasMany(PurchaseOrderCart::class);
    }
}
