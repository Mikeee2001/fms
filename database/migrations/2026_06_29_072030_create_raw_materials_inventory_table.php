<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('raw_material_inventory', function (Blueprint $table) {

            $table->id();

            $table->foreignId('raw_material_id')
                ->constrained('raw_materials')
                ->cascadeOnDelete();

            $table->decimal('current_stock', 10, 2)->default(0);

            $table->decimal('minimum_stock', 10, 2)->default(0);

            $table->decimal('maximum_stock', 10, 2)->nullable();

            $table->date('last_restock_date')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('raw_material_inventory');
    }
};
