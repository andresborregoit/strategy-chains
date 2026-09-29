import type { Pedido } from "../modelos.ts";
import type { HandlerPedido } from "./HandlerPedido.ts";
import type { ResultadoValidacion } from "./ResultadoValidacion.ts";

export abstract class ValidadorPedido implements HandlerPedido {
  private siguiente: HandlerPedido | null = null;

  establecerSiguiente(siguiente: HandlerPedido): HandlerPedido {
    this.siguiente = siguiente;
    return siguiente;
  }

  procesar(pedido: Pedido): ResultadoValidacion {
    const resultado = this.validar(pedido);
    console.log(`- ${this.nombre}: ${resultado.mensaje}`);

    if (!resultado.aprobado) {
      return resultado;
    }

    if (this.siguiente === null) {
      return {
        aprobado: true,
        mensaje: "Pedido aprobado"
      };
    }

    return this.siguiente.procesar(pedido);
  }

  protected abstract nombre: string;
  protected abstract validar(pedido: Pedido): ResultadoValidacion;
}
