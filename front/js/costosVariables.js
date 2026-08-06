let costoVariableIdEdicion = null;

$(document).ready(function () {
    configurarFormularioInicial();

    cargarSalidas(function () {
        cargarCostosVariables();
    });

    $("#formCostoVariable").on("submit", function (e) {
        e.preventDefault();

        const costoVariable = {
            tipo_costo: $("#tipo_costo").val(),
            salida_id: $("#salida_id").val(),
            monto: Number($("#monto").val()),
            moneda: $("#moneda").val(),
            fecha: $("#fecha").val(),
            responsable_registro: $("#responsable_registro").val().trim()
        };

        if (costoVariableIdEdicion) {
            actualizarCostoVariable(
                costoVariableIdEdicion,
                costoVariable,
                function (error) {
                    if (error) {
                        return mostrarAlerta(
                            "danger",
                            obtenerMensajeError(
                                error,
                                "Error al actualizar el costo variable."
                            )
                        );
                    }

                    mostrarAlerta(
                        "success",
                        "Costo variable actualizado correctamente."
                    );

                    resetFormulario();
                    cargarCostosVariables();
                }
            );
        } else {
            crearCostoVariable(costoVariable, function (error) {
                if (error) {
                    return mostrarAlerta(
                        "danger",
                        obtenerMensajeError(
                            error,
                            "Error al crear el costo variable."
                        )
                    );
                }

                mostrarAlerta(
                    "success",
                    "Costo variable creado correctamente."
                );

                resetFormulario();
                cargarCostosVariables();
            });
        }
    });

    $("#btnCancelar").on("click", resetFormulario);
});

function configurarFormularioInicial() {
    $("#fecha").val(obtenerFechaActual());
    $("#moneda").val("CRC");
}

function cargarSalidas(callback) {
    obtenerSalidasParaCosto(function (error, salidas) {
        if (error) {
            mostrarAlerta("danger", "No se pudo cargar la lista de salidas y operaciones.");
        } else {
            llenarSelectSalidas(salidas);
        }

        callback();
    });
}

function llenarSelectSalidas(salidas) {
    const select = $("#salida_id");

    select.html(`<option value="" selected disabled>Seleccione una salida</option>`);

    salidas.forEach(function (salida) {
        select.append(`<option value="${salida._id}">${etiquetaSalida(salida)}</option>`);
    });
}

function etiquetaSalida(salida) {
    const nombreTour = salida.tour_id?.nombre_tour || "Tour no disponible";
    const fecha = formatearFecha(salida.fecha_salida);

    return `${nombreTour} - ${fecha}`;
}

function cargarCostosVariables() {
    obtenerCostosVariables(function (error, costosVariables) {
        if (error) {
            return mostrarAlerta(
                "danger",
                "No se pudo cargar la lista de costos variables."
            );
        }

        const listaCostosVariables = Array.isArray(costosVariables)
            ? costosVariables
            : [];

        dibujarTabla(listaCostosVariables);
    });
}

function dibujarTabla(costosVariables) {
    const tabla = $("#tablaCostosVariables");
    tabla.empty();

    if (costosVariables.length === 0) {
        tabla.append(`<tr><td colspan="6" class="text-center text-muted">No hay costos variables registrados</td></tr>`);
        return;
    }

    costosVariables.forEach(function (costo) {
        const monto = formatearMoneda(costo.monto, costo.moneda);
        const fecha = formatearFecha(costo.fecha);
        const salida = costo.salida_id?.tour_id?.nombre_tour
            ? `${costo.salida_id.tour_id.nombre_tour} - ${formatearFecha(costo.salida_id.fecha_salida)}`
            : "Salida no disponible";

        const fila = `
      <tr>
        <td>${formatearTipoCosto(costo.tipo_costo)}</td>
        <td>${salida}</td>
        <td>${monto}</td>
        <td>${fecha}</td>
        <td>${costo.responsable_registro}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-secondary me-1 btn-editar" data-id="${costo._id}"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-sm btn-outline-danger btn-eliminar" data-id="${costo._id}"><i class="bi bi-trash"></i></button>
        </td>
      </tr>`;
        tabla.append(fila);
    });

    $(".btn-editar").on("click", function () {
        const id = $(this).data("id");
        const costo = costosVariables.find(c => c._id === id);
        cargarFormulario(costo);
    });

    $(".btn-eliminar").on("click", function () {
        const id = $(this).data("id");
        if (confirm("¿Seguro que quieres eliminar este costo variable?")) {
            eliminarCostoVariable(id, function (error) {
                if (error) return mostrarAlerta("danger", "Error al eliminar el costo variable.");
                mostrarAlerta("success", "Costo variable eliminado.");
                cargarCostosVariables();
            });
        }
    });
}

