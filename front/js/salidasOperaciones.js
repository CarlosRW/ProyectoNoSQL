let salidaIdEdicion = null;
let catalogoEmbarcaciones = [];

$(document).ready(function () {
    configurarFormularioInicial();

    cargarCatalogos(function () {
        cargarSalidas();
    });

    $("#embarcacion_id").on(
        "change",
        function () {
            actualizarDatosOcupacion();
        }
    );

    $("#pasajeros_confirmados").on(
        "input",
        function () {
            actualizarDatosOcupacion();
        }
    );

    $("#formSalidaOperacion").on(
        "submit",
        function (e) {
            e.preventDefault();

            const capacidad =
                obtenerCapacidadSeleccionada();

            const pasajeros = Number(
                $("#pasajeros_confirmados").val()
            );

            if (!capacidad) {
                return mostrarAlerta(
                    "danger",
                    "Debes seleccionar una embarcación operativa."
                );
            }

            if (pasajeros > capacidad) {
                return mostrarAlerta(
                    "danger",
                    `La embarcación admite un máximo de ${capacidad} pasajeros.`
                );
            }

            const salida = {
                tour_id:
                    $("#tour_id").val(),

                embarcacion_id:
                    $("#embarcacion_id").val(),

                capitan_id:
                    $("#capitan_id").val(),

                guia_id:
                    $("#guia_id").val(),

                fecha_salida:
                    $("#fecha_salida").val(),

                pasajeros_confirmados:
                    pasajeros
            };

            if (salidaIdEdicion) {
                actualizarSalidaOperacion(
                    salidaIdEdicion,
                    salida,
                    function (error) {
                        if (error) {
                            return mostrarAlerta(
                                "danger",
                                obtenerMensajeError(
                                    error,
                                    "Error al actualizar la salida."
                                )
                            );
                        }

                        mostrarAlerta(
                            "success",
                            "Salida actualizada correctamente."
                        );

                        resetFormulario();
                        cargarSalidas();
                    }
                );
            } else {
                crearSalidaOperacion(
                    salida,
                    function (error) {
                        if (error) {
                            return mostrarAlerta(
                                "danger",
                                obtenerMensajeError(
                                    error,
                                    "Error al crear la salida."
                                )
                            );
                        }

                        mostrarAlerta(
                            "success",
                            "Salida registrada correctamente."
                        );

                        resetFormulario();
                        cargarSalidas();
                    }
                );
            }
        }
    );

    $("#btnCancelar").on(
        "click",
        resetFormulario
    );
});

function configurarFormularioInicial() {
    $("#fecha_salida").val(
        obtenerFechaHoraActual()
    );

    $("#pasajeros_confirmados").val(1);

    actualizarDatosOcupacion();
}

function cargarCatalogos(callback) {
    let consultasPendientes = 3;

    function finalizarConsulta() {
        consultasPendientes -= 1;

        if (consultasPendientes === 0) {
            callback();
        }
    }

    obtenerToursParaSalida(
        function (error, tours) {
            if (error) {
                mostrarAlerta(
                    "danger",
                    "No se pudo cargar la lista de tours."
                );
            } else {
                llenarSelectTours(
                    Array.isArray(tours)
                        ? tours
                        : []
                );
            }

            finalizarConsulta();
        }
    );

    obtenerEmbarcacionesParaSalida(
        function (error, embarcaciones) {
            if (error) {
                mostrarAlerta(
                    "danger",
                    "No se pudo cargar la lista de embarcaciones."
                );
            } else {
                catalogoEmbarcaciones =
                    Array.isArray(embarcaciones)
                        ? embarcaciones
                        : [];

                llenarSelectEmbarcaciones(
                    catalogoEmbarcaciones
                );
            }

            finalizarConsulta();
        }
    );

    obtenerPersonalParaSalida(
        function (error, personal) {
            if (error) {
                mostrarAlerta(
                    "danger",
                    "No se pudo cargar la lista del personal."
                );
            } else {
                const listaPersonal =
                    Array.isArray(personal)
                        ? personal
                        : [];

                llenarSelectCapitanes(
                    listaPersonal
                );

                llenarSelectGuias(
                    listaPersonal
                );
            }

            finalizarConsulta();
        }
    );
}

function llenarSelectTours(tours) {
    const select = $("#tour_id");

    select.html(`
    <option value="" selected disabled>
      Seleccione un tour
    </option>
  `);

    tours.forEach(function (tour) {
        const estado =
            tour.activo === false
                ? " (Inactivo)"
                : "";

        select.append(`
      <option value="${tour._id}">
        ${tour.nombre_tour}${estado}
      </option>
    `);
    });
}

