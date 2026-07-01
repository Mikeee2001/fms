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
        Schema::create('material_inventory', function (Blueprint $table) {
            $table->id();

            $table->foreignId('material_id')
                ->constrained('materials')
                ->cascadeOnDelete();

            $table->decimal('current_stock', 10, 2)->default(0);

            $table->decimal('minimum_stock', 10, 2)->default(0);

            $table->decimal('maximum_stock', 10, 2)->nullable();

            $table->string('storage_location')->nullable();

            $table->date('last_restock_date')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('material_inventory');
    }
};
