let datosGlobal = null;

document.addEventListener("DOMContentLoaded", () => {
    fetch("data/recetas.json")
        .then(res => res.json())
        .then(data => {
            datosGlobal = data;
            renderizarSemana(data);
        })
        .catch(err => {
            console.error("Error cargando JSON:", err);
        });
});

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

function crearBloque(dia, tipo) {
    if (!datosGlobal[dia][tipo]) return "";

    return `
        <div class="mt-3">
            <strong>${tipo.toUpperCase()}:</strong>
            ${datosGlobal[dia][tipo].titulo}
            <br>
            <button class="btn btn-fit btn-sm mt-2"
                onclick="mostrarReceta('${dia}','${tipo}')">
                Ver Receta
            </button>
        </div>
    `;
}
function mostrarReceta(dia, tipo) {
    const receta = datosGlobal[dia][tipo];

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
    if (!datosGlobal) return;

    let ingredientes = [];

    for (let dia in datosGlobal) {
        ["desayuno", "almuerzo", "merienda"].forEach(tipo => {
            if (datosGlobal[dia][tipo]) {
                ingredientes = ingredientes.concat(datosGlobal[dia][tipo].ingredientes);
            }
        });
    }

    const listaUnica = [...new Set(ingredientes)];

    Swal.fire({
        title: "🛒 Lista de Compras",
        html: `
            <ul style="text-align:left;">
                ${listaUnica.map(i => `<li>${i}</li>`).join("")}
            </ul>
        `,
        background: "#0f172a",
        color: "white",
        confirmButtonColor: "#00f5a0",
        width: "95%"
    });
}