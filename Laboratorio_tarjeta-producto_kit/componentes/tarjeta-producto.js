// componentes/tarjeta-producto.js
// Práctica de laboratorio · Construye <tarjeta-producto> (Actividad 8 de las diapositivas)
// Animales en Acción · Peluquería canina · Atleta 1
// Muestra un servicio con foto, nombre, descripción y "Precio desde".
// Al hacer clic emite "servicio-seleccionado" con { servicio, precio }.

// ───────── PASO 2 · Plantilla con Shadow DOM y slots ─────────
// Una sola plantilla, declarada fuera de la clase.
const plantilla = document.createElement("template");
plantilla.innerHTML = `
  <style>
    /* PASO 3 · :host es la propia etiqueta <tarjeta-producto>.
       Sin display sería inline y el borde se vería roto. */
    :host {
      display: block;
      background: #fff;
      border: 2px solid var(--color-marca, #ccc);
      border-radius: 14px;
      overflow: hidden;
      cursor: pointer;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }

    :host(:hover),
    :host(:focus-visible) {
      transform: translateY(-3px);
      box-shadow: 0 8px 18px rgba(0, 0, 0, 0.12);
      outline: none;
    }

    /* RETO EXTRA · atributo destacado = borde dorado */
    :host([destacado]) {
      border-color: gold;
      box-shadow: 0 0 0 3px gold;
    }

    /* Tarjeta elegida por el cliente */
    :host([seleccionada]) {
      box-shadow: 0 0 0 4px var(--color-marca, #ccc);
    }

    .etiqueta {
      display: none;
      position: absolute;
      top: 10px;
      left: 10px;
      background: gold;
      color: #4a3b00;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.2rem 0.6rem;
      border-radius: 999px;
    }
    :host([destacado]) .etiqueta { display: inline-block; }

    .foto { position: relative; }

    /* ::slotted para la foto y el nombre que llegan de la página */
    ::slotted(img) {
      display: block;
      width: 100%;
      height: 180px;
      object-fit: cover;
    }

    .cuerpo { padding: 1rem 1.1rem 1.2rem; }

    ::slotted(h3) {
      margin: 0 0 0.4rem;
      font-size: 1.2rem;
      color: var(--color-marca, #ccc);
    }

    .descripcion {
      color: #555;
      margin: 0 0 1rem;
      min-height: 2.6em;
      line-height: 1.35;
    }

    .precio {
      display: flex;
      align-items: baseline;
      gap: 0.4rem;
      color: #333;
    }
    .precio small { color: #777; }
    #precio {
      font-size: 1.4rem;
      font-weight: 700;
      color: var(--color-marca, #ccc);
    }
  </style>

  <div class="foto">
    <span class="etiqueta">Más pedido</span>
    <slot name="foto"></slot>
  </div>
  <div class="cuerpo">
    <slot name="nombre"></slot>
    <div class="descripcion">
      <slot>Sin descripción</slot>
    </div>
    <div class="precio">
      <small>Precio desde</small>
      <span id="precio">—</span>
    </div>
  </div>
`;

export class TarjetaProducto extends HTMLElement {

  // PASO 3 · Indica qué atributos observa el componente.
  static get observedAttributes() {
    return ["precio"];
  }

  constructor() {
    super();
    // PASO 2 · Crea el Shadow DOM en modo "open".
    // Aquí no se leen atributos ni se dibuja HTML.
    this.attachShadow({ mode: "open" });
    this._alSeleccionar = this._alSeleccionar.bind(this);
    this._alTeclear = this._alTeclear.bind(this);
  }

  connectedCallback() {
    // PASO 2 · Agrega al Shadow DOM una COPIA de la plantilla con cloneNode(true).
    if (!this.shadowRoot.hasChildNodes()) {
      this.shadowRoot.append(plantilla.content.cloneNode(true));
    }
    // PASO 3 · Muestra el precio inicial.
    this._mostrarPrecio();

    // Accesible con teclado: Tab para llegar, Enter o Espacio para elegir.
    if (!this.hasAttribute("tabindex")) this.setAttribute("tabindex", "0");
    if (!this.hasAttribute("role")) this.setAttribute("role", "button");

    this.addEventListener("click", this._alSeleccionar);
    this.addEventListener("keydown", this._alTeclear);
  }

  disconnectedCallback() {
    this.removeEventListener("click", this._alSeleccionar);
    this.removeEventListener("keydown", this._alTeclear);
  }

  attributeChangedCallback(nombre, anterior, valor) {
    // PASO 3 · Cuando cambie "precio", actualiza lo que se ve en pantalla.
    // Si el atributo ya viene escrito en el HTML, este método se ejecuta
    // ANTES que connectedCallback; _mostrarPrecio comprueba que la plantilla ya esté clonada.
    if (nombre === "precio" && anterior !== valor) {
      this._mostrarPrecio();
    }
  }

  // PASO 3 · La propiedad lee y escribe el atributo, así quedan sincronizados.
  get precio() {
    return Number(this.getAttribute("precio"));
  }

  set precio(valor) {
    this.setAttribute("precio", valor);
  }

  // RETO EXTRA · propiedad destacado sincronizada con su atributo
  get destacado() {
    return this.hasAttribute("destacado");
  }

  set destacado(valor) {
    this.toggleAttribute("destacado", Boolean(valor));
  }

  _mostrarPrecio() {
    const span = this.shadowRoot.querySelector("#precio");
    if (!span) return; // la plantilla todavía no está clonada
    const n = this.precio;
    span.textContent =
      this.hasAttribute("precio") && !Number.isNaN(n)
        ? `$${n.toFixed(2)}`
        : "Consultar";
  }

  // Unión final del equipo: <resumen-cotizacion> escucha este evento desde document.
  _alSeleccionar() {
    document
      .querySelectorAll("tarjeta-producto[seleccionada]")
      .forEach((t) => t.removeAttribute("seleccionada"));
    this.setAttribute("seleccionada", "");

    const servicio =
      this.querySelector('[slot="nombre"]')?.textContent.trim() ?? "";

    this.dispatchEvent(
      new CustomEvent("servicio-seleccionado", {
        detail: { servicio, precio: this.precio },
        bubbles: true,
        composed: true, // permite que el evento salga del Shadow DOM
      })
    );
  }

  _alTeclear(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this._alSeleccionar();
    }
  }
}

// ───────── PASO 1 · Registra el componente ─────────
// La etiqueta lleva guion, como exige el estándar de Custom Elements.
customElements.define("tarjeta-producto", TarjetaProducto);
