// Datos: razas de cada tamaño
const RAZAS = {
  pequeno: ["Caniche toy", "Chihuahua", "Shih Tzu", "Yorkshire"],
  mediano: ["Caniche mediano", "Schnauzer", "Cocker", "Beagle"],
  grande: ["Golden Retriever", "Labrador", "Husky", "Pastor Alemán"]
};

// ───────── PASO 2 · Plantilla con Shadow DOM y slots ─────────
// Una sola plantilla, declarada fuera de la clase.
const plantilla = document.createElement("template");
plantilla.innerHTML = `
  <style>
    /* PASO 3 · Escribe aquí los estilos del componente:
       - :host con display y un borde
       - el color de marca leído con var(--color-marca, un-color-de-respaldo)
       - ::slotted(...) para la foto y el nombre que llegan de la página
       RETO EXTRA · :host([destacado]) que cambie el borde */
    :host {
      display: flex;
      flex-direction: column;
      border: 2px solid var(--color-marca, #555);
      border-radius: 12px;
      padding: 16px;
      background-color: #ffffff;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    :host([destacado]) {
      border: 3px solid gold;
      box-shadow: 0 6px 15px rgba(255, 215, 0, 0.4);
    }

    /*Paso 3*/
    ::slotted(img) {
      width: 100%;
      height: 240px;
      object-fit: cover;
      border-radius: 8px;
    }
 
    ::slotted(h3) {
      color: var(--color-marca, #555);
      margin: 14px 0 8px 0;
      font-size: 1.3em;
    }
 
    .descripcion {
      color: #555;
      font-size: 0.95em;
      line-height: 1.4;
      margin: 0 0 12px 0;
    }
 
    .opciones {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      flex-grow: 1;
      align-content: flex-start;
    }
 
    button {
      border: 1.5px solid var(--color-marca, #555);
      background: #fff;
      color: #2c3e50;
      border-radius: 20px;
      padding: 5px 12px;
      font-size: 0.85em;
      cursor: pointer;
    }
 
    button.activo {
      background-color: var(--color-marca, #555);
      color: #fff;
    }
 
    .elegida {
      margin: 12px 0 0 0;
      color: #777;
      font-size: 0.9em;
    }
 
    .precio {
      margin: 8px 0 0 0;
      padding-top: 10px;
      border-top: 1px dashed #ddd;
      font-weight: bold;
      font-size: 1.2em;
      color: var(--color-marca, #555);
    }

     /* cambio: estilos del botón que llega por el slot "boton" */
    ::slotted(button) {
      margin-top: 12px;
      width: 100%;
      padding: 10px;
      border: none;
      border-radius: 8px;
      background-color: var(--color-marca, #555);
      color: #fff;
      font-size: 1em;
      font-weight: bold;
      cursor: pointer;
    }

    /* cambio: botón apagado mientras no hay raza */
    ::slotted(button:disabled) {
      opacity: 0.4;
      cursor: not-allowed;
    }
      
  </style>

  <!-- PASO 2 · Escribe aquí:
       - un slot con nombre "foto"
       - un slot con nombre "nombre"
       - un slot sin nombre, con un texto de respaldo
       - un lugar donde se vea el precio (por ejemplo un <span id="precio">) -->
    <slot name="foto"></slot>
    <slot name="nombre"></slot>
    <p class="descripcion"><slot>Sin descripción</slot></p>
    <!--Cambio-->
    <div class="opciones" id="opciones"></div>
    <p class="elegida" id="elegida">Elige la raza de tu perro</p>
    <p class="precio">Precio del servicio <span id="precio">×1.00</span></p>
    <slot name="boton"></slot>
`;

export class SelectorRaza extends HTMLElement {

  // PASO 3 · Indica qué atributos observa el componente.
  static get observedAttributes() {
    return ["precio", "raza"];
  }

