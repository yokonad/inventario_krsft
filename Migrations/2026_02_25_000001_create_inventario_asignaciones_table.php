<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Tabla de asignaciones de materiales a proyectos.
 * Permite rastrear qué cantidad de cada material se asigna a cada proyecto,
 * con historial completo de quién y cuándo asignó.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventario_asignaciones', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('producto_id');
            $table->unsignedBigInteger('project_id');
            $table->string('project_name');
            $table->integer('cantidad')->default(0);
            $table->string('asignado_por')->nullable();
            $table->text('notas')->nullable();
            $table->timestamps();

            $table->foreign('producto_id')
                  ->references('id')
                  ->on('inventario_productos')
                  ->onDelete('cascade');

            $table->index('producto_id');
            $table->index('project_id');
        });

        // Agregar campo estado_flujo si no existe
        if (!Schema::hasColumn('inventario_productos', 'estado_flujo')) {
            Schema::table('inventario_productos', function (Blueprint $table) {
                $table->string('estado_flujo')->default('disponible')->after('estado');
            });
        }

        // Agregar campo cantidad_reservada si no existe
        if (!Schema::hasColumn('inventario_productos', 'cantidad_reservada')) {
            Schema::table('inventario_productos', function (Blueprint $table) {
                $table->integer('cantidad_reservada')->default(0)->after('cantidad');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('inventario_asignaciones');
    }
};
