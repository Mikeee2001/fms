<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('raw_material_inventory_logs', function (Blueprint $table) {

            $table->id();

            $table->foreignId('raw_material_inventory_id')
                ->constrained('raw_material_inventories')
                ->cascadeOnDelete();

            $table->foreignId('raw_material_id')
                ->constrained('raw_materials')
                ->cascadeOnDelete();

            $table->foreignId('supplier_id')
                ->constrained('suppliers')  
                ->cascadeOnDelete();

            $table->enum('type', [
                'initial_stock',
                'stock_in',
                'stock_out',
                'adjustment',
                'purchase_request',
                'restocked',
            ]);

            $table->decimal('quantity', 10, 2);

            $table->decimal('stock_before', 10, 2);

            $table->decimal('stock_after', 10, 2);

            $table->text('remarks')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('raw_material_inventory_logs');
    }
};
