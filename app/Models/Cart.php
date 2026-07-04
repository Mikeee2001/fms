<?php

namespace App\Models;

use App\Models\Manager;
use App\Models\Product;
use App\Models\ProductSize;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'session_id',
        'product_id',
        'size_id',
        'quantity',
        'customizations',
        'unit_price',
    ];

    protected $casts = [
        'customizations' => 'array',
        'unit_price' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function size()
    {
        return $this->belongsTo(ProductSize::class, 'size_id');
    }

    public function manager()
    {
        return $this->belongsTo(Manager::class, 'size_id');
    }

}
