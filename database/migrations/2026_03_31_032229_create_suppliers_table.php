<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('suppliers', function (Blueprint $table) {
            $table->id();

             $table->string('company_logo');
            $table->string('company_name');

            $table->string('contact_person')
                ->nullable();

            $table->string('contact_number')
                ->nullable();

            $table->text('address')
                ->nullable();

            $table->enum('status', [
                'active',
                'inactive'
            ])->default('inactive');

            // $table->boolean('is_active')
            //     ->default(true);

            $table->timestamps();

            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

        });

        // Add supplier relationship to materials
        Schema::table('materials', function (Blueprint $table) {
            $table->foreignId('supplier_id')
                ->nullable()
                ->after('id')
                ->constrained('suppliers')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('materials', function (Blueprint $table) {
            $table->dropForeign(['supplier_id']);
            $table->dropColumn('supplier_id');
        });

        Schema::dropIfExists('suppliers');
    }
};
