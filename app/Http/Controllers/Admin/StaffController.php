<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\NewStaffAccountMail;
use App\Models\Manager;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;

class StaffController extends Controller
{
    public function index(Request $request)
    {
        // Fix: We can use snake_case for the relationship mapping to align perfectly with your frontend keys
        $query = User::query()
            ->whereIn('role_as', ['admin', 'manager', 'delivery']);

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
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'role_as' => 'required|in:admin,manager,delivery',
            'specification' => 'nullable|required_if:role_as,manager|string|max:255',
        ]);

        // Generate temporary password
        $randomPassword = Str::random(12);

        // Create user
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($randomPassword),
            'role_as' => $validated['role_as'],
        ]);

        if ($validated['role_as'] === 'manager') {
            Manager::create([
                'user_id' => $user->id,
                'specification' => $validated['specification'],
                'status' => 'active',
            ]);
        }

        // Generate 1-hour activation/setup link
        $setupLink = route('staff.setup-password', [
            'user' => $user->id
        ]);

        // Send email containing password and activation link
        Mail::to($user->email)->send(
            new NewStaffAccountMail(
                $user,
                $randomPassword,
                $setupLink
            )
        );

        return redirect()
            ->route('admin.staff.index')
            ->with(
                'success',
                'Staff member profile created successfully. Login credentials have been sent to ' . $user->email
            );
    }

    public function show(User $staff)
    {
        $staff->load(['manager', 'deliveryPersonnel', 'admin']);

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

        return redirect()
            ->route('admin.staff.index')
            ->with('success', 'Staff updated successfully.');
    }

    public function destroy(User $staff)
    {
        // Delete manager record if applicable
        Manager::where('user_id', $staff->id)->delete();

        // Delete user account
        $staff->delete();

        return redirect()
            ->route('admin.staff.index')
            ->with('success', 'Staff deleted successfully.');
    }
}
