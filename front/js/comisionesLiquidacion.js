let comisionIdEdicion = null;

$(document).ready(function () {
    configurarFormularioInicial();

    cargarCatalogos(function () {
        cargarComisiones();
    });

    $("#estado").on("change", function () {
        actualizarCampoFechaLiquidada();
    });

    $("#formComision").on("submit", function (e) {
        e.preventDefault();

        const comision = {
            vendedor_id: $("#vendedor_id").val(),
            reserva_id: $("#reserva_id").val(),
            monto_comision: Number($("#monto_comision").val()),
            estado: $("#estado").val(),
            fecha_generada: $("#fecha_generada").val(),
            fecha_liquidada: requiereFechaLiquidada($("#estado").val())
                ? $("#fecha_liquidada").val()
                : null
        };

        if (comisionIdEdicion) {
            actualizarComisionLiquidacion(comisionIdEdicion, comision, function (error) {
                if (error) {
                    return mostrarAlerta(
                        "danger",
                        obtenerMensajeError(error, "Error al actualizar la comisión o liquidación.")
                    );
                }

                mostrarAlerta("success", "Comisión o liquidación actualizada correctamente.");
                resetFormulario();
                cargarComisiones();
            });
        } else {
            crearComisionLiquidacion(comision, function (error) {
                if (error) {
                    return mostrarAlerta(
                        "danger",
                        obtenerMensajeError(error, "Error al crear la comisión o liquidación.")
                    );
                }

                mostrarAlerta("success", "Comisión o liquidación creada correctamente.");
                resetFormulario();
                cargarComisiones();
            });
        }
    });

    $("#btnCancelar").on("click", resetFormulario);
});

function configurarFormularioInicial() {
    $("#fecha_generada").val(obtenerFechaActual());
    $("#estado").val("pendiente");
    actualizarCampoFechaLiquidada();
}

function cargarCatalogos(callback) {
    let consultasPendientes = 2;

    function finalizarConsulta() {
        consultasPendientes -= 1;

        if (consultasPendientes === 0) {
            callback();
        }
    }

    obtenerVendedoresParaComision(function (error, vendedores) {
        if (error) {
            mostrarAlerta("danger", "No se pudo cargar la lista de vendedores.");
        } else {
            llenarSelectVendedores(vendedores);
        }

        finalizarConsulta();
    });

    obtenerReservasParaComision(function (error, reservas) {
        if (error) {
            mostrarAlerta("danger", "No se pudo cargar la lista de reservas.");
        } else {
            llenarSelectReservas(reservas);
        }

        finalizarConsulta();
    });
}

function llenarSelectVendedores(vendedores) {
    const select = $("#vendedor_id");

    select.html(`<option value="" selected disabled>Seleccione un vendedor</option>`);

    vendedores.forEach(function (vendedor) {
        const estado = vendedor.activo === false ? " (Inactivo)" : "";
        select.append(`<option value="${vendedor._id}">${vendedor.nombre} - ${vendedor.zona}${estado}</option>`);
    });
}

function llenarSelectReservas(reservas) {
    const select = $("#reserva_id");

    select.html(`<option value="" selected disabled>Seleccione una reserva</option>`);

    reservas.forEach(function (reserva) {
        select.append(`<option value="${reserva._id}">${etiquetaReserva(reserva)}</option>`);
    });
}

function etiquetaReserva(reserva) {
    const nombreCliente = reserva.cliente_id?.nombre || "Cliente no disponible";
    const nombreTour = reserva.tour_id?.nombre_tour || "Tour no disponible";
    const fecha = formatearFecha(reserva.fecha_tour);

    return `${nombreCliente} - ${nombreTour} (${fecha})`;
}

function cargarComisiones() {
    obtenerComisionesLiquidacion(function (error, comisiones) {
        if (error) {
            return mostrarAlerta("danger", "No se pudo cargar la lista de comisiones y liquidaciones.");
        }

        const listaComisiones = Array.isArray(comisiones) ? comisiones : [];
        dibujarTabla(listaComisiones);
    });
}

