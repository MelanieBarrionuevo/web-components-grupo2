# Práctica de laboratorio · `<tarjeta-producto>`

Programación Integrativa de Componentes Web · Unidad 1: Web Components

| Dato                           | Completa                                                           |
| ------------------------------ | ------------------------------------------------------------------ |
| Emprendimiento:                | Animales en acción                                                 |
| Estudiantes (Apellido Nombre): | Barrionuevo Melanie, Guevara Daniel, Ñacato Mirley, Tonato Michael |
| NRC                            | 36642                                                              |
| Fecha:                         | 18/10/2026                                                         |
| Enlace del repositorio:        | https://github.com/MelanieBarrionuevo/web-components-grupo2.git    |

## Propuesta del emprendimiento

- Nombre del emprendimiento: Animales en acción
- Problema que resuelve: La mayoría de peluquerías de perros manejan sus citas por WhatsApp lo cual al cotizar se demora más ya que se tiene que elegir el servicio, la raza y el horario disponible. Este sitio web resuelve eso, ofreciendo un catálogo con precios transparentes, que se ajustan dinámicamente al tamaño de la mascota, y un sistema de reservas directo y en tiempo real.
- Cliente al que se dirige: Personas con mascotas (perros) que buscan agendar servicios de peluquería de forma rápida.

## Cómo abrir el proyecto

1. Abre la carpeta en Visual Studio Code.
2. Clic derecho sobre `index.html` → **Open with Live Server**. Los módulos no cargan con `file://`.
3. Abre las herramientas del navegador (F12) y deja visible la pestaña **Consola**.

## Registro de los pasos

### Paso 1 · index.html y el módulo

- Etiqueta que registramos: Registramos 4 etiquetas: tarjeta-producto, selector-razas, calendario-citas y resumen-cotizacion. Las cuales se definieron con: `customElements.define("tarjeta-producto", TarjetaProducto)`, `customElements.define("selector-raza", SelectorRaza)``customElements.define("calendario-citas", CalendarioCitas)`, `customElements.define("resumen-cotizacion", ResumenCotizacion)`
- ¿Por qué el nombre debe llevar guion?: Porque Custom Elements exige al menos un guion para distinguir las etiquetas propias de las estándar de HTML como <div> y para evitar choques con etiquetas futuras.
- Ruta del módulo y cómo lo importa la página: Cada componente vive en su propio módulo dentro de `componentes/` y exporta su clase. La página index.html los importa con `<script type="module">`

| Componente             | Módulo                                | Clase exportada     |
| ---------------------- | ------------------------------------- | ------------------- |
| `<tarjeta-producto>`   | `./componentes/tarjeta-producto.js`   | `TarjetaProducto`   |
| `<selector-raza>`      | `./componentes/selector-raza.js`      | `SelectorRaza`      |
| `<calendario-citas>`   | `./componentes/calendario-citas.js`   | `CalendarioCitas`   |
| `<resumen-cotizacion>` | `./componentes/resumen-cotizacion.js` | `ResumenCotizacion` |

### Paso 2 · Plantilla, Shadow DOM y slots

- Slots con nombre que tiene la plantilla:
- `<tarjeta-producto>`: `foto` y `nombre`, más un slot sin nombre para la descripción. El precio es un `<span id="precio">` que escribe el componente.
- `<selector-raza>`: `foto`, `nombre` y `boton`, más un slot sin nombre para la descripción. El precio (factor) es un `<span id="precio">` que escribe el componente.
- `<calendario-citas>`: `titulo`. La fecha y las horas las dibuja el componente a partir de `datos/horarios.json`.
- `<resumen-cotizacion>`: `mensaje`. El servicio, la raza, el horario y el total los escribe el componente al recibir los eventos.

- Texto de respaldo del slot sin nombre: 
  - `<tarjeta-producto>`: "Sin descripción" (se ve en Spa de Patitas).
  - `<selector-raza>`: "Sin descripción" (se ve en Raza grande).
  - `<calendario-citas>`: "Elige tu turno" (aparece si no se envía contenido al slot `titulo`).
  - `<resumen-cotizacion>`: "¡Revisa tus datos antes de confirmar!" (se ve porque la página no envía contenido al slot `mensaje`).

- ¿Qué pasaría si no usáramos `cloneNode(true)`?:
  - `<tarjeta-producto>`: solo la primera tarjeta de servicio tendría estructura; las otras tres aparecerían vacías.
  - `<selector-raza>`: solo la tarjeta de raza pequeña tendría estructura; la mediana y la grande aparecerían vacías.
  - `<calendario-citas>`: si hubiera otro calendario en la página, aparecería sin selector de fecha ni grilla de horas.
  - `<resumen-cotizacion>`: si hubiera otro resumen en la página, aparecería en blanco.


### Paso 3 · Atributo precio y estilos

