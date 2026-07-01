<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\CustomizationCategoryController;
use App\Http\Controllers\Admin\CustomizationOptionController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\DeliveryZoneController;
use App\Http\Controllers\Admin\DeliveryZoneRequestController;
use App\Http\Controllers\Admin\MaterialController as AdminMaterialController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\StaffController;
use App\Http\Controllers\Admin\StockController;
use App\Http\Controllers\Admin\SupplierController;
use App\Http\Controllers\Auth\SupplierRegisterController;
use App\Http\Controllers\Customer\CartController;
use App\Http\Controllers\Customer\CheckoutController;
use App\Http\Controllers\Customer\DashboardController as CustomerDashboardController;
use App\Http\Controllers\Customer\DeliveryRequestController;
use App\Http\Controllers\Customer\OrderController as CustomerOrderController;
use App\Http\Controllers\Customer\ProductController as CustomerProductController;
use App\Http\Controllers\Customer\ProfileController;
use App\Http\Controllers\Delivery\DashboardController;
use App\Http\Controllers\Manager\DashboardController as ManagerDashboardController;
use App\Http\Controllers\Manager\RawMaterialInventoryController;
use App\Http\Controllers\Manager\RawMaterialPageController;
use App\Http\Controllers\StaffPasswordController;
use App\Http\Controllers\Supplier\DashboardController as SupplierDashboard;
use App\Http\Controllers\Supplier\MaterialController as SupplierMaterialController;
use App\Http\Controllers\Supplier\MaterialController as SupplierPaymentController;
use App\Http\Controllers\Supplier\NoticationController;
use App\Http\Controllers\Supplier\PaymentController;
use App\Http\Controllers\Supplier\PurchaseOrderController;
use App\Http\Controllers\Supplier\RawMaterialRequestController;
use App\Http\Controllers\Supplier\SupplierProfileController;
use App\Http\Controllers\WebhookController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;




// Public routes (no authentication required)
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'laravelVersion' => app()->version(),
        'phpVersion' => phpversion(),
    ]);
})->name('home');

Route::get('/supplier/register', [SupplierRegisterController::class, 'getSupplierRegistration']);
Route::post('/supplier/register', [SupplierRegisterController::class, 'supplierRegistration'])->name('supplier.register.store');
Route::post('/check-email', function (Request $request) {
    return response()->json(['exists' => User::where('email', $request->email)->exists(),]);
})->name('check.email');


Route::get('/products', [CustomerProductController::class, 'index'])->name('products.index');
Route::get('/products/{product}', [CustomerProductController::class, 'show'])->name('products.show');

// MAKE THESE PUBLIC - Move delivery validation OUTSIDE auth middleware
Route::post('/checkout/validate-delivery', [CheckoutController::class, 'validateDelivery'])->name('checkout.validate-delivery');
Route::get('/delivery-zones-public', [DeliveryZoneController::class, 'getPublicZones'])->name('delivery-zones.public');


