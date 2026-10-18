# Práctica de laboratorio · `<tarjeta-producto>`

Programación Integrativa de Componentes Web · Unidad 1: Web Components

| Dato | Completa |
|------|---|
| Emprendimiento: |Animales en acción  |
| Estudiantes (Apellido Nombre):|Barrionuevo Melanie, Guevara Daniel, Ñacato Mirley, Tonato Michael |
| NRC | 36642 |
| Fecha: |18/10/2026 |
| Enlace del repositorio: | |

## Propuesta del emprendimiento

- Nombre del emprendimiento: Animales en acción 
- Problema que resuelve: La mayoría de peluquerías de perros manejan sus citas por WhatsApp lo cual al cotizar se demora más ya que se tiene que elegir el servicio, la raza y el horario disponible. Este sitio web resuelve eso, ofreciendo un catálogo con precios transparentes, que se ajustan dinámicamente al tamaño de la mascota, y un sistema de reservas directo y en tiempo real.
- Cliente al que se dirige: Personas con mascotas (perros)

## Cómo abrir el proyecto

1. Abre la carpeta en Visual Studio Code.
2. Clic derecho sobre `index.html` → **Open with Live Server**. Los módulos no cargan con `file://`.
3. Abre las herramientas del navegador (F12) y deja visible la pestaña **Consola**.

## Registro de los pasos

### Paso 1 · index.html y el módulo

- Etiqueta que registramos:
- ¿Por qué el nombre debe llevar guion?:
- Ruta del módulo y cómo lo importa la página:

### Paso 2 · Plantilla, Shadow DOM y slots

- Slots con nombre que tiene la plantilla:
- Texto de respaldo del slot sin nombre:
- ¿Qué pasaría si no usáramos `cloneNode(true)`?:

### Paso 3 · Atributo precio y estilos

- Método que reacciona cuando cambia `precio`:
- Color de marca (`--color-marca`) y dónde lo definimos:
- Valor de respaldo que usa el componente si la página no define la variable:

### Paso 4 · Tres productos del emprendimiento

| # | Producto | Precio |
|---|---|---|
| 1 | | |
| 2 | | |
| 3 | | |

### Paso 5 · Repositorio del equipo

| Integrante | Qué hizo en este laboratorio |
|---|---|
| | |
| | |
| | |
| | |

## Verificación

Marca con una `x` lo que ya comprobaste en el navegador.

- [ ] La etiqueta tiene guion.
- [ ] La página solo cambia lo que el componente expone con `var()`.
- [ ] `setAttribute` cambia el precio en pantalla.
- [ ] La consola no muestra errores.

Prueba que usamos en la consola:

```js
document.querySelector("tarjeta-producto").setAttribute("precio", "25");
```

Resultado que vimos:

## Reto extra (opcional)

- [ ] Atributo `destacado` que cambia el borde con `:host([destacado])`.

## Uso de inteligencia artificial

- Herramienta usada (o «ninguna»):
- Para qué la consultamos:
- Qué cambiamos o comprobamos nosotros:
