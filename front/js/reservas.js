let reservaIdEdicion = null;

$(document).ready(function () {
    configurarFormularioInicial();

    cargarCatalogos(function () {
        cargarReservas();
    });

    $("#canal_venta").on("change", function () {
        actualizarCampoVendedor();
    });

    $("#formReserva").on("submit", function (e) {
        e.preventDefault();

        const canalVenta = $("#canal_venta").val();
        const vendedorId = $("#vendedor_id").val();

        if (
            requiereVendedor(canalVenta) &&
            !vendedorId
        ) {
            return mostrarAlerta(
                "danger",
                "Debes seleccionar un vendedor para este canal."
            );
        }

        const reserva = {
            cliente_id: $("#cliente_id").val(),
            tour_id: $("#tour_id").val(),
            canal_venta: canalVenta,
            vendedor_id: requiereVendedor(canalVenta)
                ? vendedorId
                : null,
            cantidad_personas: Number(
                $("#cantidad_personas").val()
            ),
            monto_total: Number($("#monto_total").val()),
            moneda: $("#moneda").val(),
            estado_pago: $("#estado_pago").val(),
            fecha_reserva: $("#fecha_reserva").val(),
            fecha_tour: $("#fecha_tour").val()
        };

        if (reservaIdEdicion) {
            actualizarReserva(
                reservaIdEdicion,
                reserva,
                function (error) {
                    if (error) {
                        return mostrarAlerta(
                            "danger",
                            obtenerMensajeError(
                                error,
                                "Error al actualizar la reserva."
                            )
                        );
                    }

                    mostrarAlerta(
                        "success",
                        "Reserva actualizada correctamente."
                    );

                    resetFormulario();
                    cargarReservas();
                }
            );
        } else {
            crearReserva(reserva, function (error) {
                if (error) {
                    return mostrarAlerta(
                        "danger",
                        obtenerMensajeError(
                            error,
                            "Error al crear la reserva."
                        )
                    );
                }

                mostrarAlerta(
                    "success",
                    "Reserva creada correctamente."
                );

                resetFormulario();
                cargarReservas();
            });
        }
    });

    $("#btnCancelar").on("click", function () {
        resetFormulario();
    });
});

function configurarFormularioInicial() {
    $("#fecha_reserva").val(obtenerFechaActual());
    $("#cantidad_personas").val(1);
    $("#moneda").val("USD");
    $("#estado_pago").val("pendiente");
    $("#canal_venta").val("web");

    actualizarCampoVendedor();
}

function cargarCatalogos(callback) {
    let consultasPendientes = 3;

    function finalizarConsulta() {
        consultasPendientes -= 1;

        if (consultasPendientes === 0) {
            callback();
        }
    }

    obtenerClientesParaReserva(function (error, clientes) {
        if (error) {
            mostrarAlerta(
                "danger",
                "No se pudo cargar la lista de clientes."
            );
        } else {
            llenarSelectClientes(clientes);
        }

        finalizarConsulta();
    });

    obtenerToursParaReserva(function (error, tours) {
        if (error) {
            mostrarAlerta(
                "danger",
                "No se pudo cargar la lista de tours."
            );
        } else {
            llenarSelectTours(tours);
        }

        finalizarConsulta();
    });

    obtenerVendedoresParaReserva(
        function (error, vendedores) {
            if (error) {
                mostrarAlerta(
                    "danger",
                    "No se pudo cargar la lista de vendedores."
                );
            } else {
                llenarSelectVendedores(vendedores);
            }

            finalizarConsulta();
        }
    );
}

function llenarSelectClientes(clientes) {
    const select = $("#cliente_id");

    select.html(`
    <option value="" selected disabled>
      Seleccione un cliente
    </option>
  `);

    clientes.forEach(function (cliente) {
        select.append(`
      <option value="${cliente._id}">
        ${cliente.nombre} - ${cliente.email}
      </option>
    `);
    });
}

function llenarSelectTours(tours) {
    const select = $("#tour_id");

    select.html(`
    <option value="" selected disabled>
      Seleccione un tour
    </option>
  `);

    tours.forEach(function (tour) {
        const estado = tour.activo === false
            ? " (Inactivo)"
            : "";

        select.append(`
      <option value="${tour._id}">
        ${tour.nombre_tour}${estado}
      </option>
    `);
    });
}

