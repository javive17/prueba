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
        Schema::create('devices', function (Blueprint $table) {
            $table->id();
            $table->string('name', 191);
            $table->string('uuid', 191)->unique();
            $table->string('gate', 191);
            $table->longText('zones')->nullable();
            $table->datetime('first_sync')->nullable();
            $table->datetime('last_sync')->nullable();
            $table->tinyInteger('active')->default(1);
            $table->integer('max_count')->unsigned()->default(100);
            $table->integer('count')->unsigned()->default(0);
            $table->integer('screen')->unsigned()->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('devices');
    }
};
