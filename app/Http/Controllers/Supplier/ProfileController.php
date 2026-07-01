<?php

namespace App\Http\Controllers\Supplier;

use App\Http\Controllers\Controller;
// use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProfileController extends Controller
{
     public function index()
    {
        $user = Auth::user();

        return Inertia::render('Supplier/Profile/Index', [
            'user' => $user->load('supplier'),
        ]);
    }
}
