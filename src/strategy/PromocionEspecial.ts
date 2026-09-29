import type { Pedido } from "../modelos.ts";
import { formatearMoneda } from "../utils/moneda.ts";
import type { EstrategiaPrecio, ResultadoEstrategia } from "./EstrategiaPrecio.ts";

export class PromocionEspecial implements EstrategiaPrecio {
  nombre: string;
  private porcentaje: number;

  constructor(porcentaje: number, nombre = "Promocion especial") {
    this.porcentaje = porcentaje;
    this.nombre = nombre;
  }

  aplicar(precioActual: number, _pedido: Pedido): ResultadoEstrategia {
    const descuento = precioActual * this.porcentaje;

    return {
      precio: precioActual - descuento,
      descripcion: `${this.porcentaje * 100}% adicional (-${formatearMoneda(descuento)})`
    };
  }
}
