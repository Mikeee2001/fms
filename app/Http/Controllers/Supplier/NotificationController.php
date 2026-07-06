<?php

namespace App\Http\Controllers\Supplier;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{

    public function index()
    {
        $user = Auth::user();

        $notifications = $user->notifications()
            ->latest()
            ->take(20)
            ->get()
            ->map(function ($n) {

                $data = $n->data ?? [];

                return [
                    'id' => $n->id,
                    'type' => $data['type'] ?? null,
                    'message' => $data['message'] ?? $data['title'] ?? 'Notification',
                    'po_number' => $data['po_number'] ?? null,
                    'action_url' => $data['action_url'] ?? null,
                    'read_at' => $n->read_at,
                    'created_at' => $n->created_at,
                ];
            });

        return response()->json([
            'notifications' => $notifications,
            'unread_count' => $user->unreadNotifications()->count(), // THIS is correct
        ]);
    }

    public function markAsRead(Request $request)
    {
        $request->validate([
            'notification_id' => 'required',
        ]);

        $notification = Auth::user()
            ->notifications()
            ->where('id', $request->notification_id)
            ->first();

        if ($notification) {
            $notification->markAsRead();
        }

        return response()->json([
            'success' => true,
        ]);
    }

    public function markAndRedirect(Request $request)
    {
        $request->validate([
            'notification_id' => 'required|exists:notifications,id',
            'redirect_url' => 'required|string',
        ]);

        $notification = Auth::user()
            ->notifications()
            ->find($request->notification_id);

        if ($notification) {
            $notification->markAsRead();
        }

        return redirect($request->redirect_url);
    }

    public function markAllAsRead()
    {
        $user = Auth::user();

        $user->unreadNotifications->markAsRead();

        return response()->json([
            'success' => true,
        ]);
    }
}
