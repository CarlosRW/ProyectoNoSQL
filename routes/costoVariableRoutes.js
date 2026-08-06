let costoVariableIdEdicion = null;

$(document).ready(function () {
    configurarFormularioInicial();
    cargarCostosVariables();

    $("#formCostoVariable").on("submit", function (e) {
        e.preventDefault();

        const costoVariable = {
            concepto: $("#concepto").val().trim(),
            categoria: $("#categoria").val(),
            monto: Number($("#monto").val()),
            moneda: $("#moneda").val(),
            descripcion: $("#descripcion").val().trim(),
            estado: $("#estado").val(),
            fecha_registro: $("#fecha_registro").val()
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
    $("#fecha_registro").val(obtenerFechaActual());
    $("#moneda").val("USD");
    $("#estado").val("pendiente");
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
        tabla.append(`<tr><td colspan="7" class="text-center text-muted">No hay costos variables registrados</td></tr>`);
        return;
    }

    costosVariables.forEach(function (costo) {
        const badge = crearBadgeEstado(costo.estado);
        const monto = formatearMoneda(costo.monto, costo.moneda);
        const fecha = formatearFecha(costo.fecha_registro);

        const fila = `
      <tr>
        <td>${costo.concepto}</td>
        <td>${formatearCategoria(costo.categoria)}</td>
        <td>${monto}</td>
        <td>${costo.descripcion || '—'}</td>
        <td>${fecha}</td>
        <td>${badge}</td>
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
    $("#concepto").val(costoVariable.concepto);
    $("#categoria").val(costoVariable.categoria);
    $("#monto").val(costoVariable.monto);
    $("#moneda").val(costoVariable.moneda);
    $("#descripcion").val(costoVariable.descripcion);
    $("#estado").val(costoVariable.estado);
    $("#fecha_registro").val(fechaParaInput(costoVariable.fecha_registro));
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

function formatearCategoria(categoria) {
    const categorias = {
        combustible: "Combustible",
        mantenimiento: "Mantenimiento",
        insumos: "Insumos",
        personal_temporal: "Personal temporal",
        comisiones_terceros: "Comisiones a terceros",
        otros: "Otros"
    };

    return categorias[categoria] || categoria;
}

function crearBadgeEstado(estado) {
    const clase = estado === "pagado" ? "badge-activo" : "badge-inactivo";
    const texto = estado === "pagado" ? "Pagado" : "Pendiente";

    return `<span class="badge ${clase}">${texto}</span>`;
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