function cargarFormulario(costoVariable) {
    costoVariableIdEdicion = costoVariable._id;
    $("#tipo_costo").val(costoVariable.tipo_costo);
    $("#salida_id").val(obtenerIdReferencia(costoVariable.salida_id));
    $("#monto").val(costoVariable.monto);
    $("#moneda").val(costoVariable.moneda);
    $("#fecha").val(fechaParaInput(costoVariable.fecha));
    $("#responsable_registro").val(costoVariable.responsable_registro);
    $("#tituloFormulario").text("Editar costo variable");
    $("#btnGuardar").text("Actualizar");
    $("#btnCancelar").removeClass("d-none");
}

function resetFormulario() {
    costoVariableIdEdicion = null;
    $("#formCostoVariable")[0].reset();
    configurarFormularioInicial();
    $("#tituloFormulario").text("Nuevo costo variable");
    $("#btnGuardar").text("Guardar");
    $("#btnCancelar").addClass("d-none");
}

function obtenerIdReferencia(referencia) {
    if (!referencia) return "";
    if (typeof referencia === "object") return referencia._id || "";
    return referencia;
}

function formatearTipoCosto(tipoCosto) {
    const tipos = {
        combustible: "Combustible",
        mantenimiento: "Mantenimiento",
        insumos: "Insumos",
        personal_temporal: "Personal temporal",
        comisiones_terceros: "Comisiones a terceros",
        otros: "Otros"
    };

    return tipos[tipoCosto] || tipoCosto;
}

function formatearMoneda(valor, moneda) {
    const codigoMoneda = moneda === "CRC" ? "CRC" : "USD";
    const configuracionRegional = codigoMoneda === "CRC" ? "es-CR" : "en-US";

    return Number(valor).toLocaleString(configuracionRegional, {
        style: "currency",
        currency: codigoMoneda,
        minimumFractionDigits: codigoMoneda === "CRC" ? 0 : 2,
        maximumFractionDigits: codigoMoneda === "CRC" ? 0 : 2
    });
}

function fechaParaInput(fecha) {
    if (!fecha) return "";
    return String(fecha).split("T")[0];
}

function formatearFecha(fecha) {
    if (!fecha) return "—";

    const fechaSinHora = String(fecha).split("T")[0];
    const partes = fechaSinHora.split("-");

    if (partes.length !== 3) return fecha;

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function obtenerFechaActual() {
    const fecha = new Date();
    const fechaLocal = new Date(fecha.getTime() - fecha.getTimezoneOffset() * 60000);
    return fechaLocal.toISOString().split("T")[0];
}

function obtenerMensajeError(error, mensajePredeterminado) {
    const mensajeApi = error.responseJSON?.mensaje;
    const detalleApi = error.responseJSON?.error;

    if (detalleApi) {
        return `${mensajeApi || mensajePredeterminado}: ${detalleApi}`;
    }

    return mensajeApi || mensajePredeterminado;
}

function mostrarAlerta(tipo, mensaje) {
    const alerta = `
    <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
      ${mensaje}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>`;
    $("#zonaAlertas").html(alerta);
    setTimeout(() => $("#zonaAlertas .alert").alert('close'), 3000);
}
