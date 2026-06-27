<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
            'redirect' => $request->get('redirect', route('customer.dashboard')),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        $user = Auth::user();

        // Prevent inactive suppliers from logging in
        if (
            $user->role_as === 'supplier' &&
            $user->supplier &&
            $user->supplier->status !== 'active'
        ) {
            Auth::logout();

            return redirect()
                ->route('login')
                ->withErrors([
                    'email' => 'Your supplier account is still awaiting admin approval.',
                ]);
        }

        switch ($user->role_as) {
            case 'admin':
                return redirect()->route('admin.dashboard');

            case 'manager':
                return redirect()->route('manager.dashboard');

            case 'supplier':
                return redirect()->route('supplier.dashboard');

            case 'delivery_personnel':
                return redirect()->route('delivery.dashboard');

            case 'customer':
            default:
                return redirect()->route('customer.dashboard');
        }
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
