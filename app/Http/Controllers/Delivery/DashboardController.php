<?php

namespace App\Http\Controllers\Delivery;

use App\Http\Controllers\Controller;
use App\Models\Delivery;
use App\Models\DeliveryPersonnel;
use App\Models\Order;
// use App\Models\ProductionTask;
// use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // 1. Gather all of your explicit real-time status data counts
        $orderStats = [
            'total_orders' => Order::count(),
            'pending_orders' => Order::where('status', 'pending')->count(),
            'processing_orders' => Order::where('status', 'processing')->count(),
            'shipped_orders' => Order::where('status', 'shipped')->count(),
            'completed_orders' => Order::where('status', 'completed')->count(),
            'cancelled_orders' => Order::where('status', 'cancelled')->count(),
            'total_revenue' => Order::where('status', 'completed')->sum('total_price'),
            'total_profit' => Order::where('status', 'completed')->count(),
        ];

        // 2. Fetch the 5 most recent delivery records along with their relations
        // This allows delivery.order.status to map flawlessly into your React view loops
        $recentDeliveries = Delivery::with(['order', 'deliveryPersonnel.user'])
            ->orderBy('deliver_date', 'desc')
            ->take(5)
            ->get();

        // 3. Fetch active fleet tracking details for your personnel panel list
        $personnelStatus = DeliveryPersonnel::with('user')
            ->select('id', 'user_id', 'vehicle_type', 'plate_number', 'status')
            ->get();

        // 4. Render clean data parameters out to your delivery dashboard component
        return Inertia::render('Delivery/Dashboard', [
            'stats' => [
                // Map your specific layout keys directly to your order status arrays
                'pendingRequestsCount' => $orderStats['processing_orders'],
                'activeDeliveriesCount' => $orderStats['shipped_orders'],    // shipped = out for delivery
                'completedDeliveriesCount' => $orderStats['completed_orders'],  // completed = delivered
            ],
            'recentDeliveries' => $recentDeliveries,
            'personnelStatus' => $personnelStatus,
            'rawOrderStats' => $orderStats, // Optional: if you decide to reference the raw array later
        ]);
    }
}
