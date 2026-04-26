<?php

namespace Modulos_ERP\InventarioKrsft\Models;

use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    protected $table = 'inventario_productos';
    
    protected $fillable = [
        'nombre',
        'descripcion',
        'sku',
        'cantidad',
        'precio',
        'precio_unitario',
        'categoria',
        'unidad',
        'moneda',
        'estado',
        'estado_flujo',
        'ubicacion',
        'project_id',
        'purchase_order_id',
        'apartado',
        'nombre_proyecto',
        'estado_ubicacion',
        'batch_id',
        'diameter',
        'series',
        'material_type',
        'amount',
        'amount_pen',
        'cantidad_reservada',
        'verificado_at',
        'verificado_por',
    ];

    protected $casts = [
        'apartado'           => 'boolean',
        'cantidad'           => 'integer',
        'cantidad_reservada' => 'integer',
        'precio'             => 'float',
        'precio_unitario'    => 'float',
        'amount'             => 'float',
        'amount_pen'         => 'float',
        'verificado_at'      => 'datetime',
    ];

    /**
     * Relación con reportes del producto.
     */
    public function reportes()
    {
        return $this->hasMany(Reporte::class, 'producto_id');
    }

    /**
     * Reservas activas de este producto.
     */
    public function reservations()
    {
        return $this->hasMany(\Modulos_ERP\ComprasKrsft\Models\InventoryReservation::class, 'inventory_item_id');
    }

    /**
     * Cantidad disponible real (total - reservada).
     */
    public function getCantidadDisponibleAttribute(): int
    {
        return max(0, $this->cantidad - ($this->cantidad_reservada ?? 0));
    }

    /**
     * Precio unitario calculado (total / cantidad).
     */
    public function getPrecioUnitarioCalculadoAttribute(): float
    {
        if ($this->precio_unitario) {
            return $this->precio_unitario;
        }
        return $this->cantidad > 0
            ? round($this->precio / $this->cantidad, 4)
            : $this->precio;
    }

    /**
     *¿Está disponible para reutilización?
     */
    public function getDisponibleParaReusoAttribute(): bool
    {
        return !$this->apartado
            && ($this->estado_flujo ?? 'disponible') === 'disponible'
            && $this->cantidad_disponible > 0;
    }
}