  constructor() {
    super();
    // PASO 2 · Crea el Shadow DOM en modo "open".
    this.attachShadow({ mode: "open" });
    // Recuerda: aquí no se leen atributos ni se dibuja HTML.
  }

  render() {
    this.shadowRoot.appendChild(plantilla.content.cloneNode(true));
    this.crearBotones();

    // cambio: escucha el clic del botón que llega por el slot "boton"
    this.addEventListener("click", (e) => {
      const boton = e.target.closest('[slot="boton"]'); // cambio
      if (boton && this.raza) {                         
        this.avisar();                                  
        boton.textContent = "Elegida!";                
      }
    });
  }

  connectedCallback() {
    // PASO 2 · Agrega al Shadow DOM una COPIA de la plantilla con cloneNode(true).
    if (!this.shadowRoot.hasChildNodes()) {
      this.render();
    }
    // PASO 3 · Muestra el precio inicial.
    this.actualizar();
  }

  attributeChangedCallback(nombre, anterior, valor) {
    // PASO 3 · Cuando cambie "precio", actualiza lo que se ve en pantalla.
    // Ojo: si el atributo ya viene escrito en el HTML, este método se ejecuta
    // ANTES que connectedCallback; comprueba que la plantilla ya esté clonada.
    if (anterior === valor){
        return;
    } 
    if (nombre === "precio") {
      this.actualizar();
    }
    if (nombre === "raza") {
      this.actualizar();
    }

  }

  // PASO 3 · La propiedad lee y escribe el atributo, así quedan sincronizados.
  get precio() {
    return Number(this.getAttribute("precio"));
  }
 
  set precio(valor) {
    this.setAttribute("precio", valor);
  }
 
  get raza() {
    return this.getAttribute("raza");
  }
 
  set raza(valor) {
    this.setAttribute("raza", valor);
  }

  crearBotones() {
    const contenedor = this.shadowRoot.querySelector("#opciones");
    const tamano = this.getAttribute("tamano");
    const lista = RAZAS[tamano] || [];
 
    for (const nombreRaza of lista) {
      const boton = document.createElement("button");
      boton.type = "button";
      boton.textContent = nombreRaza;
      boton.dataset.raza = nombreRaza;
      boton.addEventListener("click", () => {
        this.limpiarOtras();
        this.raza = nombreRaza; 
      });
      contenedor.append(boton);
    }
  }
 
  limpiarOtras() {
    document.querySelectorAll("selector-raza").forEach((tarjeta) => {
      if (tarjeta !== this) {
        tarjeta.removeAttribute("raza");
      }
    });
  }

  actualizar() {
    // Si el atributo viene en el HTML, esto corre antes que connectedCallback:
    // se comprueba que la plantilla ya esté clonada.
    const span = this.shadowRoot.querySelector("#precio");
    if (!span) return;
 
    span.textContent = "×" + this.precio.toFixed(2);
 
    const elegida = this.shadowRoot.querySelector("#elegida");
    elegida.textContent = this.raza ? `Raza elegida: ${this.raza}` : "Elige la raza de tu perro";
 
    this.shadowRoot.querySelectorAll("#opciones button").forEach((boton) => {
      boton.classList.toggle("activo", boton.dataset.raza === this.raza);
    });

     // El botón Elegir se activa solo cuando hay una raza marcada
    const boton = this.querySelector('[slot="boton"]'); 
    if (boton) {                                        
      boton.disabled = !this.raza;                      
      boton.textContent = "Elegir";  
    }
  }

  // Avisa a los otros componentes qué raza se eligió
  avisar() {
    this.dispatchEvent(new CustomEvent("raza-seleccionada", {
      detail: {
        raza: this.raza,
        tamano: this.getAttribute("tamano"),
        factor: this.precio
      },
      bubbles: true,
      composed: true
    }));
  }
}

//paso 1 definir la tarjeta
customElements.define("selector-raza", SelectorRaza);

