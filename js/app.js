
// Obtener los elementos del formulario
const formulario = document.getElementById("formIncidencia");
const listaIncidencias = document.getElementById("listaIncidencias");
const mensaje = document.getElementById("mensaje");

// Recuperar las incidencias almacenadas
let incidencias = JSON.parse(
    localStorage.getItem("incidencias")
) || [];

// Registrar una nueva incidencia
formulario.addEventListener("submit", function (event) {

    event.preventDefault();

    const titulo = document.getElementById("titulo").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const categoria = document.getElementById("categoria").value;
    const prioridad = document.getElementById("prioridad").value;
    const estado = document.getElementById("estado").value;

    // Validar los campos obligatorios
    if (!titulo || !descripcion || !categoria || !prioridad || !estado) {
        mensaje.textContent = "Complete todos los campos.";
        mensaje.style.color = "#dc2626";
        return;
    }

    // Crear una nueva incidencia
    const nuevaIncidencia = {
        id: incidencias.length + 1,
        titulo: titulo,
        descripcion: descripcion,
        categoria: categoria,
        prioridad: prioridad,
        estado: estado
    };

    // Agregar la incidencia al arreglo
    incidencias.push(nuevaIncidencia);

    // Almacenar los registros en el navegador
    localStorage.setItem(
        "incidencias",
        JSON.stringify(incidencias)
    );

    // Actualizar la tabla
    mostrarIncidencias();

    // Limpiar los campos del formulario
    formulario.reset();

    // Mostrar mensaje de confirmación
    mensaje.textContent = "Incidencia registrada correctamente.";
    mensaje.style.color = "#16a34a";
});

// Función para crear las celdas de la tabla
function crearCelda(texto) {
    const celda = document.createElement("td");
    celda.textContent = texto;
    return celda;
}

// Función para mostrar las incidencias
function mostrarIncidencias() {

    listaIncidencias.replaceChildren();

    // Comprobar si existen registros
    if (incidencias.length === 0) {

        const fila = document.createElement("tr");
        const celda = crearCelda(
            "No hay incidencias registradas."
        );

        celda.colSpan = 6;
        celda.className = "sin-registros";

        fila.appendChild(celda);
        listaIncidencias.appendChild(fila);

        return;
    }

    // Recorrer las incidencias almacenadas
    incidencias.forEach(function (incidencia) {

        const fila = document.createElement("tr");

        fila.appendChild(crearCelda(incidencia.id));
        fila.appendChild(crearCelda(incidencia.titulo));
        fila.appendChild(crearCelda(incidencia.descripcion));
        fila.appendChild(crearCelda(incidencia.categoria));

        // Mostrar la prioridad con un color
        const celdaPrioridad = document.createElement("td");
        const etiquetaPrioridad = document.createElement("span");

        etiquetaPrioridad.className =
            "prioridad " + incidencia.prioridad.toLowerCase();

        etiquetaPrioridad.textContent = incidencia.prioridad;

        celdaPrioridad.appendChild(etiquetaPrioridad);
        fila.appendChild(celdaPrioridad);

        // Mostrar el estado con un color
        const celdaEstado = document.createElement("td");
        const etiquetaEstado = document.createElement("span");

        etiquetaEstado.className =
            "estado " + incidencia.estado.toLowerCase().replace(" ", "-");

        etiquetaEstado.textContent = incidencia.estado;

        celdaEstado.appendChild(etiquetaEstado);
        fila.appendChild(celdaEstado);

        // Agregar la fila a la tabla
        listaIncidencias.appendChild(fila);

    });
}

// Mostrar los registros al cargar la página
mostrarIncidencias();
