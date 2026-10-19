    // ───────── PASO 2 · Plantilla con Shadow DOM y slots ─────────
    const plantilla = document.createElement("template");
    plantilla.innerHTML = `
    <style>
        /* Estilos propios encapsulados en el Shadow DOM para no afectar al resto */
        :host {
        display: flex;
        flex-direction: column;
        border: 2px solid var(--color-marca, #555);
        border-radius: 12px;
        padding: 20px;
        background-color: #ffffff;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        h2 {
        margin-top: 0;
        color: var(--color-marca, #333);
        }

        .detalle {
        margin: 8px 0;
        color: #555;
        font-size: 1em;
        }

        .total {
        margin: 16px 0 0 0;
        padding-top: 15px;
        border-top: 1px dashed #ddd;
        font-weight: bold;
        font-size: 1.5em;
        color: var(--color-marca, #333);
        }

        button {
        margin-top: 20px;
        padding: 12px;
        border: none;
        border-radius: 8px;
        background-color: var(--color-marca, #4CAF50);
        color: #fff;
        font-size: 1.1em;
        font-weight: bold;
        cursor: pointer;
        }

        button:disabled {
        background-color: #ccc;
        cursor: not-allowed;
        }

        .mensaje-respaldo {
        margin-top: 12px;
        font-size: 0.9em;
        color: #777;
        text-align: center;
        }
    </style>

    <!-- Estructura del resumen -->
    <h2>Resumen de tu cita</h2>
    <div class="detalle"><strong>Servicio:</strong> <span id="txt-servicio">Falta seleccionar</span></div>
    <div class="detalle"><strong>Raza:</strong> <span id="txt-raza">Falta seleccionar</span></div>
    <div class="detalle"><strong>Horario:</strong> <span id="txt-horario">Falta seleccionar</span></div>
    
    <div class="total">Total: $<span id="txt-total">0.00</span></div>
    
    <button id="btn-confirmar" disabled>Confirmar cita</button>
    
    <div class="mensaje-respaldo">
        <slot name="mensaje">¡Revisa tus datos antes de confirmar!</slot>
    </div>
    `;

    export class ResumenCotizacion extends HTMLElement {

    // PASO 3 · Indica qué atributos observa el componente.
    static get observedAttributes() {
        return ["total"];
    }

    constructor() {
        super();
        // PASO 2 · Crea el Shadow DOM en modo "open".
        this.attachShadow({ mode: "open" });
        
        // Variables locales para guardar lo que eligen en los otros componentes
        this.servicioSeleccionado = null;
        this.razaSeleccionada = null;
        this.horarioSeleccionado = null;
    }

    connectedCallback() {
        // PASO 2 · Agrega al Shadow DOM una COPIA de la plantilla
        if (!this.shadowRoot.hasChildNodes()) {
        this.shadowRoot.appendChild(plantilla.content.cloneNode(true));
        }

        // Referencias a las partes visuales
        this.txtServicio = this.shadowRoot.querySelector('#txt-servicio');
        this.txtRaza = this.shadowRoot.querySelector('#txt-raza');
        this.txtHorario = this.shadowRoot.querySelector('#txt-horario');
        this.btnConfirmar = this.shadowRoot.querySelector('#btn-confirmar');

        // Escuchar eventos globales desde el document (así se conectan los 3 atletas)
        document.addEventListener("servicio-seleccionado", e => { 
        this.servicioSeleccionado = e.detail; 
        this.txtServicio.textContent = `${this.servicioSeleccionado.servicio} ($${this.servicioSeleccionado.precio})`;
        this.calcular(); 
        });

        document.addEventListener("raza-seleccionada", e => { 
        this.razaSeleccionada = e.detail; 
        this.txtRaza.textContent = `${this.razaSeleccionada.raza} (x${this.razaSeleccionada.factor})`;
        this.calcular(); 
        });

        document.addEventListener("horario-seleccionado", e => { 
        this.horarioSeleccionado = e.detail; 
        this.txtHorario.textContent = `${this.horarioSeleccionado.fecha} a las ${this.horarioSeleccionado.hora}`;
        this.calcular(); 
        });

        // Acción de confirmar
        this.btnConfirmar.addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("cita-confirmada", {
            detail: {
            servicio: this.servicioSeleccionado,
            raza: this.razaSeleccionada,
            horario: this.horarioSeleccionado,
            total: this.total
            },
            bubbles: true,
            composed: true // Permite que el evento salga del Shadow DOM
        }));
        alert("¡Gracias! Tu cita ha sido confirmada.");
        });

        // PASO 3 · Muestra el precio inicial
        this.actualizar();
    }

    attributeChangedCallback(nombre, anterior, valor) {
        // PASO 3 · Cuando cambie "total", actualiza lo que se ve en pantalla.
        if (anterior === valor) return;
        
        if (nombre === "total") {
        this.actualizar();
        }
    }

    // PASO 3 · Propiedad para leer y escribir el atributo total
    get total() {
        return Number(this.getAttribute("total")) || 0;
    }

    set total(valor) {
        this.setAttribute("total", valor);
    }

    // Lógica del Atleta 4: calcular total y activar botón
    calcular() {
        if (this.servicioSeleccionado && this.razaSeleccionada) {
        // Cálculo: precio base x factor de tamaño
        const nuevoTotal = this.servicioSeleccionado.precio * this.razaSeleccionada.factor;
        this.total = nuevoTotal.toFixed(2); // Al hacer this.total =, se lanza set total y attributeChangedCallback
        }

        // Activa Confirmar cita solo si los 3 datos están listos
        if (this.servicioSeleccionado && this.razaSeleccionada && this.horarioSeleccionado) {
        this.btnConfirmar.disabled = false;
        } else {
        this.btnConfirmar.disabled = true;
        }
    }

    actualizar() {
        const spanTotal = this.shadowRoot.querySelector("#txt-total");
        if (spanTotal) {
        spanTotal.textContent = this.total.toFixed(2);
        }
    }
    }

    // ───────── PASO 1 · Registra el componente ─────────
    customElements.define("resumen-cotizacion", ResumenCotizacion);