function llenarSelectEmbarcaciones(
    embarcaciones
) {
    const select = $("#embarcacion_id");

    select.html(`
    <option value="" selected disabled>
      Seleccione una embarcación
    </option>
  `);

    const embarcacionesOperativas =
        embarcaciones.filter(
            function (embarcacion) {
                return (
                    normalizarTexto(
                        embarcacion.estado
                    ) === "operativa"
                );
            }
        );

    embarcacionesOperativas.forEach(
        function (embarcacion) {
            select.append(`
        <option value="${embarcacion._id}">
          ${embarcacion.nombre} -
          ${embarcacion.capacidad_maxima} pasajeros
        </option>
      `);
        }
    );
}

function llenarSelectCapitanes(personal) {
    const select = $("#capitan_id");

    select.html(`
    <option value="" selected disabled>
      Seleccione un capitán
    </option>
  `);

    const capitanes = personal.filter(
        function (persona) {
            return normalizarTexto(
                persona.puesto
            ).includes("capitan");
        }
    );

    capitanes.forEach(function (persona) {
        select.append(`
      <option value="${persona._id}">
        ${persona.nombre}
      </option>
    `);
    });
}

function llenarSelectGuias(personal) {
    const select = $("#guia_id");

    select.html(`
    <option value="" selected disabled>
      Seleccione un guía
    </option>
  `);

    const guias = personal.filter(
        function (persona) {
            return normalizarTexto(
                persona.puesto
            ).includes("guia");
        }
    );

    guias.forEach(function (persona) {
        select.append(`
      <option value="${persona._id}">
        ${persona.nombre}
      </option>
    `);
    });
}

function cargarSalidas() {
    obtenerSalidasOperaciones(
        function (error, salidas) {
            if (error) {
                return mostrarAlerta(
                    "danger",
                    "No se pudo cargar la lista de salidas."
                );
            }

            dibujarTabla(
                Array.isArray(salidas)
                    ? salidas
                    : []
            );
        }
    );
}

function dibujarTabla(salidas) {
    const tabla =
        $("#tablaSalidasOperaciones");

    tabla.empty();

    if (salidas.length === 0) {
        tabla.append(`
      <tr>
        <td
          colspan="8"
          class="text-center text-muted">

          No hay salidas registradas
        </td>
      </tr>
    `);

        return;
    }

    salidas.forEach(function (salida) {
        const nombreTour =
            salida.tour_id?.nombre_tour ||
            "Tour no disponible";

        const nombreEmbarcacion =
            salida.embarcacion_id?.nombre ||
            "Embarcación no disponible";

        const nombreCapitan =
            salida.capitan_id?.nombre ||
            "Capitán no disponible";

        const nombreGuia =
            salida.guia_id?.nombre ||
            "Guía no disponible";

        const ocupacion =
            crearBadgeOcupacion(
                salida.tasa_ocupacion
            );

        const fila = `
      <tr>
        <td>${nombreTour}</td>

        <td>${nombreEmbarcacion}</td>

        <td>${nombreCapitan}</td>

        <td>${nombreGuia}</td>

        <td>
          ${formatearFechaHora(
            salida.fecha_salida
        )}
        </td>

        <td>
          ${salida.pasajeros_confirmados}
          /
          ${salida.capacidad_embarcacion}
        </td>

        <td>${ocupacion}</td>

        <td class="text-end">
          <button
            type="button"
            class="btn btn-sm btn-outline-secondary me-1 btn-editar"
            data-id="${salida._id}"
            title="Editar salida">

            <i class="bi bi-pencil"></i>
          </button>

          <button
            type="button"
            class="btn btn-sm btn-outline-danger btn-eliminar"
            data-id="${salida._id}"
            title="Eliminar salida">

            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>
    `;

        tabla.append(fila);
    });

    $(".btn-editar").on(
        "click",
        function () {
            const id = $(this).data("id");

            const salida = salidas.find(
                function (registro) {
                    return registro._id === id;
                }
            );

            if (!salida) {
                return mostrarAlerta(
                    "danger",
                    "No se encontró la salida seleccionada."
                );
            }

            cargarFormulario(salida);
        }
    );

    $(".btn-eliminar").on(
        "click",
        function () {
            const id = $(this).data("id");

            const confirmar = confirm(
                "¿Seguro que deseas eliminar esta salida?"
            );

            if (!confirmar) {
                return;
            }

            eliminarSalidaOperacion(
                id,
                function (error) {
                    if (error) {
                        return mostrarAlerta(
                            "danger",
                            "Error al eliminar la salida."
                        );
                    }

                    mostrarAlerta(
                        "success",
                        "Salida eliminada correctamente."
                    );

                    if (
                        salidaIdEdicion === id
                    ) {
                        resetFormulario();
                    }

                    cargarSalidas();
                }
            );
        }
    );
}

