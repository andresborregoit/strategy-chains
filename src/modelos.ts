export interface ProductoPedido {
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  stockDisponible: number;
}

export interface Cliente {
  nombre: string;
  activo: boolean;
}

export interface Pedido {
  cliente: Cliente;
  productos: ProductoPedido[];
  pagoAprobado: boolean;
  precioFinal: number;
}

export function calcularSubtotal(productos: ProductoPedido[]): number {
  return productos.reduce((total, producto) => {
    return total + producto.precioUnitario * producto.cantidad;
  }, 0);
}

export function contarProductos(productos: ProductoPedido[]): number {
  return productos.reduce((total, producto) => total + producto.cantidad, 0);
}
