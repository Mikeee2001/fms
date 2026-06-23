<?php

namespace App\Http\Controllers;

// use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if ($user->role_as === 'admin') {
            return redirect()->route('admin.dashboard');
        }

        if ($user->role_as === 'delivery') {
            return redirect()->route('delivery.dashboard');
        }

        if ($user->role_as === 'worker') {
            return redirect()->route('worker.dashboard');
        }

        return redirect()->route('customer.dashboard');
    }
}
