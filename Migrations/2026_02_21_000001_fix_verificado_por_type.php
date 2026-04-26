<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Corrige el tipo de la columna verificado_por de integer a string.
 * El código espera guardar el nombre del usuario (string), no un ID.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('inventario_productos', function (Blueprint $table) {
            $table->string('verificado_por', 255)->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('inventario_productos', function (Blueprint $table) {
            $table->unsignedBigInteger('verificado_por')->nullable()->change();
        });
    }
};