//CUSTOMER ROUTES - these require authentication, so they are inside the auth middleware group below
// Authenticated routes only
Route::middleware(['auth'])->group(function () {
    // Cart routes
    Route::prefix('cart')->name('cart.')->group(function () {
        Route::get('/', [CartController::class, 'index'])->name('index');
        Route::post('/add/{product}', [CartController::class, 'add'])->name('add');
        Route::patch('/update/{cartId}', [CartController::class, 'update'])->name('update');
        Route::delete('/remove/{cartId}', [CartController::class, 'remove'])->name('remove');
        Route::delete('/clear', [CartController::class, 'clear'])->name('clear');
    });

    // API route for order tracking (requires auth)
    Route::get('/api/order-route/{order}', [CustomerOrderController::class, 'getRoute'])->name('api.order.route');

    // Payment routes
    Route::get('/payment/initiate/{order}', [PaymentController::class, 'initiate'])->name('payment.initiate');
    Route::get('/payment/success/{order}', [PaymentController::class, 'success'])->name('payment.success');
    Route::get('/payment/cancel/{order}', [PaymentController::class, 'cancel'])->name('payment.cancel');
    Route::get('/payment/status/{order}', [PaymentController::class, 'checkStatus'])->name('payment.status');

    // Webhook (keep as is)
    Route::post('/api/webhooks/paymongo', [WebhookController::class, 'handlePayMongo'])->name('webhook.paymongo');

    // Checkout routes (store requires auth)
    Route::prefix('checkout')->name('checkout.')->group(function () {
        Route::get('/', [CheckoutController::class, 'index'])->name('index');
        Route::post('/', [CheckoutController::class, 'store'])->name('store');
        // validate-delivery is now outside this group (public)
    });

    // Delivery request route
    Route::post('/delivery-request', [DeliveryRequestController::class, 'store'])->name('delivery-request.store');

    // // Dashboard redirect based on role
    // Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Customer routes
    Route::prefix('customer')->name('customer.')->group(function () {
        Route::get('/dashboard', [CustomerDashboardController::class, 'index'])->name('dashboard');
        Route::get('/profile', [ProfileController::class, 'index'])->name('profile.index');
        Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password');

        Route::prefix('orders')->group(function () {
            Route::get('/', [CustomerOrderController::class, 'index'])->name('orders.index');
            Route::get('/{order}', [CustomerOrderController::class, 'show'])->name('orders.show');
            Route::post('/', [CustomerOrderController::class, 'store'])->name('orders.store');
        });
    });


    // Notification routes
    Route::post('/notifications/mark-as-read', [App\Http\Controllers\NotificationController::class, 'markAsRead'])
        ->name('notifications.mark-as-read');
    Route::post('/notifications/mark-all-read', [App\Http\Controllers\NotificationController::class, 'markAllAsRead'])
        ->name('notifications.mark-all-read');
    Route::post('/notifications/mark-and-redirect', [App\Http\Controllers\NotificationController::class, 'markAndRedirect'])
        ->name('notifications.mark-and-redirect');
    Route::get('/notifications/unread-count', [App\Http\Controllers\NotificationController::class, 'getUnreadCount'])
        ->name('notifications.unread-count');



});

