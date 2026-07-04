<?php

namespace App\Http\Middleware;

use App\Models\Cart;
use App\Models\Manager;
use App\Models\PurchaseOrderCart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        // Get cart count for the current user/session
        $cartCount = 0;
        $managerCartCount = 0;

        if (Auth::check()) {

            // check if user is manager
            $manager = Manager::where('user_id', Auth::id())->first();

            if ($manager) {
                // 🔥 MANAGER CART
                $managerCartCount = PurchaseOrderCart::where('manager_id', $manager->id)
                    ->get()
                    ->sum(fn($item) => (int) $item->quantity);
            } else {
                // 🔥 CUSTOMER CART (fallback)
                $cartCount = Cart::where('user_id', Auth::id())->sum('quantity');
            }
        }

        // Get notifications for authenticated user
        $notifications = [];
        $unreadCount = 0;

        if (Auth::check()) {
            $user = Auth::user();
            $notifications = $user->notifications()->latest()->take(20)->get()->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'data' => $notification->data,
                    'read_at' => $notification->read_at,
                    'created_at' => $notification->created_at,
                ];
            });
            $unreadCount = $user->unreadNotifications->count();
        }

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'user' => fn() => $request->user(),
                ] : null,
                'notifications' => $notifications,
                'unread_count' => $unreadCount,
            ],
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'error' => fn() => $request->session()->get('error'),
                'info' => fn() => $request->session()->get('info'),
            ],
            'cartCount' => $cartCount,
            'managerCartCount' => $managerCartCount,
        ]);
    }
}
