<?php

namespace App\Http\Controllers\Supplier;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NoticationController extends Controller
{
    public function markAsRead(Request $request)
    {
        $request->validate([
            'notification_id' => 'required|exists:notifications,id',
        ]);

        $notification = Auth::user()
            ->notifications()
            ->find($request->notification_id);

        if ($notification) {
            $notification->markAsRead();
        }

        return back();
    }

    public function markAllAsRead()
    {
        Auth::user()->unreadNotifications->markAsRead();

        return back();
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
}