// Admin routes (require auth + admin middleware)
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    Route::resource('products', AdminProductController::class);
    Route::resource('orders', AdminOrderController::class);
    Route::resource('categories', CategoryController::class);

    // Stock management routes
    Route::prefix('stock')->name('stock.')->group(function () {
        Route::get('/', [StockController::class, 'index'])->name('index');
        Route::get('/logs', [StockController::class, 'logs'])->name('logs');
        Route::post('/in/{product}', [StockController::class, 'stockIn'])->name('in');
        Route::post('/out/{product}', [StockController::class, 'stockOut'])->name('out');
        Route::post('/alert/{product}', [StockController::class, 'updateAlert'])->name('alert.update');
    });

    // Material management routes
    Route::prefix('materials')->name('materials.')->group(function () {
        Route::get('/', [AdminMaterialController::class, 'index'])->name('index');
        Route::get('/', [AdminMaterialController::class, 'index'])->name('index');
        Route::get('/archived', [AdminMaterialController::class, 'archived'])->name('archived');
        Route::get('/logs', [AdminMaterialController::class, 'logs'])->name('logs');
        Route::post('/', [AdminMaterialController::class, 'store'])->name('store');
        Route::put('/{material}', [AdminMaterialController::class, 'update'])->name('update');
        Route::delete('/{material}', [AdminMaterialController::class, 'destroy'])->name('destroy');
        Route::post('/{id}/restore', [AdminMaterialController::class, 'restore'])->name('restore');
        Route::delete('/{id}/force-delete', [AdminMaterialController::class, 'forceDelete'])->name('forceDelete');
        Route::post('/{material}/stock-in', [AdminMaterialController::class, 'stockIn'])->name('stock.in');
        Route::post('/{material}/stock-out', [AdminMaterialController::class, 'stockOut'])->name('stock.out');
        Route::get('/{material}/linked-options', [AdminMaterialController::class, 'getLinkedOptions'])->name('linked-options');
    });

    Route::prefix('customization-categories')->name('customization-categories.')->group(function () {
        Route::get('/', [CustomizationCategoryController::class, 'index'])->name('index');
        Route::post('/', [CustomizationCategoryController::class, 'store'])->name('store');
        Route::put('/{category}', [CustomizationCategoryController::class, 'update'])->name('update');
    });

    // Customization Options routes
    Route::prefix('customization-options')->name('customization-options.')->group(function () {
        Route::get('/', [CustomizationOptionController::class, 'index'])->name('index');
        Route::post('/', [CustomizationOptionController::class, 'store'])->name('store');
        Route::put('/{option}', [CustomizationOptionController::class, 'update'])->name('update');
    });

    // Supplier management routes
    Route::prefix('suppliers')->name('suppliers.')->group(function () {
        Route::get('/', [SupplierController::class, 'index'])->name('index');
        Route::get('/list', [SupplierController::class, 'getSuppliersList'])->name('list');
        Route::post('/', [SupplierController::class, 'store'])->name('store');
        Route::delete('/{supplier}', [SupplierController::class, 'destroy'])->name('destroy');
        Route::put('/{supplier}/status', [SupplierController::class, 'updateStatusSupplier'])->name('update-status');

        Route::post('/{id}/restore', [SupplierController::class, 'restore'])->name('restore');
        // Archive (Soft Delete)
        Route::delete('/{supplier}', [SupplierController::class, 'archive'])->name('archive');
        // Restore
        Route::post('/{id}/restore', [SupplierController::class, 'restore'])->name('restore');
        // Permanent Delete
        Route::delete('/{id}/force-delete', [SupplierController::class, 'forceDelete'])->name('forceDelete');

    });

    // Delivery Zones Management Routes
    Route::prefix('delivery-zones')->name('delivery-zones.')->group(function () {
        Route::get('/', [DeliveryZoneController::class, 'index'])->name('index');
        Route::post('/', [DeliveryZoneController::class, 'store'])->name('store');
        Route::put('/{zone}', [DeliveryZoneController::class, 'update'])->name('update');
        Route::delete('/{zone}', [DeliveryZoneController::class, 'destroy'])->name('destroy');
        Route::post('/{zone}/add-location', [DeliveryZoneController::class, 'addLocation'])->name('add-location');
        Route::delete('/locations/{location}', [DeliveryZoneController::class, 'removeLocation'])->name('remove-location');
        Route::post('/{zone}/add-location-coordinates', [DeliveryZoneController::class, 'addLocationWithCoordinates'])->name('add-location-coordinates');
        Route::get('/geocode', [DeliveryZoneController::class, 'geocodeLocation'])->name('geocode');
    });

    // Delivery Requests Management Routes
    Route::prefix('delivery-requests')->name('delivery-requests.')->group(function () {
        Route::get('/', [DeliveryZoneRequestController::class, 'index'])->name('index');
        Route::put('/{deliveryRequest}', [DeliveryZoneRequestController::class, 'update'])->name('update');
        Route::delete('/{deliveryRequest}', [DeliveryZoneRequestController::class, 'destroy'])->name('destroy');
        Route::get('/stats', [DeliveryZoneRequestController::class, 'getStats'])->name('stats');
    });

    // Image management routes
    Route::delete('/products/images/{image}', [AdminProductController::class, 'deleteImage'])->name('products.images.delete');
    Route::post('/products/{product}/images', [AdminProductController::class, 'addImage'])->name('products.images.add');

    // Report routes
    Route::prefix('reports')->name('reports.')->group(function () {
        Route::get('/stock', [ReportController::class, 'stockReport'])->name('stock');
        Route::get('/stock-logs', [ReportController::class, 'stockLogsReport'])->name('stock-logs');
    });


    Route::get('/reports/sales', [App\Http\Controllers\Admin\ReportController::class, 'salesReport'])->name('reports.sales');



    Route::resource('staff', StaffController::class);

    Route::middleware(['auth', 'role:delivery'])->prefix('delivery')->name('delivery.')->group(function () {

        Route::get('dashboard', [DashboardController::class, 'index'])->name('index');

    });

});

