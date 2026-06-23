<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(EmailVerificationRequest $request): RedirectResponse
    {
        $user = $request->user();

        if (!$user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();
            event(new Verified($user));
        }

        if ($user->role === 'admin') {
            return redirect()->route('admin.dashboard', ['verified' => 1]);
        }

        if ($user->role === 'delivery') {
            return redirect()->route('delivery.dashboard', ['verified' => 1]);
        }

        if ($user->role === 'worker') {
            return redirect()->route('worker.dashboard', ['verified' => 1]);
        }

        return redirect()->route('customer.dashboard', ['verified' => 1]);
    }
}
