<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\NewStaffAccountMail;
use App\Models\DeliveryPersonnel;
use App\Models\Manager;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Illuminate\Support\Str;

class StaffController extends Controller
{
   public function index(Request $request)
{
    // Fix: We can use snake_case for the relationship mapping to align perfectly with your frontend keys
    $query = User::query()
        ->with(['manager', 'deliveryPersonnel']); // Keeps Eloquent model naming conventions

    // Role filter
    if ($request->filled('role') && $request->role !== 'all') {
        $query->where('role_as', $request->role);
    }

    // Search filter
    if ($request->filled('search')) {
        $search = trim($request->search); // Clean trailing whitespaces from live inputs

        $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('email', 'like', "%{$search}%");
        });
    }

    $users = $query
        ->latest()
        ->paginate(10)
        ->withQueryString();

    // Map relationship key to match your React component template structure perfectly
    $users->getCollection()->transform(function ($user) {
        if ($user->relationLoaded('deliveryPersonnel')) {
            $user->delivery_personnel = $user->deliveryPersonnel;
        }
        return $user;
    });

    return Inertia::render('Admin/Staff/Index', [
        'users' => $users,
        'filters' => [
            'role' => $request->role ?? 'all',
            'search' => $request->search ?? '',
        ],
    ]);
}
    public function create()
    {
        return Inertia::render('Admin/Staff/Create');
    }

    public function store(Request $request)
    {
        // 1. Validate inbound profile fields (password field removed as it is auto-generated)
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'role_as' => 'required|in:admin,manager,delivery',
        ]);

        // 2. Generate a secure, random temporary 12-character password
        $randomPassword = Str::random(12);

        // 3. Persist the primary User profile
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($randomPassword), // Securely hash the random text
            'role_as' => $validated['role_as'],
        ]);

        // 4. Map and build conditional sub-profiles based on selected role
        if ($validated['role_as'] === 'manager') {
            Manager::create([
                'user_id' => $user->id,
                'specification' => $request->specification,
                'status' => 'active',
            ]);
        }

        if ($validated['role_as'] === 'delivery') {
            DeliveryPersonnel::create([
                'user_id' => $user->id,
                'vehicle_type' => $request->vehicle_type,
                'plate_number' => $request->plate_number,
                'status' => 'available',
            ]);
        }

        // 5. Dispatch custom HTML Blade view containing the plain-text credentials string
        Mail::to($user->email)->send(new NewStaffAccountMail($user, $randomPassword));

        return redirect()
            ->route('admin.staff.index')
            ->with('success', 'Staff member profile built successfully. Access credentials have been transmitted to ' . $user->email);
    }

    public function show(User $staff)
    {
        $staff->load(['manager', 'deliveryPersonnel']);

        return Inertia::render('Admin/Staff/Show', [
            'staff' => $staff
        ]);
    }

    public function edit(User $staff)
    {
        $staff->load(['manager', 'deliveryPersonnel']);

        return Inertia::render('Admin/Staff/Edit', [
            'staff' => $staff
        ]);
    }

    public function update(Request $request, User $staff)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $staff->id,
            'role_as' => 'required|in:admin,manager,delivery',
        ]);

        $staff->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role_as' => $validated['role_as'],
        ]);

        if ($validated['role_as'] === 'manager') {
            Manager::updateOrCreate(
                ['user_id' => $staff->id],
                [
                    'specification' => $request->specification,
                    'status' => $request->manager_status ?? 'active',
                ]
            );
            DeliveryPersonnel::where('user_id', $staff->id)->delete();
        }

        if ($validated['role_as'] === 'delivery') {
            DeliveryPersonnel::updateOrCreate(
                ['user_id' => $staff->id],
                [
                    'vehicle_type' => $request->vehicle_type,
                    'plate_number' => $request->plate_number,
                    'status' => $request->delivery_status ?? 'available',
                ]
            );
            Manager::where('user_id', $staff->id)->delete();
        }

        return redirect()
            ->route('admin.staff.index')
            ->with('success', 'Staff updated successfully.');
    }

    public function destroy(User $staff)
    {
        Manager::where('user_id', $staff->id)->delete();
        DeliveryPersonnel::where('user_id', $staff->id)->delete();
        $staff->delete();

        return redirect()
            ->route('admin.staff.index')
            ->with('success', 'Staff deleted successfully.');
    }
}
