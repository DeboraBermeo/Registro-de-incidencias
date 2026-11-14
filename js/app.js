
// Obtener los elementos del formulario
const formulario = document.getElementById("formIncidencia");
const listaIncidencias = document.getElementById("listaIncidencias");
const mensaje = document.getElementById("mensaje");
const buscarTitulo = document.getElementById("buscarTitulo");
const filtroEstado = document.getElementById("filtroEstado");

function leerIncidencias() {
    const registros = localStorage.getItem("incidencias");
    if (registros === null) {
        return { incidencias: [], error: null };
    }

    try {
        const incidencias = JSON.parse(registros);
        if (!Array.isArray(incidencias)) {
            return {
                incidencias: null,
                error: new TypeError("El contenido guardado no es una lista.")
            };
        }

        return { incidencias: incidencias, error: null };
    } catch (error) {
        if (!(error instanceof SyntaxError)) {
            throw error;
        }

        return { incidencias: null, error: error };
    }
}

function mostrarErrorAlmacenamiento(error) {
    console.error(
        "No se pudieron leer las incidencias del almacenamiento local.",
        error
    );

    const fila = document.createElement("tr");
    const celda = crearCelda(
        "No se pudieron cargar las incidencias. Revise los datos guardados en este navegador."
    );
    celda.colSpan = 6;
    celda.className = "sin-registros";
    fila.appendChild(celda);
    listaIncidencias.replaceChildren(fila);

    mensaje.textContent =
        "Error al leer las incidencias guardadas. Los datos no fueron modificados.";
    mensaje.style.color = "#dc2626";
}

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

    const resultado = leerIncidencias();
    if (resultado.error) {
        mostrarErrorAlmacenamiento(resultado.error);
        return;
    }
    const incidencias = resultado.incidencias;

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

    // Limpiar los campos del formulario
    formulario.reset();
    buscarTitulo.value = "";
    filtroEstado.value = "";

    // Actualizar la tabla
    mostrarIncidencias();

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

function normalizar(valor) {
    return String(valor == null ? "" : valor)
        .trim()
        .toLocaleLowerCase("es");
}

// Función para mostrar las incidencias
function mostrarIncidencias() {

    const resultado = leerIncidencias();
    if (resultado.error) {
        mostrarErrorAlmacenamiento(resultado.error);
        return;
    }
    const incidencias = resultado.incidencias;
    const tituloBuscado = normalizar(buscarTitulo.value);
    const estadoBuscado = normalizar(filtroEstado.value);
    const incidenciasFiltradas = incidencias.filter(function (incidencia) {
        return normalizar(incidencia.titulo).includes(tituloBuscado) &&
            (!estadoBuscado || normalizar(incidencia.estado) === estadoBuscado);
    });

    listaIncidencias.replaceChildren();

    // Comprobar si existen resultados para los filtros actuales
    if (incidenciasFiltradas.length === 0) {

        const fila = document.createElement("tr");
        const celda = crearCelda(
            incidencias.length === 0
                ? "No hay incidencias registradas."
                : "No se encontraron incidencias con esos filtros."
        );

        celda.colSpan = 6;
        celda.className = "sin-registros";

        fila.appendChild(celda);
        listaIncidencias.appendChild(fila);

        return;
    }

    // Recorrer las incidencias que coinciden con los filtros
    incidenciasFiltradas.forEach(function (incidencia) {

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

buscarTitulo.addEventListener("input", mostrarIncidencias);
filtroEstado.addEventListener("change", mostrarIncidencias);
window.addEventListener("storage", mostrarIncidencias);

// Mostrar los registros al cargar la página
mostrarIncidencias();
