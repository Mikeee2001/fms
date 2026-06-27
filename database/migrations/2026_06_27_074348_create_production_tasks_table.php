<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
       Schema::create('production_tasks', function (Blueprint $table) {
    $table->id();

    $table->foreignId('order_id')
        ->constrained('orders')
        ->cascadeOnDelete();

    $table->foreignId('manager_id')
        ->constrained('managers')
        ->cascadeOnDelete();

    $table->string('task_name');

    $table->enum('status', [
        'pending',
        'in_progress',
        'completed'
    ])->default('pending');

    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('production_tasks');
    }
};
