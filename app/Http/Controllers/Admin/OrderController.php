<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Notifications\OrderStatusUpdatedNotification;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with(['user', 'items.product'])
            ->orderBy('created_at', 'desc')
            ->paginate(20)
            ->through(function ($order) {
                $order->total_items = $order->items->sum('quantity');
                return $order;
            });


        $stats = [
            'total_orders' => Order::count(),
            'pending_orders' => Order::where('status', 'pending')->count(),
            'processing_orders' => Order::where('status', 'processing')->count(),
            'shipped_orders' => Order::where('status', 'shipped')->count(),
            'completed_orders' => Order::where('status', 'completed')->count(),
            'cancelled_orders' => Order::where('status', 'cancelled')->count(),
            'total_revenue' => Order::where('status', 'completed')->sum('total_price'),

            'total_profit' => Order::where('status', 'completed')->count(),
        ];

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'stats' => $stats,
        ]);
    }

    public function show(Order $order)
    {
        $order->load([
            'user',
            'items.product.images',
            'items.size',
            'items.customizations'
        ]);

        return Inertia::render('Admin/Orders/Show', [
            'order' => $order,
        ]);
    }

    public function update(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,processing,shipped,completed,cancelled',
            'notes' => 'nullable|string',
        ]);

        $oldStatus = $order->status;

        if ($validated['status'] === 'completed' && $order->status !== 'completed') {

            $productionCost = 0;

            $order->load('items.customizations');

            foreach ($order->items as $item) {

                foreach ($item->customizations as $customization) {

                    $option = \App\Models\CustomizationOption::with('material')
                        ->find($customization->customization_option_id);

                    if ($option && $option->material) {

                        $productionCost +=
                            $option->material->cost_per_unit *
                            $option->quantity_used *
                            $item->quantity;
                    }
                }
            }

            $profit =
                $order->total_price -
                $order->shipping_cost -
                $productionCost;

            $order->update([
                'status' => 'completed',
                'production_cost' => $productionCost,
                'profit' => $profit,
            ]);

        } else {

            $order->update([
                'status' => $validated['status'],
            ]);
        }
        // $order->update([
        //     'status' => $validated['status'],
        // ]);

        // Send notification to customer if status changed
        if ($oldStatus !== $validated['status'] && $order->user_id) {
            try {
                $user = User::find($order->user_id);
                if ($user) {
                    $user->notify(new OrderStatusUpdatedNotification($order, $oldStatus, $validated['status']));
                    \Log::info('Customer notification sent for order: ' . $order->order_number . ' Status: ' . $oldStatus . ' → ' . $validated['status']);
                }
            } catch (\Exception $e) {
                \Log::error('Failed to send status update notification: ' . $e->getMessage());
            }
        }

        return redirect()->back()->with('success', 'Order status updated successfully.');
    }


    public function destroy(Order $order)
    {
        $order->delete();
        return redirect()->route('admin.orders.index')->with('success', 'Order deleted successfully.');
    }


}
