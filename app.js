const form = document.getElementById('gastoForm');
const listaGastos = document.getElementById('listaGastos');
const totalElemento = document.getElementById('total');

// === LÓGICA PARA ESTABLECER LA FECHA DEL DÍA ACTUAL ===
function establecerFechaActual() {
  const hoy = new Date();
  const anio = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0'); 
  const dia = String(hoy.getDate()).padStart(2, '0');
  
  const fechaHoy = `${anio}-${mes}-${dia}`;
  
  document.getElementById('fecha').value = fechaHoy;
}

// Ejecutamos la función para establecer la fecha actual al cargar
establecerFechaActual(); 

// Cargar gastos guardados al iniciar
let gastos = JSON.parse(localStorage.getItem('gastos')) || [];
renderizarGastos();

// Mover el foco al campo Concepto al cargar la app
document.getElementById('concepto').focus();

form.addEventListener('submit', e => {
  e.preventDefault();

  const concepto = document.getElementById('concepto').value;
  const importe = parseFloat(document.getElementById('importe').value);
  // CAMBIO: Se eliminó la obtención de categoría
  const fecha = document.getElementById('fecha').value;

  // CAMBIO: El objeto gasto ya no incluye 'categoria'
  const gasto = { id: Date.now(), concepto, importe, fecha };
  
  gastos.push(gasto);
  guardarGastos();
  renderizarGastos();

  form.reset();
  // Después de agregar, volvemos a establecer la fecha actual y el foco
  establecerFechaActual(); 
  document.getElementById('concepto').focus();
});

function renderizarGastos() {
  listaGastos.innerHTML = '';
  let total = 0;

  gastos.forEach(gasto => {
    total += gasto.importe;
    
    const fila = document.createElement('tr');
    // CAMBIO: Reordenación de celdas (Fecha, Concepto, Importe, Acciones)
    fila.innerHTML = `
      <td>${gasto.fecha}</td>
      <td>${gasto.concepto}</td>
      <td>${gasto.importe.toFixed(2)} €</td>
      <td><button onclick="eliminarGasto(${gasto.id})">🗑️</button></td>
    `;
    listaGastos.appendChild(fila);
  });

  totalElemento.textContent = total.toFixed(2);
}

function eliminarGasto(id) {
  gastos = gastos.filter(g => g.id !== id);
  guardarGastos();
  renderizarGastos();
}

function guardarGastos() {
  localStorage.setItem('gastos', JSON.stringify(gastos));
}

// Exportar gastos a CSV
document.getElementById('exportarCSV').addEventListener('click', () => {
  if (gastos.length === 0) {
    alert('No hay gastos para exportar.');
    return;
  }

  // Crear contenido CSV
  // CAMBIO: Eliminada 'Categoría' del encabezado
  const encabezado = ['Concepto', 'Importe (€)', 'Fecha'];
  
  // CAMBIO: Eliminada g.categoria de las filas
  const filas = gastos.map(g => [g.concepto, g.importe, g.fecha]); 
  
  const csvContent = [encabezado, ...filas]
    .map(fila => fila.map(v => `"${v}"`).join(','))
    .join('\n');

  // Crear archivo y forzar descarga
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = 'gastos.csv';
  enlace.click();
  URL.revokeObjectURL(url);
});