function dibujarTabla(comisiones) {
    const tabla = $("#tablaComisiones");
    tabla.empty();

    if (comisiones.length === 0) {
        tabla.append(`<tr><td colspan="7" class="text-center text-muted">No hay comisiones ni liquidaciones registradas</td></tr>`);
        return;
    }

    comisiones.forEach(function (comision) {
        const nombreVendedor = comision.vendedor_id?.nombre || "Vendedor no disponible";
        const reserva = comision.reserva_id
            ? etiquetaReserva(comision.reserva_id)
            : "Reserva no disponible";
        const badge = crearBadgeEstado(comision.estado);
        const monto = formatearMoneda(comision.monto_comision);
        const fechaGenerada = formatearFecha(comision.fecha_generada);
        const fechaLiquidada = formatearFecha(comision.fecha_liquidada);

        const fila = `
      <tr>
        <td>${nombreVendedor}</td>
        <td>${reserva}</td>
        <td>${monto}</td>
        <td>${badge}</td>
        <td>${fechaGenerada}</td>
        <td>${fechaLiquidada}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-secondary me-1 btn-editar" data-id="${comision._id}"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-sm btn-outline-danger btn-eliminar" data-id="${comision._id}"><i class="bi bi-trash"></i></button>
        </td>
      </tr>`;
        tabla.append(fila);
    });

    $(".btn-editar").on("click", function () {
        const id = $(this).data("id");
        const comision = comisiones.find(c => c._id === id);
        cargarFormulario(comision);
    });

    $(".btn-eliminar").on("click", function () {
        const id = $(this).data("id");
        if (confirm("¿Seguro que quieres eliminar esta comisión o liquidación?")) {
            eliminarComisionLiquidacion(id, function (error) {
                if (error) return mostrarAlerta("danger", "Error al eliminar la comisión o liquidación.");
                mostrarAlerta("success", "Comisión o liquidación eliminada.");
                cargarComisiones();
            });
        }
    });
}

function cargarFormulario(comision) {
    comisionIdEdicion = comision._id;
    $("#vendedor_id").val(obtenerIdReferencia(comision.vendedor_id));
    $("#reserva_id").val(obtenerIdReferencia(comision.reserva_id));
    $("#monto_comision").val(comision.monto_comision);
    $("#estado").val(comision.estado);
    $("#fecha_generada").val(fechaParaInput(comision.fecha_generada));
    actualizarCampoFechaLiquidada();
    $("#fecha_liquidada").val(fechaParaInput(comision.fecha_liquidada));
    $("#tituloFormulario").text("Editar comisión o liquidación");
    $("#btnGuardar").text("Actualizar");
    $("#btnCancelar").removeClass("d-none");
}

function resetFormulario() {
    comisionIdEdicion = null;
    $("#formComision")[0].reset();
    configurarFormularioInicial();
    $("#tituloFormulario").text("Nueva comisión o liquidación");
    $("#btnGuardar").text("Guardar");
    $("#btnCancelar").addClass("d-none");
}

function actualizarCampoFechaLiquidada() {
    const necesitaFecha = requiereFechaLiquidada($("#estado").val());
    $("#contenedorFechaLiquidada").toggleClass("d-none", !necesitaFecha);
    $("#fecha_liquidada").prop("required", necesitaFecha);

    if (!necesitaFecha) {
        $("#fecha_liquidada").val("");
    }
}

function requiereFechaLiquidada(estado) {
    return estado === "liquidada";
}

function obtenerIdReferencia(referencia) {
    if (!referencia) return "";
    if (typeof referencia === "object") return referencia._id || "";
    return referencia;
}

function crearBadgeEstado(estado) {
    const clases = {
        pendiente: "bg-warning text-dark",
        liquidada: "bg-success",
        anulada: "bg-secondary"
    };

    const clase = clases[estado] || "bg-secondary";
    const texto = estado.charAt(0).toUpperCase() + estado.slice(1);

    return `<span class="badge ${clase}">${texto}</span>`;
}

function formatearMoneda(valor) {
    return Number(valor).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
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