function cargarFormulario(salida) {
    salidaIdEdicion = salida._id;

    $("#tour_id").val(
        obtenerIdReferencia(
            salida.tour_id
        )
    );

    $("#embarcacion_id").val(
        obtenerIdReferencia(
            salida.embarcacion_id
        )
    );

    $("#capitan_id").val(
        obtenerIdReferencia(
            salida.capitan_id
        )
    );

    $("#guia_id").val(
        obtenerIdReferencia(
            salida.guia_id
        )
    );

    $("#fecha_salida").val(
        fechaHoraParaInput(
            salida.fecha_salida
        )
    );

    $("#pasajeros_confirmados").val(
        salida.pasajeros_confirmados
    );

    actualizarDatosOcupacion();

    $("#tituloFormulario").text(
        "Editar salida"
    );

    $("#btnGuardar").text(
        "Actualizar"
    );

    $("#btnCancelar").removeClass(
        "d-none"
    );
}

function resetFormulario() {
    salidaIdEdicion = null;

    $("#formSalidaOperacion")[0].reset();

    $("#fecha_salida").val(
        obtenerFechaHoraActual()
    );

    $("#pasajeros_confirmados").val(1);

    actualizarDatosOcupacion();

    $("#tituloFormulario").text(
        "Nueva salida"
    );

    $("#btnGuardar").text(
        "Guardar"
    );

    $("#btnCancelar").addClass(
        "d-none"
    );
}

function actualizarDatosOcupacion() {
    const capacidad =
        obtenerCapacidadSeleccionada();

    const pasajeros = Number(
        $("#pasajeros_confirmados").val()
    ) || 0;

    $("#capacidad_embarcacion").val(
        capacidad
            ? `${capacidad} pasajeros`
            : ""
    );

    const tasa =
        capacidad > 0
            ? pasajeros / capacidad
            : 0;

    $("#tasa_ocupacion").val(
        capacidad
            ? `${(tasa * 100).toFixed(1)}%`
            : ""
    );

    const superaCapacidad =
        capacidad > 0 &&
        pasajeros > capacidad;

    $("#pasajeros_confirmados").toggleClass(
        "is-invalid",
        superaCapacidad
    );

    $("#mensajeCapacidad").toggleClass(
        "d-none",
        !superaCapacidad
    );
}

function obtenerCapacidadSeleccionada() {
    const embarcacionId =
        $("#embarcacion_id").val();

    const embarcacion =
        catalogoEmbarcaciones.find(
            function (registro) {
                return (
                    registro._id ===
                    embarcacionId
                );
            }
        );

    return embarcacion
        ? Number(
            embarcacion.capacidad_maxima
        )
        : 0;
}

function obtenerIdReferencia(
    referencia
) {
    if (!referencia) {
        return "";
    }

    if (
        typeof referencia === "object"
    ) {
        return referencia._id || "";
    }

    return referencia;
}

function normalizarTexto(texto) {
    return String(texto || "")
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .toLowerCase()
        .trim();
}

function obtenerFechaHoraActual() {
    const fecha = new Date();

    const fechaLocal = new Date(
        fecha.getTime() -
        fecha.getTimezoneOffset() *
        60000
    );

    return fechaLocal
        .toISOString()
        .slice(0, 16);
}

function fechaHoraParaInput(fecha) {
    if (!fecha) {
        return "";
    }

    const fechaObjeto =
        new Date(fecha);

    const fechaLocal = new Date(
        fechaObjeto.getTime() -
        fechaObjeto.getTimezoneOffset() *
        60000
    );

    return fechaLocal
        .toISOString()
        .slice(0, 16);
}

function formatearFechaHora(fecha) {
    if (!fecha) {
        return "—";
    }

    return new Date(fecha)
        .toLocaleString(
            "es-CR",
            {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit"
            }
        );
}

function crearBadgeOcupacion(tasa) {
    const porcentaje =
        Number(tasa || 0) * 100;

    let clase = "bg-danger";

    if (porcentaje >= 75) {
        clase = "bg-success";
    } else if (porcentaje >= 50) {
        clase =
            "bg-warning text-dark";
    }

    return `
    <span class="badge ${clase}">
      ${porcentaje.toFixed(1)}%
    </span>
  `;
}

function obtenerMensajeError(
    error,
    mensajePredeterminado
) {
    const mensajeApi =
        error.responseJSON?.mensaje;

    const detalleApi =
        error.responseJSON?.error;

    if (detalleApi) {
        return `${mensajeApi ||
            mensajePredeterminado
            }: ${detalleApi}`;
    }

    return (
        mensajeApi ||
        mensajePredeterminado
    );
}

function mostrarAlerta(tipo, mensaje) {
    const alerta = `
    <div
      class="alert alert-${tipo} alert-dismissible fade show"
      role="alert">

      ${mensaje}

      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="alert"
        aria-label="Cerrar">
      </button>
    </div>
  `;

    $("#zonaAlertas").html(alerta);

    setTimeout(function () {
        const elementoAlerta =
            document.querySelector(
                "#zonaAlertas .alert"
            );

        if (elementoAlerta) {
            bootstrap.Alert
                .getOrCreateInstance(
                    elementoAlerta
                )
                .close();
        }
    }, 3000);
}