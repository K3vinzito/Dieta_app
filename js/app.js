let semanaActual = parseInt(localStorage.getItem("semanaActual")) || 1;

document.addEventListener("DOMContentLoaded", () => {
    actualizarTituloSemana();
});
let datosGlobal = null;
function cambiarSemana(direccion) {
    semanaActual += direccion;

    if (semanaActual < 1) semanaActual = 1;

    localStorage.setItem("semanaActual", semanaActual);
    actualizarTituloSemana();
    cargarSemanaActual();
}

function actualizarTituloSemana() {
    document.getElementById("semanaActual").innerText = "Semana " + semanaActual;
}

document.addEventListener("DOMContentLoaded", () => {
    fetch("data/recetas.json")
        .then(res => res.json())
        .then(data => {
           datosGlobal = data;
cargarSemanaActual();
        })
        .catch(err => {
            console.error("Error cargando JSON:", err);
        });
});
function cargarSemanaActual() {

    const claveSemana = "semana" + semanaActual;

    if (!datosGlobal[claveSemana]) {
        document.getElementById("contenido").innerHTML =
            "<p>No hay recetas para esta semana todavía.</p>";
        return;
    }

    const semanaData = datosGlobal[claveSemana];
    const contenedor = document.getElementById("contenido");
    contenedor.innerHTML = "";

    for (let dia in semanaData) {
        const card = document.createElement("div");
        card.className = "card-glass";

        card.innerHTML = `
            <h5 class="text-capitalize">${dia}</h5>
            ${crearBloqueSemana(claveSemana, dia, "desayuno")}
            ${crearBloqueSemana(claveSemana, dia, "almuerzo")}
            ${crearBloqueSemana(claveSemana, dia, "merienda")}
        `;

        contenedor.appendChild(card);
    }
}
function renderizarSemana(data) {
    const contenedor = document.getElementById("contenido");
    contenedor.innerHTML = "";

    for (let dia in data) {
        const card = document.createElement("div");
        card.className = "card-glass";

        card.innerHTML = `
            <h5 class="text-capitalize">${dia}</h5>
            ${crearBloque(dia, "desayuno")}
            ${crearBloque(dia, "almuerzo")}
            ${crearBloque(dia, "merienda")}
        `;

        contenedor.appendChild(card);
    }
}

function crearBloqueSemana(semana, dia, tipo) {

    if (!datosGlobal[semana][dia] || !datosGlobal[semana][dia][tipo]) {
        return "";
    }

    const comida = datosGlobal[semana][dia][tipo];

    return `
        <div class="mt-3">
            <strong>${tipo.toUpperCase()}:</strong>
            ${comida.titulo}
            <br>
            <button class="btn btn-fit btn-sm mt-2"
                onclick="mostrarRecetaSemana('${semana}','${dia}','${tipo}')">
                Ver Receta
            </button>
        </div>
    `;
}

function mostrarRecetaSemana(semana, dia, tipo) {

    const receta = datosGlobal[semana][dia][tipo];

    Swal.fire({
        title: receta.titulo,
        html: `
            <img src="${receta.imagen}" class="receta-img">

            <p><strong>Porciones:</strong> ${receta.porciones}</p>
            <p><strong>Tiempo:</strong> ${receta.tiempo}</p>

            <h6>🛒 Ingredientes</h6>
            <ul style="text-align:left;">
                ${receta.ingredientes.map(i => `<li>${i}</li>`).join("")}
            </ul>

            <h6>🍽 Preparación</h6>
            <ol style="text-align:left;">
                ${receta.preparacion.map(p => `<li>${p}</li>`).join("")}
            </ol>

            <p><strong>⭐ Valor nutricional:</strong> ${receta.valor_nutricional}</p>
        `,
        background: "#0f172a",
        color: "white",
        confirmButtonColor: "#00f5a0",
        width: "95%"
    });
}

