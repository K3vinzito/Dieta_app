const plan = {
  lunes: {
    desayuno: {
      titulo: "Huevos con Avena",
      ingredientes: ["2 huevos", "½ taza avena", "1 manzana"],
      receta: "Cocina los huevos sin aceite. Hierve la avena con agua 5 minutos."
    },
    almuerzo: {
      titulo: "Pollo con Ensalada",
      ingredientes: ["Pollo", "Lechuga", "Tomate", "½ taza arroz"],
      receta: "Asa el pollo. Acompaña con ensalada fresca y arroz controlado."
    },
    merienda: {
      titulo: "Yogurt y Nueces",
      ingredientes: ["Yogurt natural", "Nueces"],
      receta: "Mezclar y consumir frío."
    }
  }
};

function cargarPlan() {
  const cont = document.getElementById("contenido");

  for (let dia in plan) {
    cont.innerHTML += `
      <div class="card mb-3 p-3">
        <h5 class="text-capitalize">${dia}</h5>
        ${crearComida(plan[dia].desayuno)}
        ${crearComida(plan[dia].almuerzo)}
        ${crearComida(plan[dia].merienda)}
      </div>
    `;
  }
}

function crearComida(comida) {
  return `
    <div class="mt-2">
      <strong>${comida.titulo}</strong><br>
      <button class="btn btn-sm btn-fit mt-1"
      onclick="verReceta('${comida.titulo}','${comida.receta}')">
      Ver Receta
      </button>
    </div>
  `;
}

function verReceta(titulo, receta) {
  Swal.fire({
    title: titulo,
    text: receta,
    confirmButtonColor: '#00f5a0',
    background: '#1e293b',
    color: 'white'
  });
}

function verLista() {
  Swal.fire({
    title: "Lista de Compras",
    html: `
      <ul style="text-align:left">
      <li>Huevos (30)</li>
      <li>Pollo (2kg)</li>
      <li>Avena</li>
      <li>Lechuga</li>
      <li>Tomate</li>
      <li>Yogurt</li>
      </ul>
    `,
    confirmButtonColor: '#00f5a0',
    background: '#1e293b',
    color: 'white'
  });
}

cargarPlan();