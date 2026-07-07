<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use App\Models\User;
use App\Notifications\SupplierRegistrationNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;

class SupplierRegisterController extends Controller
{
    public function getSupplierRegistration()
    {
        return Inertia::render('Auth/SupplierRegistration');
    }


    public function supplierRegistration(Request $request)
    {

        // dd([
        //     'hasFile' => $request->hasFile('company_logo'),
        //     'file' => $request->file('company_logo'),
        //     'all' => $request->all(),
        // ]);
        $validated = $request->validate([
            'company_logo' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'company_name' => 'required|string|max:255',
            'contact_person' => 'nullable|string|max:255',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'contact_number' => [
                'required',
                'regex:/^9\d{9}$/'
            ],
            'email' => 'required|email|unique:users,email|max:255',
            'address' => 'nullable|string',
            'password' => 'required|min:8|confirmed',
            [
                'email.unique' => 'This email address is already registered.',
            ]
        ]);

        DB::transaction(function () use ($request, $validated) {

            $user = User::create([
                'name' => $validated['company_name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role_as' => 'supplier', // optional
            ]);

            $logoPath = null;

            if ($request->hasFile('company_logo')) {
                $logoPath = $request->file('company_logo')
                    ->store('supplier_logos', 'public');
            }

            $supplier = Supplier::create([
                'user_id' => $user->id,
                'company_logo' => $logoPath,
                'company_name' => $validated['company_name'],
                'contact_person' => $validated['contact_person'] ?? null,
                'contact_number' => '+63' . $validated['contact_number'],
                'address' => $validated['address'] ?? null,
                'status' => 'inactive',
                'latitude' => $request->latitude,
                'longitude' => $request->longitude,
            ]);

            /*
            |--------------------------------------------------------------------------
            | Notify Admins
            |--------------------------------------------------------------------------
            */

            $admins = User::where('role_as', 'admin')->get();

            Notification::send(
                $admins,
                new SupplierRegistrationNotification($supplier)
            );
        });

        return redirect()
            ->route('login')
            ->with(
                'success',
                'Registration successful! Your supplier account is pending approval from the administrator. Please wait for approval before logging in.'
            );
    }


}