function verLista() {

    const claveSemana = "semana" + semanaActual;

    if (!datosGlobal[claveSemana]) {
        Swal.fire({
            title: "Sin recetas",
            text: "No hay recetas para esta semana.",
            background: "#0f172a",
            color: "white",
            confirmButtonColor: "#00f5a0"
        });
        return;
    }

    let ingredientes = [];
    const semanaData = datosGlobal[claveSemana];

    for (let dia in semanaData) {
        ["desayuno", "almuerzo", "merienda"].forEach(tipo => {
            if (semanaData[dia][tipo]) {
                ingredientes = ingredientes.concat(semanaData[dia][tipo].ingredientes);
            }
        });
    }

    const listaUnica = [...new Set(ingredientes)];

    // Recuperar compras guardadas
    let comprasGuardadas = JSON.parse(localStorage.getItem("compras_" + claveSemana)) || [];

    Swal.fire({
        title: `🛒 Lista - Semana ${semanaActual}`,
        html: `
            <div style="text-align:left;">
                ${listaUnica.map(item => `
                    <div style="margin-bottom:8px;">
                        <input type="checkbox" 
                            ${comprasGuardadas.includes(item) ? "checked" : ""}
                            onchange="toggleCompra('${item.replace(/'/g, "\\'")}')">
                        <span>${item}</span>
                    </div>
                `).join("")}
                <hr>
                <button onclick="compartirWhatsApp()" 
                    style="background:#25D366;border:none;color:white;padding:8px 12px;border-radius:10px;">
                    📲 Compartir por WhatsApp
                </button>
            </div>
        `,
        width: "95%",
        background: "#0f172a",
        color: "white",
        confirmButtonColor: "#00f5a0",
        showConfirmButton: false
    });
}

function toggleCompra(item) {

    const claveSemana = "semana" + semanaActual;
    let compras = JSON.parse(localStorage.getItem("compras_" + claveSemana)) || [];

    if (compras.includes(item)) {
        compras = compras.filter(i => i !== item);
    } else {
        compras.push(item);
    }

    localStorage.setItem("compras_" + claveSemana, JSON.stringify(compras));
}

function compartirWhatsApp() {

    const claveSemana = "semana" + semanaActual;
    let compras = JSON.parse(localStorage.getItem("compras_" + claveSemana)) || [];

    const semanaData = datosGlobal[claveSemana];
    let ingredientes = [];

    for (let dia in semanaData) {
        ["desayuno", "almuerzo", "merienda"].forEach(tipo => {
            if (semanaData[dia][tipo]) {
                ingredientes = ingredientes.concat(semanaData[dia][tipo].ingredientes);
            }
        });
    }

    const listaUnica = [...new Set(ingredientes)];

    let mensaje = `🛒 Lista de Compras - Semana ${semanaActual}%0A%0A`;

    listaUnica.forEach(item => {
        const comprado = compras.includes(item) ? "✅" : "⬜";
        mensaje += `${comprado} ${item}%0A`;
    });

    const url = `https://wa.me/?text=${mensaje}`;
    window.open(url, "_blank");
}

function verGrafico() {

    let historial = JSON.parse(localStorage.getItem("historialPeso")) || [];

    if (historial.length < 2) {
        Swal.fire("Necesitas al menos 2 registros");
        return;
    }

    const persona = "Kevin"; // luego lo hacemos dinámico

    let datos = historial.filter(r => r.persona === persona);

    const etiquetas = datos.map(r => r.fecha);
    const pesos = datos.map(r => r.peso);

    Swal.fire({
        title: `Progreso - ${persona}`,
        html: `<canvas id="graficoPeso"></canvas>`,
        width: "95%",
        background: "#0f172a",
        color: "white",
        confirmButtonColor: "#00f5a0",
        didOpen: () => {

            new Chart(document.getElementById("graficoPeso"), {
                type: 'line',
                data: {
                    labels: etiquetas,
                    datasets: [{
                        label: 'Peso (kg)',
                        data: pesos,
                        borderColor: '#00f5a0',
                        backgroundColor: 'rgba(0,245,160,0.2)',
                        tension: 0.3,
                        fill: true
                    }]
                },
                options: {
                    plugins: {
                        legend: {
                            labels: { color: "white" }
                        }
                    },
                    scales: {
                        x: { ticks: { color: "white" } },
                        y: { ticks: { color: "white" } }
                    }
                }
            });

        }
    });
}

