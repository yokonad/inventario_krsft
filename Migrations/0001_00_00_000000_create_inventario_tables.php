<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migración consolidada del Módulo de Inventario (inventariokrsft)
 * Consolidó 4 archivos de migración en uno solo
 * Generada: 2026-02-19
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Tabla: inventario_productos
        Schema::create('inventario_productos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->text('descripcion')->nullable();
            $table->string('sku')->unique();
            $table->integer('cantidad')->default(0);
            $table->decimal('precio', 12, 2)->default(0);
            $table->string('categoria')->nullable();
            $table->string('unidad')->default('UND');
            $table->string('moneda', 10)->default('PEN');
            $table->string('estado')->default('activo');
            $table->string('ubicacion')->nullable();
            $table->unsignedBigInteger('project_id')->nullable();
            $table->boolean('apartado')->default(false);
            $table->string('nombre_proyecto')->nullable();
            $table->string('estado_ubicacion')->nullable();
            $table->string('batch_id')->nullable();
            $table->string('diameter')->nullable();
            $table->string('series')->nullable();
            $table->string('material_type')->nullable();
            $table->decimal('amount', 12, 2)->nullable();
            $table->decimal('amount_pen', 12, 2)->nullable();
            $table->timestamps();
            
            // Campos de verificación (agregados 2026-02-09)
            $table->timestamp('verificado_at')->nullable();
            $table->string('verificado_por')->nullable();

            // Índices
            $table->index('project_id');
            $table->index('batch_id');
            $table->index('apartado');
            $table->index('estado');
        });

        // Tabla: inventario_reportes
        Schema::create('inventario_reportes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('producto_id');
            $table->string('producto_nombre');
            $table->string('producto_sku');
            $table->string('proyecto_nombre');
            $table->text('motivo');
            
            // Campos de solución (agregados 2026-02-09)
            $table->text('solucion')->nullable();
            
            $table->string('reportado_por');
            $table->enum('estado', ['pendiente', 'revisado', 'resuelto'])->default('pendiente');
            $table->text('notas')->nullable();
            $table->timestamp('revisado_at')->nullable();
            $table->string('revisado_por')->nullable();
            
            // Campos de resolución (agregados 2026-02-09)
            $table->timestamp('resuelto_at')->nullable();
            $table->string('resuelto_por')->nullable();
            
            $table->timestamps();
            
            // Foreign key
            $table->foreign('producto_id')
                  ->references('id')
                  ->on('inventario_productos')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventario_reportes');
        Schema::dropIfExists('inventario_productos');
    }
};
