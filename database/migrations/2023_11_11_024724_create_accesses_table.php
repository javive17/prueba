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
        Schema::create('accesses', function (Blueprint $table) {
            $table->id();
            $table->string('barcode', 191);
            $table->foreignId('device_id')->constrained();
            $table->enum('type', ['in', 'out'])->default('in');
            $table->tinyInteger('allowed')->default(1);
            $table->text('message')->nullable();
            $table->foreign('barcode')->references('barcode')->on('tickets');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accesses');
    }
};
