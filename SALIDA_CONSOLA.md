# Salida esperada por consola

```text
========================================
CASO 1 - Pedido aprobado
========================================
Precio inicial: $100.000
Estrategias aplicadas:
- Cliente VIP: 15% de descuento (-$15.000)
- Descuento por cantidad: 11 productos, 10% de descuento (-$8.500)
- Promocion especial: 5% adicional (-$3.825)
- Envio Express: recargo de $10.000
Precio resultante: $82.675
Cadena de validacion:
- Validar cliente: OK
- Validar stock: OK
- Validar pago: OK
- Validar limite de compra: OK
Resultado final: Pedido aprobado

========================================
CASO 2 - Pedido rechazado por falta de stock
========================================
Precio inicial: $90.000
Estrategias aplicadas:
- Cliente Premium: 10% de descuento (-$9.000)
- Descuento por cantidad: 3 productos, 0% de descuento (-$0)
- Envio normal: recargo de $5.000
Precio resultante: $86.000
Cadena de validacion:
- Validar cliente: OK
- Validar stock: ERROR - falta stock de Zapatillas
Resultado final: ERROR - falta stock de Zapatillas

========================================
CASO 3 - Pedido rechazado por problema en el pago
========================================
Precio inicial: $100.000
Estrategias aplicadas:
- Cliente VIP: 15% de descuento (-$15.000)
- Descuento Black Friday: 20% de descuento (-$17.000)
- Envio Express: recargo de $10.000
Precio resultante: $78.000
Cadena de validacion:
- Validar cliente: OK
- Validar stock: OK
- Validar pago: ERROR - el pago fue rechazado
Resultado final: ERROR - el pago fue rechazado
```
