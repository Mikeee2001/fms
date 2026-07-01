<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class StaffPasswordController extends Controller
{
    public function show(User $user)
    {
        return Inertia::render('Auth/SetupPassword', [
            'user' => $user,
        ]);
    }
    public function store(Request $request, User $user)
    {
        $request->validate([
            'password' => 'required|min:8|confirmed',
        ]);

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        return redirect()
            ->route('login')
            ->with('success', 'Password created successfully.');
    }
}
