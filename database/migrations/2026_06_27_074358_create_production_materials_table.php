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
        Schema::create('production_materials', function (Blueprint $table) {
            $table->id();

            $table->foreignId('task_id')->constrained('production_tasks')->cascadeOnDelete();
            $table->foreignId('raw_material_id')->constrained('raw_materials')->cascadeOnDelete();

            $table->decimal('quantity_used', 10, 2);

            // snapshot cost during usage (IMPORTANT)
            $table->decimal('unit_cost', 12, 2)->nullable();

            $table->decimal('total_cost', 12, 2)
                ->storedAs('quantity_used * unit_cost');

            $table->text('remarks')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('production_materials');
    }
};
