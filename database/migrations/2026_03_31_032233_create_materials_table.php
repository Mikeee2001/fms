<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('materials', function (Blueprint $table) {

            $table->id();

            $table->foreignId('supplier_id')
                ->constrained('suppliers')
                ->cascadeOnDelete();

            $table->foreignId('raw_material_category_id')
                ->constrained('raw_material_categories')
                ->cascadeOnDelete();

            $table->string('material_name');

            $table->string('slug')->unique();

            $table->foreignId('unit_id')
                ->constrained('units');

            $table->decimal('purchase_price', 10, 2);

            $table->decimal('stock', 10, 2)->default(0);

            $table->decimal('minimum_stock', 10, 2)->default(0);

            $table->boolean('is_active')->default(true);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('materials');
    }
};
