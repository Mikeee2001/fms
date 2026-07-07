<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('goods_receipt_items', function (Blueprint $table) {

            $table->id();

            $table->foreignId('goods_receipt_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('purchase_order_item_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('raw_material_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->decimal('ordered_quantity', 12, 2);

            $table->decimal('received_quantity', 12, 2)->default(0);

            $table->decimal('remaining_quantity', 12, 2)->default(0);

            $table->text('remarks')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('goods_receipt_items');
    }
};
