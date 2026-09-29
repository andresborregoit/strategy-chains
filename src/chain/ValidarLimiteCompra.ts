import type { Pedido } from "../modelos.ts";
import { formatearMoneda } from "../utils/moneda.ts";
import type { ResultadoValidacion } from "./ResultadoValidacion.ts";
import { ValidadorPedido } from "./ValidadorPedido.ts";

export class ValidarLimiteCompra extends ValidadorPedido {
  protected nombre = "Validar limite de compra";
  private limite: number;

  constructor(limite: number) {
    super();
    this.limite = limite;
  }

  protected validar(pedido: Pedido): ResultadoValidacion {
    if (pedido.precioFinal > this.limite) {
      return {
        aprobado: false,
        mensaje: `ERROR - supera el limite de ${formatearMoneda(this.limite)}`
      };
    }

    return {
      aprobado: true,
      mensaje: "OK"
    };
  }
}