function compararSemanas() {

    let historial = JSON.parse(localStorage.getItem("historialPeso")) || [];

    const persona = "Kevin";

    let datos = historial.filter(r => r.persona === persona);

    if (datos.length < 2) {
        Swal.fire("No hay suficientes datos");
        return;
    }

    let actual = datos[datos.length - 1].peso;
    let anterior = datos[datos.length - 2].peso;

    let diferencia = actual - anterior;

    let mensaje = diferencia < 0
        ? `Bajaste ${Math.abs(diferencia).toFixed(1)} kg esta semana 🔥`
        : diferencia > 0
            ? `Subiste ${diferencia.toFixed(1)} kg ⚠`
            : "Te mantuviste igual.";

    Swal.fire({
        title: "Comparación Semanal",
        text: mensaje,
        background: "#0f172a",
        color: "white",
        confirmButtonColor: "#00f5a0"
    });
}

function registrarPeso() {
    Swal.fire({
        title: "Registrar Peso",
        html: `
            <select id="persona" class="swal2-input">
                <option value="Kevin">Kevin</option>
                <option value="Anita">Anita</option>
            </select>
            <input type="number" id="peso" class="swal2-input" placeholder="Peso en kg">
        `,
        confirmButtonText: "Guardar",
        confirmButtonColor: "#00f5a0",
        background: "#0f172a",
        color: "white",
        preConfirm: () => {
            const persona = document.getElementById("persona").value;
            const peso = document.getElementById("peso").value;

            if (!peso) {
                Swal.showValidationMessage("Ingrese un peso válido");
                return false;
            }

            guardarPeso(persona, peso);
        }
    });
}

function guardarPeso(persona, peso) {

    const fecha = new Date().toLocaleDateString();

    const registro = {
        persona: persona,
        peso: parseFloat(peso),
        fecha: fecha
    };

    let historial = JSON.parse(localStorage.getItem("historialPeso")) || [];
    historial.push(registro);
    localStorage.setItem("historialPeso", JSON.stringify(historial));

    actualizarRacha(persona);

    Swal.fire({
        title: "Guardado",
        text: "Peso registrado correctamente",
        icon: "success",
        confirmButtonColor: "#00f5a0",
        background: "#0f172a",
        color: "white"
    });
}

function actualizarRacha(persona) {

    let historial = JSON.parse(localStorage.getItem("historialPeso")) || [];
    let datos = historial.filter(r => r.persona === persona);

    if (datos.length < 2) return;

    let actual = datos[datos.length - 1].peso;
    let anterior = datos[datos.length - 2].peso;

    let racha = parseInt(localStorage.getItem("racha_" + persona)) || 0;

    if (actual < anterior) {
        racha++;
    } else {
        racha = 0;
    }

    localStorage.setItem("racha_" + persona, racha);
}

function verRacha() {

    const persona = "Kevin";

    let racha = parseInt(localStorage.getItem("racha_" + persona)) || 0;

    Swal.fire({
        title: "🏆 Racha Actual",
        text: `${racha} semanas bajando peso consecutivas`,
        background: "#0f172a",
        color: "white",
        confirmButtonColor: "#00f5a0"
    });
}

function verHistorial() {
    let historial = JSON.parse(localStorage.getItem("historialPeso")) || [];

    if (historial.length === 0) {
        Swal.fire({
            title: "Sin registros",
            text: "Aún no hay pesos registrados.",
            background: "#0f172a",
            color: "white",
            confirmButtonColor: "#00f5a0"
        });
        return;
    }

    function generarTabla(persona) {
        let datos = historial
            .map((r, index) => ({ ...r, index }))
            .filter(r => r.persona === persona);

        if (datos.length === 0) return "<p>No hay registros</p>";

        let html = "<ul style='text-align:left;'>";

        for (let i = 0; i < datos.length; i++) {
            let diferencia = "";

            if (i > 0) {
                let diff = datos[i].peso - datos[i - 1].peso;
                diferencia = diff > 0
                    ? ` <span style="color:#ff6b6b;">(+${diff.toFixed(1)} kg)</span>`
                    : ` <span style="color:#00f5a0;">(${diff.toFixed(1)} kg)</span>`;
            }

            html += `
                <li>
                    ${datos[i].fecha} - ${datos[i].peso} kg ${diferencia}
                    <button 
                        onclick="eliminarRegistro(${datos[i].index})"
                        style="background:#ff4d4d;border:none;color:white;padding:3px 8px;border-radius:8px;margin-left:8px;">
                        X
                    </button>
                </li>
            `;
        }

        html += "</ul>";
        return html;
    }

    Swal.fire({
        title: "📊 Historial de Peso",
        html: `
            <h6>Kevin</h6>
            ${generarTabla("Kevin")}

            <hr style="border-color:white;">

            <h6>Anita</h6>
            ${generarTabla("Anita")}
        `,
        width: "95%",
        background: "#0f172a",
        color: "white",
        confirmButtonColor: "#00f5a0"
    });
}

