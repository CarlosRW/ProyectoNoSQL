let historicoKpiIdEdicion = null;

$(document).ready(function () {
    configurarFormularioInicial();

    cargarTours(function () {
        cargarHistoricoKpis();
    });

    $("#formHistoricoKpi").on("submit", function (e) {
        e.preventDefault();

        const historicoKpi = {
            mes: $("#mes").val().trim(),
            temporada: $("#temporada").val(),
            total_clientes: Number($("#total_clientes").val()),
            ocupacion_promedio: Number($("#ocupacion_promedio").val()) / 100,
            tour_mas_vendido: $("#tour_mas_vendido").val().trim(),
            ingresos_totales: Number($("#ingresos_totales").val()),
            costos_totales: Number($("#costos_totales").val())
        };

        if (historicoKpiIdEdicion) {
            actualizarHistoricoKpi(historicoKpiIdEdicion, historicoKpi, function (error) {
                if (error) {
                    return mostrarAlerta(
                        "danger",
                        obtenerMensajeError(error, "Error al actualizar el indicador.")
                    );
                }

                mostrarAlerta("success", "Indicador actualizado correctamente.");
                resetFormulario();
                cargarHistoricoKpis();
            });
        } else {
            crearHistoricoKpi(historicoKpi, function (error) {
                if (error) {
                    return mostrarAlerta(
                        "danger",
                        obtenerMensajeError(error, "Error al crear el indicador.")
                    );
                }

                mostrarAlerta("success", "Indicador creado correctamente.");
                resetFormulario();
                cargarHistoricoKpis();
            });
        }
    });

    $("#btnCancelar").on("click", resetFormulario);
});

function configurarFormularioInicial() {
    $("#mes").val(obtenerMesActual());
    $("#temporada").val("alta");
}

function cargarTours(callback) {
    obtenerToursParaHistoricoKpi(function (error, tours) {
        if (error) {
            mostrarAlerta("danger", "No se pudo cargar la lista de tours.");
        } else {
            llenarDatalistTours(tours);
        }

        callback();
    });
}

function llenarDatalistTours(tours) {
    const datalist = $("#listaTours");
    datalist.empty();

    tours.forEach(function (tour) {
        datalist.append(`<option value="${tour.nombre_tour}"></option>`);
    });
}

function cargarHistoricoKpis() {
    obtenerHistoricoKpis(function (error, historicoKpis) {
        if (error) {
            return mostrarAlerta("danger", "No se pudo cargar el histórico de indicadores.");
        }

        const listaHistoricoKpis = Array.isArray(historicoKpis) ? historicoKpis : [];
        dibujarTabla(listaHistoricoKpis);
    });
}

function dibujarTabla(historicoKpis) {
    const tabla = $("#tablaHistoricoKpis");
    tabla.empty();

    if (historicoKpis.length === 0) {
        tabla.append(`<tr><td colspan="8" class="text-center text-muted">No hay indicadores registrados</td></tr>`);
        return;
    }

    historicoKpis.forEach(function (kpi) {
        const badgeTemporada = crearBadgeTemporada(kpi.temporada);
        const ocupacion = `${(kpi.ocupacion_promedio * 100).toFixed(1)}%`;
        const ingresos = formatearMoneda(kpi.ingresos_totales);
        const costos = formatearMoneda(kpi.costos_totales);
        const rentabilidad = formatearMoneda(kpi.rentabilidad_neta);
        const claseRentabilidad = kpi.rentabilidad_neta >= 0 ? "text-success" : "text-danger";

        const fila = `
      <tr>
        <td>${kpi.mes}</td>
        <td>${badgeTemporada}</td>
        <td>${kpi.total_clientes}</td>
        <td>${ocupacion}</td>
        <td>${kpi.tour_mas_vendido}</td>
        <td>${ingresos}</td>
        <td>${costos}</td>
        <td class="${claseRentabilidad}">${rentabilidad}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-secondary me-1 btn-editar" data-id="${kpi._id}"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-sm btn-outline-danger btn-eliminar" data-id="${kpi._id}"><i class="bi bi-trash"></i></button>
        </td>
      </tr>`;
        tabla.append(fila);
    });

    $(".btn-editar").on("click", function () {
        const id = $(this).data("id");
        const kpi = historicoKpis.find(k => k._id === id);
        cargarFormulario(kpi);
    });

    $(".btn-eliminar").on("click", function () {
        const id = $(this).data("id");
        if (confirm("¿Seguro que quieres eliminar este registro del histórico de indicadores?")) {
            eliminarHistoricoKpi(id, function (error) {
                if (error) return mostrarAlerta("danger", "Error al eliminar el indicador.");
                mostrarAlerta("success", "Indicador eliminado.");
                cargarHistoricoKpis();
            });
        }
    });
}

function cargarFormulario(kpi) {
    historicoKpiIdEdicion = kpi._id;
    $("#mes").val(kpi.mes);
    $("#temporada").val(kpi.temporada);
    $("#total_clientes").val(kpi.total_clientes);
    $("#ocupacion_promedio").val((kpi.ocupacion_promedio * 100).toFixed(1));
    $("#tour_mas_vendido").val(kpi.tour_mas_vendido);
    $("#ingresos_totales").val(kpi.ingresos_totales);
    $("#costos_totales").val(kpi.costos_totales);
    $("#tituloFormulario").text("Editar indicador");
    $("#btnGuardar").text("Actualizar");
    $("#btnCancelar").removeClass("d-none");
}

function resetFormulario() {
    historicoKpiIdEdicion = null;
    $("#formHistoricoKpi")[0].reset();
    configurarFormularioInicial();
    $("#tituloFormulario").text("Nuevo indicador");
    $("#btnGuardar").text("Guardar");
    $("#btnCancelar").addClass("d-none");
}

function crearBadgeTemporada(temporada) {
    const clase = temporada === "alta" ? "badge-activo" : "badge-inactivo";
    const texto = temporada === "alta" ? "Alta" : "Baja";

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

function obtenerMesActual() {
    const fecha = new Date();
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    return `${anio}-${mes}`;
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
