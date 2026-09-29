import type { Pedido } from "../modelos.ts";

export interface ResultadoEstrategia {
  precio: number;
  descripcion: string;
}

export interface EstrategiaPrecio {
  nombre: string;
  aplicar(precioActual: number, pedido: Pedido): ResultadoEstrategia;
}