function eliminarRegistro(index) {
    let historial = JSON.parse(localStorage.getItem("historialPeso")) || [];

    Swal.fire({
        title: "¿Eliminar registro?",
        text: "Esta acción no se puede deshacer",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ff4d4d",
        cancelButtonColor: "#00f5a0",
        confirmButtonText: "Eliminar"
    }).then((result) => {
        if (result.isConfirmed) {
            historial.splice(index, 1);
            localStorage.setItem("historialPeso", JSON.stringify(historial));
            verHistorial(); // recargar historial actualizado
        }
    });
}

function establecerMeta() {
    Swal.fire({
        title: "Establecer Meta",
        html: `
            <select id="personaMeta" class="swal2-input">
                <option value="Kevin">Kevin</option>
                <option value="Anita">Anita</option>
            </select>
            <input type="number" id="metaPeso" class="swal2-input" placeholder="Peso meta en kg">
        `,
        confirmButtonText: "Guardar Meta",
        confirmButtonColor: "#00f5a0",
        background: "#0f172a",
        color: "white",
        preConfirm: () => {
            const persona = document.getElementById("personaMeta").value;
            const meta = document.getElementById("metaPeso").value;

            if (!meta) {
                Swal.showValidationMessage("Ingrese una meta válida");
                return false;
            }

            let metas = JSON.parse(localStorage.getItem("metasPeso")) || {};
            metas[persona] = parseFloat(meta);
            localStorage.setItem("metasPeso", JSON.stringify(metas));
        }
    });
}

function verProgreso() {
    let historial = JSON.parse(localStorage.getItem("historialPeso")) || [];
    let metas = JSON.parse(localStorage.getItem("metasPeso")) || {};

    if (historial.length === 0) {
        Swal.fire("No hay registros todavía");
        return;
    }

    function calcular(persona) {
        let datos = historial.filter(r => r.persona === persona);

        if (datos.length < 1 || !metas[persona]) {
            return `<p>No hay datos suficientes para ${persona}</p>`;
        }

        let pesoInicial = datos[0].peso;
        let pesoActual = datos[datos.length - 1].peso;
        let meta = metas[persona];

        let totalBajar = pesoInicial - meta;
        let bajado = pesoInicial - pesoActual;
        let progreso = (bajado / totalBajar) * 100;

        progreso = progreso < 0 ? 0 : progreso;
        progreso = progreso > 100 ? 100 : progreso;

        return `
            <h6>${persona}</h6>
            <p>Peso inicial: ${pesoInicial} kg</p>
            <p>Peso actual: ${pesoActual} kg</p>
            <p>Meta: ${meta} kg</p>
            <p>Progreso: ${progreso.toFixed(1)}%</p>

            <div style="background:#1e293b;border-radius:10px;">
                <div style="
                    width:${progreso}%;
                    background:linear-gradient(45deg,#00f5a0,#00d9f5);
                    padding:8px;
                    border-radius:10px;
                "></div>
            </div>
            <hr>
        `;
    }

    Swal.fire({
        title: "🎯 Progreso",
        html: `
            ${calcular("Kevin")}
            ${calcular("Anita")}
        `,
        width: "95%",
        background: "#0f172a",
        color: "white",
        confirmButtonColor: "#00f5a0"
    });
}