function llenarSelectVendedores(vendedores) {
    const select = $("#vendedor_id");

    select.html(`
    <option value="">
      Seleccione un vendedor
    </option>
  `);

    vendedores.forEach(function (vendedor) {
        const estado = vendedor.activo === false
            ? " (Inactivo)"
            : "";

        select.append(`
      <option value="${vendedor._id}">
        ${vendedor.nombre} - ${vendedor.zona}${estado}
      </option>
    `);
    });
}

function cargarReservas() {
    obtenerReservas(function (error, reservas) {
        if (error) {
            return mostrarAlerta(
                "danger",
                "No se pudo cargar la lista de reservas."
            );
        }

        const listaReservas = Array.isArray(reservas)
            ? reservas
            : [];

        dibujarTabla(listaReservas);
    });
}

function dibujarTabla(reservas) {
    const tabla = $("#tablaReservas");

    tabla.empty();

    if (reservas.length === 0) {
        tabla.append(`
      <tr>
        <td
          colspan="8"
          class="text-center text-muted">

          No hay reservas registradas
        </td>
      </tr>
    `);

        return;
    }

    reservas.forEach(function (reserva) {
        const nombreCliente =
            reserva.cliente_id?.nombre ||
            "Cliente no disponible";

        const nombreTour =
            reserva.tour_id?.nombre_tour ||
            "Tour no disponible";

        const nombreVendedor =
            reserva.vendedor_id?.nombre ||
            "Sin vendedor";

        const canalVenta = formatearCanalVenta(
            reserva.canal_venta
        );

        const estadoPago = crearBadgeEstadoPago(
            reserva.estado_pago
        );

        const monto = formatearMoneda(
            reserva.monto_total,
            reserva.moneda
        );

        const fechaTour = formatearFecha(
            reserva.fecha_tour
        );

        const fila = `
      <tr>
        <td>${nombreCliente}</td>

        <td>${nombreTour}</td>

        <td>
          <div>${canalVenta}</div>

          <small class="text-muted">
            ${nombreVendedor}
          </small>
        </td>

        <td>${reserva.cantidad_personas}</td>

        <td>${monto}</td>

        <td>${fechaTour}</td>

        <td>${estadoPago}</td>

        <td class="text-end">
          <button
            type="button"
            class="btn btn-sm btn-outline-secondary me-1 btn-editar"
            data-id="${reserva._id}"
            title="Editar reserva">

            <i class="bi bi-pencil"></i>
          </button>

          <button
            type="button"
            class="btn btn-sm btn-outline-danger btn-eliminar"
            data-id="${reserva._id}"
            title="Eliminar reserva">

            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>
    `;

        tabla.append(fila);
    });

    $(".btn-editar").on("click", function () {
        const id = $(this).data("id");

        const reserva = reservas.find(
            function (registro) {
                return registro._id === id;
            }
        );

        if (!reserva) {
            return mostrarAlerta(
                "danger",
                "No se encontró la reserva seleccionada."
            );
        }

        cargarFormulario(reserva);
    });

    $(".btn-eliminar").on("click", function () {
        const id = $(this).data("id");

        const confirmar = confirm(
            "¿Seguro que deseas eliminar esta reserva?"
        );

        if (!confirmar) {
            return;
        }

        eliminarReserva(id, function (error) {
            if (error) {
                return mostrarAlerta(
                    "danger",
                    "Error al eliminar la reserva."
                );
            }

            mostrarAlerta(
                "success",
                "Reserva eliminada correctamente."
            );

            if (reservaIdEdicion === id) {
                resetFormulario();
            }

            cargarReservas();
        });
    });
}

function cargarFormulario(reserva) {
    reservaIdEdicion = reserva._id;

    $("#cliente_id").val(
        obtenerIdReferencia(reserva.cliente_id)
    );

    $("#tour_id").val(
        obtenerIdReferencia(reserva.tour_id)
    );

    $("#canal_venta").val(reserva.canal_venta);

    actualizarCampoVendedor();

    $("#vendedor_id").val(
        obtenerIdReferencia(reserva.vendedor_id)
    );

    $("#cantidad_personas").val(
        reserva.cantidad_personas
    );

    $("#monto_total").val(reserva.monto_total);
    $("#moneda").val(reserva.moneda);
    $("#estado_pago").val(reserva.estado_pago);

    $("#fecha_reserva").val(
        fechaParaInput(reserva.fecha_reserva)
    );

    $("#fecha_tour").val(
        fechaParaInput(reserva.fecha_tour)
    );

    $("#tituloFormulario").text("Editar reserva");
    $("#btnGuardar").text("Actualizar");
    $("#btnCancelar").removeClass("d-none");
}

