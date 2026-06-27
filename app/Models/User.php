<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Models\Cart;
use App\Models\DeliveryPersonnel;
use App\Models\Manager;
use App\Models\MaterialStockLog;
use App\Models\Order;
use App\Models\Supplier;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
// use App\Notifications\OrderStatusUpdatedNotification;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role_as',
        'city',
        'phone',
        'address',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Check if user is admin
     */
    public function isAdmin()
    {
        return $this->role_as === 'admin';
    }

    public function isDelivery()
    {
        return $this->role_as === 'delivery';
    }

    public function isManager()
    {
        return $this->role_as === 'manager';
    }

     public function isSupplier()
    {
        return $this->role_as === 'supplier';
    }


    /**
     * Get orders for the user
     */
    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Get material stock logs for the user
     */
    public function materialStockLogs()
    {
        return $this->hasMany(MaterialStockLog::class);
    }

    /**
     * Get cart items for the user
     */
    public function carts()
    {
        return $this->hasMany(Cart::class);
    }

    /**
     * Route notifications for mail channel (optional)
     */
    public function routeNotificationForMail()
    {
        return $this->email;
    }

    /**
     * Get the manager profile associated with the user.
     */
    public function manager()
    {
        // Assumes managers table has a user_id foreign key
        return $this->hasOne(Manager::class, 'user_id');
    }

    /**
     * Get the delivery personnel profile associated with the user.
     */
    public function deliveryPersonnel()
    {
        // Assumes delivery_personnels table has a user_id foreign key
        return $this->hasOne(DeliveryPersonnel::class, 'user_id');
    }

    /**
     * Get the supplier profile associated with the user.
     */
    public function supplier()
    {
        // Assumes managers table has a user_id foreign key
        return $this->hasOne(Supplier::class, 'user_id');
    }

}