Route::middleware(['auth', 'role:supplier'])->prefix('supplier')->name('supplier.')->group(function () {

    Route::get('/dashboard', [SupplierDashboard::class, 'index'])->name('dashboard');

    // Materials
    Route::resource('materials', SupplierMaterialController::class);
    // Archived Materials Page
    Route::get('/materials/archived', [SupplierMaterialController::class, 'archiveList'])->name('materials.archived');

    // Archive Material
    Route::delete('/materials/{material}/archive', [SupplierMaterialController::class, 'archive'])->name('materials.archive');
    // Add Stock page
    Route::get('/materials/{material}/stock', [SupplierMaterialController::class, 'addStock'])->name('materials.stock');
    // Save Stock
    Route::post('/materials/{material}/stock', [SupplierMaterialController::class, 'storeStock'])->name('materials.add.stock');
    // View Inventory Logs
    Route::get('/materials/{material}/logs', [SupplierMaterialController::class, 'logs'])->name('materials.logs');
    Route::put('/materials/{material}/status', [SupplierMaterialController::class, 'updateStatus'])->name('materials.updateStatus');
    Route::post('/materials/{material}/restore', [SupplierMaterialController::class, 'restore'])->name('materials.restore');
    Route::get('/raw-material-requests', [RawMaterialRequestController::class, 'index'])->name('requests.order');

    Route::delete('/materials/{material}/force-delete', [SupplierMaterialController::class, 'forceDelete'])->name('materials.forceDelete');

    Route::get('/raw-material', [RawMaterialRequestController::class, 'index'])->name('raw-material.index');

    // Orders
    Route::resource('purchase-orders', PurchaseOrderController::class);
    // Payments
    Route::resource('payments', SupplierPaymentController::class);
    // Profile
    Route::resource('profile', SupplierProfileController::class);

    Route::post('/notifications/mark-as-read', [NoticationController::class, 'markAsRead'])->name('supplier.notifications.read');

    Route::post('/notifications/mark-all-read', [NoticationController::class, 'markAllAsRead'])->name('supplier.notifications.read-all');

});


Route::middleware(['auth', 'role:manager'])->prefix('manager')->name('manager.')->group(function () {

    Route::get('/dashboard', [ManagerDashboardController::class, 'dashboard'])->name('dashboard');
    Route::get('/inventory', [RawMaterialInventoryController::class, 'index'])->name('manager.inventory');
    Route::get('/raw-materials', [RawMaterialPageController::class, 'rawMaterialPage'])->name('raw-materials');

});

Route::get('/staff/setup-password/{user}', [StaffPasswordController::class, 'show'])->name('staff.setup-password');
Route::post('/staff/setup-password/{user}', [StaffPasswordController::class, 'store'])->name('staff.setup-password.store');


// Test routes (keep as is)
Route::get('/test-product/{id}', function ($id) {
    $product = App\Models\Product::find($id);

    $images = DB::table('product_customization_images')
        ->where('product_id', $id)
        ->get()
        ->keyBy('customization_option_id');

    $customizations = $product->customizations;
    if (is_string($customizations)) {
        $customizations = json_decode($customizations, true);
    }

    $enhanced = [];
    foreach ($customizations as $catId => $options) {
        $enhanced[$catId] = [];
        foreach ($options as $opt) {
            $opt['preview_image_url'] = isset($images[$opt['id']])
                ? asset('storage/' . $images[$opt['id']]->image_path)
                : null;
            $enhanced[$catId][] = $opt;
        }
    }

    return response()->json($enhanced);
});

Route::get('/debug-ors', function () {
    $apiKey = env('OPENROUTE_API_KEY');

    $results = [
        'api_key_exists' => !empty($apiKey),
        'api_key_prefix' => !empty($apiKey) ? substr($apiKey, 0, 10) . '...' : 'none',
    ];

    if (!empty($apiKey)) {
        try {
            $response = Illuminate\Support\Facades\Http::withHeaders([
                'Authorization' => $apiKey,
                'Content-Type' => 'application/json',
            ])->post('https://api.openrouteservice.org/v2/directions/driving-car/geojson', [
                        'coordinates' => [
                            [124.57058152076657, 8.532339288654399],
                            [124.6, 8.5]
                        ]
                    ]);

            $results['api_call_status'] = $response->status();
            $results['api_call_success'] = $response->successful();

            if ($response->successful()) {
                $data = $response->json();
                $results['has_route'] = isset($data['features'][0]);
                $results['coordinates_count'] = isset($data['features'][0]['geometry']['coordinates'])
                    ? count($data['features'][0]['geometry']['coordinates'])
                    : 0;
            } else {
                $results['error_body'] = $response->body();
            }
        } catch (\Exception $e) {
            $results['exception'] = $e->getMessage();
        }
    }

    return response()->json($results);
});

require __DIR__ . '/auth.php';