function resetFormulario() {
    reservaIdEdicion = null;

    $("#formReserva")[0].reset();

    $("#fecha_reserva").val(obtenerFechaActual());
    $("#cantidad_personas").val(1);
    $("#moneda").val("USD");
    $("#estado_pago").val("pendiente");
    $("#canal_venta").val("web");

    actualizarCampoVendedor();

    $("#tituloFormulario").text("Nueva reserva");
    $("#btnGuardar").text("Guardar");
    $("#btnCancelar").addClass("d-none");
}

function actualizarCampoVendedor() {
    const canalVenta = $("#canal_venta").val();
    const necesitaVendedor = requiereVendedor(
        canalVenta
    );

    $("#contenedorVendedor").toggleClass(
        "d-none",
        !necesitaVendedor
    );

    $("#vendedor_id").prop(
        "required",
        necesitaVendedor
    );

    if (!necesitaVendedor) {
        $("#vendedor_id").val("");
    }
}

function requiereVendedor(canalVenta) {
    return [
        "vendedor_externo",
        "hotel_asociado"
    ].includes(canalVenta);
}

function obtenerIdReferencia(referencia) {
    if (!referencia) {
        return "";
    }

    if (typeof referencia === "object") {
        return referencia._id || "";
    }

    return referencia;
}

function fechaParaInput(fecha) {
    if (!fecha) {
        return "";
    }

    return String(fecha).split("T")[0];
}

function formatearFecha(fecha) {
    if (!fecha) {
        return "—";
    }

    const fechaSinHora = String(fecha).split("T")[0];
    const partes = fechaSinHora.split("-");

    if (partes.length !== 3) {
        return fecha;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function obtenerFechaActual() {
    const fecha = new Date();

    const fechaLocal = new Date(
        fecha.getTime() -
        fecha.getTimezoneOffset() * 60000
    );

    return fechaLocal.toISOString().split("T")[0];
}

function formatearCanalVenta(canalVenta) {
    const canales = {
        web: "Venta web",
        presencial: "Venta presencial",
        vendedor_externo: "Vendedor externo",
        hotel_asociado: "Hotel o alojamiento asociado"
    };

    return canales[canalVenta] || canalVenta;
}

function crearBadgeEstadoPago(estadoPago) {
    const clases = {
        pendiente: "bg-warning text-dark",
        parcial: "bg-info text-dark",
        pagado: "bg-success",
        cancelado: "bg-secondary"
    };

    const clase = clases[estadoPago] || "bg-secondary";

    const texto =
        estadoPago.charAt(0).toUpperCase() +
        estadoPago.slice(1);

    return `
    <span class="badge ${clase}">
      ${texto}
    </span>
  `;
}

function formatearMoneda(valor, moneda) {
    const codigoMoneda =
        moneda === "CRC" ? "CRC" : "USD";

    const configuracionRegional =
        codigoMoneda === "CRC"
            ? "es-CR"
            : "en-US";

    return Number(valor).toLocaleString(
        configuracionRegional,
        {
            style: "currency",
            currency: codigoMoneda,
            minimumFractionDigits:
                codigoMoneda === "CRC" ? 0 : 2,
            maximumFractionDigits:
                codigoMoneda === "CRC" ? 0 : 2
        }
    );
}

function obtenerMensajeError(
    error,
    mensajePredeterminado
) {
    const mensajeApi = error.responseJSON?.mensaje;
    const detalleApi = error.responseJSON?.error;

    if (detalleApi) {
        return `${mensajeApi || mensajePredeterminado
            }: ${detalleApi}`;
    }

    return mensajeApi || mensajePredeterminado;
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
        const elementoAlerta = document.querySelector(
            "#zonaAlertas .alert"
        );

        if (elementoAlerta) {
            bootstrap.Alert
                .getOrCreateInstance(elementoAlerta)
                .close();
        }
    }, 3000);
}