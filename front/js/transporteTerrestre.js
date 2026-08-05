let transporteIdEdicion = null;

$(document).ready(function () {
    cargarTransportesTerrestres();

    $("#formTransporteTerrestre").on("submit", function (e) {
        e.preventDefault();

        const rutas = $("#rutas_frecuentes")
            .val()
            .split(",")
            .map(ruta => ruta.trim())
            .filter(ruta => ruta !== "");

        const transporte = {
            vehiculo: $("#vehiculo").val().trim(),
            capacidad_pasajeros: Number(
                $("#capacidad_pasajeros").val()
            ),
            placa: $("#placa").val().trim(),
            conductor_asignado: $("#conductor_asignado").val().trim(),
            rutas_frecuentes: rutas
        };

        if (transporteIdEdicion) {
            actualizarTransporteTerrestre(
                transporteIdEdicion,
                transporte,
                function (error) {
                    if (error) {
                        return mostrarAlerta(
                            "danger",
                            "Error al actualizar el transporte terrestre."
                        );
                    }

                    mostrarAlerta(
                        "success",
                        "Transporte terrestre actualizado correctamente."
                    );

                    resetFormulario();
                    cargarTransportesTerrestres();
                }
            );
        } else {
            crearTransporteTerrestre(
                transporte,
                function (error) {
                    if (error) {
                        return mostrarAlerta(
                            "danger",
                            "Error al crear el transporte terrestre."
                        );
                    }

                    mostrarAlerta(
                        "success",
                        "Transporte terrestre creado correctamente."
                    );

                    resetFormulario();
                    cargarTransportesTerrestres();
                }
            );
        }
    });

    $("#btnCancelar").on("click", resetFormulario);
});

function cargarTransportesTerrestres() {
    obtenerTransportesTerrestres(function (error, transportes) {
        if (error) {
            return mostrarAlerta(
                "danger",
                "No se pudo cargar la lista de transportes terrestres."
            );
        }

        dibujarTabla(transportes);
    });
}

function dibujarTabla(transportes) {
    const tabla = $("#tablaTransportesTerrestres");
    tabla.empty();

    if (transportes.length === 0) {
        tabla.append(`
      <tr>
        <td colspan="6" class="text-center text-muted">
          No hay transportes terrestres registrados
        </td>
      </tr>
    `);

        return;
    }

    transportes.forEach(function (transporte) {
        const rutas = transporte.rutas_frecuentes?.length
            ? transporte.rutas_frecuentes.join(", ")
            : "—";

        const fila = `
      <tr>
        <td>${transporte.vehiculo}</td>
        <td>${transporte.capacidad_pasajeros} pax</td>
        <td>${transporte.placa}</td>
        <td>${transporte.conductor_asignado}</td>
        <td>${rutas}</td>
        <td class="text-end">
          <button
            class="btn btn-sm btn-outline-secondary me-1 btn-editar"
            data-id="${transporte._id}">
            <i class="bi bi-pencil"></i>
          </button>

          <button
            class="btn btn-sm btn-outline-danger btn-eliminar"
            data-id="${transporte._id}">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>
    `;

        tabla.append(fila);
    });

    $(".btn-editar").on("click", function () {
        const id = $(this).data("id");

        const transporte = transportes.find(
            item => item._id === id
        );

        cargarFormulario(transporte);
    });

    $(".btn-eliminar").on("click", function () {
        const id = $(this).data("id");

        const confirmar = confirm(
            "¿Seguro que quieres eliminar este transporte terrestre?"
        );

        if (!confirmar) {
            return;
        }

        eliminarTransporteTerrestre(id, function (error) {
            if (error) {
                return mostrarAlerta(
                    "danger",
                    "Error al eliminar el transporte terrestre."
                );
            }

            mostrarAlerta(
                "success",
                "Transporte terrestre eliminado correctamente."
            );

            cargarTransportesTerrestres();
        });
    });
}

function cargarFormulario(transporte) {
    transporteIdEdicion = transporte._id;

    $("#vehiculo").val(transporte.vehiculo);
    $("#capacidad_pasajeros").val(
        transporte.capacidad_pasajeros
    );
    $("#placa").val(transporte.placa);
    $("#conductor_asignado").val(
        transporte.conductor_asignado
    );
    $("#rutas_frecuentes").val(
        (transporte.rutas_frecuentes || []).join(", ")
    );

    $("#tituloFormulario").text(
        "Editar transporte terrestre"
    );
    $("#btnGuardar").text("Actualizar");
    $("#btnCancelar").removeClass("d-none");
}

function resetFormulario() {
    transporteIdEdicion = null;

    $("#formTransporteTerrestre")[0].reset();
    $("#tituloFormulario").text(
        "Nuevo transporte terrestre"
    );
    $("#btnGuardar").text("Guardar");
    $("#btnCancelar").addClass("d-none");
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
        data-bs-dismiss="alert">
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