- Método que reacciona cuando cambia `precio`: El que reacciona es `attributeChangedCallback(nombre, anterior, valor)`.
- Color de marca (`--color-marca`) y dónde lo definimos: `#e67e22` (naranja), definido una sola vez en `:root` dentro de `estilos.css`, ya que esto cambia todos los componentes que estan encapsulados debido a que es una variable css.
- Valor de respaldo que usa el componente si la página no define la variable:
 - `<tarjeta-producto>`: `#ccc` (gris claro), en `var(--color-marca, #ccc)`, para el borde, el nombre y el precio.
  - `<selector-raza>`: `#555` (gris oscuro), en `var(--color-marca, #555)`, para el borde, el nombre, los botones y el precio.
  - `<calendario-citas>`: `#ccc` (gris claro), en `var(--color-marca, #ccc)`, para el borde, el título y las horas.
  - `<resumen-cotizacion>`: `#555` en el borde, `#333` en el título y el total, y `#4CAF50` (verde) en el botón Confirmar cita.

### Paso 4 · Tres productos del emprendimiento

**Servicios (`<tarjeta-producto>`)**: precios base para perros pequeños.

| #   | Servicio                             | Precio |
| --- | ------------------------------------ | ------ |
| 1   | Baño Completo (destacado)            | $12.00 |
| 2   | Corte de Raza                        | $25.00 |
| 3   | Deslanado                            | $18.00 |
| 4   | Spa de Patitas (prueba del respaldo) | $8.00  |

**Razas por tamaño (`<selector-raza>`)**: el factor multiplica el precio del servicio.

| Tamaño                       | Razas                                            | Factor |
| ---------------------------- | ------------------------------------------------ | ------ |
| Pequeña                      | Caniche toy, Chihuahua, Shih Tzu, Yorkshire      | ×1.00  |
| Mediana (destacado)          | Caniche mediano, Schnauzer, Cocker, Beagle       | ×1.25  |
| Grande (prueba del respaldo) | Golden Retriever, Labrador, Husky, Pastor Alemán | ×1.50  |

**Horario (`<calendario-citas>`)**: atención de 09:00 a 17:00; las horas ocupadas se leen de `datos/horarios.json` y aparecen deshabilitadas.

**Resumen (`<resumen-cotizacion>`)**: ejemplo de cotización: Corte de Raza ($25) × Husky (×1.50) = **$37.50**.

### Paso 5 · Repositorio del equipo

El repositorio usa la rama `developer` para integrar el trabajo de cada integrante mediante Pull Requests, y `main` para la versión final.

| Integrante         | Qué hizo en este laboratorio                                                                                                                                                                                                              |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Barrionuevo Camila | `<selector-raza>`: tarjetas de razas por tamaño con factor de precio, botón Elegir por slot y una sola raza elegida a la vez. Creó el repositorio, integró las ramas en `developer`, resolvió conflictos y armó los estilos de la página. |
| Guevara Daniel     | `<calendario-citas>`: selección de fecha y horas disponibles leídas de `datos/horarios.json`.                                                                                                                                             |
| Ñacato Mirley      | `<tarjeta-producto>`: catálogo de servicios con precio observado, selección accesible con teclado y reto `destacado`.                                                                                                                     |
| Tonato Michael     | `<resumen-cotizacion>`: cálculo del total y botón Confirmar cita, activo solo con los tres datos completos.                                                                                                                               |

## Verificación

Marca con una `x` lo que ya comprobaste en el navegador.

- [x] La etiqueta tiene guion.
- [x] La página solo cambia lo que el componente expone con `var()`.
- [x] `setAttribute` cambia el precio en pantalla.
- [x] La consola no muestra errores.

Prueba que usamos en la consola:

```js
document.querySelector("tarjeta-producto").setAttribute("precio", "25");
document.querySelector("selector-raza").setAttribute("precio", "1.1");
document.querySelector("calendario-citas").setAttribute("fecha", "2026-10-21");
document.querySelector("resumen-cotizacion").setAttribute("total", "45");
```

Resultado que vimos:

- Baño Completo cambió a "Precio desde $25.00".
- Raza pequeña cambió a "×1.10".
- El calendario redibujó las horas de la nueva fecha.
- El resumen mostró "Total: $45.00".

Todo sin recargar la página y sin errores en la consola.

## Reto extra (opcional)

- [x] Atributo `destacado` que cambia el borde con `:host([destacado])`.

## Uso de inteligencia artificial

- Herramienta usada (o «ninguna»): Claude, Gemini
- Para qué la consultamos: Para entender como crear ramas en git, hacer commits y pulls, además para ayudarnos con los estilos y crear algunas clases para que nuestro emprendimiento tenga sentido.
- Qué cambiamos o comprobamos nosotros: Adaptamos el código la logica de nuestro emprendimiento, probamos cada componente en el navegador con Live Server y la consola y corregimos los datos que enviaba cada evento para que el resumen calculara bien el total. También aprendimos que hay archivos como index.html que deben evitar ser cambiados porque puede dar problemas al momento de unir dos ramas o más.
