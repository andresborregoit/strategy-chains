import type { Pedido } from "../modelos.ts";
import type { ResultadoValidacion } from "./ResultadoValidacion.ts";

export interface HandlerPedido {
  establecerSiguiente(siguiente: HandlerPedido): HandlerPedido;
  procesar(pedido: Pedido): ResultadoValidacion;
}
