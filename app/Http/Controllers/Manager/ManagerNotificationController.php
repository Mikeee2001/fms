<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ManagerNotificationController extends Controller
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
                    'message' => $data['message'] ?? '',
                    'po_id' => $data['po_id'] ?? null,
                    'po_number' => $data['po_number'] ?? null,
                    'status' => $data['status'] ?? null,
                    'read_at' => $n->read_at,
                    'created_at' => $n->created_at,
                ];
            });

        return response()->json([
            'notifications' => $notifications,
            'unread_count' => $user
                ->unreadNotifications()
                ->count(),
        ]);
    }

    public function markAsRead(Request $request)
    {
        $notification = Auth::user()
            ->notifications()
            ->find($request->notification_id);

        if ($notification) {
            $notification->markAsRead();
        }

        return response()->json([
            'success' => true
        ]);
    }

    public function markAllAsRead()
    {
        Auth::user()
            ->unreadNotifications
            ->markAsRead();

        return response()->json([
            'success' => true
        ]);
    }
}
