<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class DeliveryMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
  public function handle(Request $request, Closure $next): Response
    {
        // Check if user is authenticated and is delivery
        if (Auth::check() && Auth::user()->role_as === 'delivery') {
            return $next($request);
        }

        // If not delivery, redirect to home page with error message
        return redirect('/')->with('error', 'You do not have delivery access.');
    }
}
