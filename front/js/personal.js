let personalIdEdicion = null;

$(document).ready(function () {
    cargarPersonal();

    $("#formPersonal").on("submit", function (e) {
        e.preventDefault();

        const idiomas = $("#idiomas")
            .val()
            .split(",")
            .map(function (idioma) {
                return idioma.trim();
            })
            .filter(function (idioma) {
                return idioma !== "";
            });

        const personal = {
            nombre: $("#nombre").val().trim(),
            puesto: $("#puesto").val(),
            idiomas: idiomas,
            cedula: $("#cedula").val().trim(),
            fecha_contratacion: $("#fecha_contratacion").val(),
            salario_base: Number($("#salario_base").val())
        };

        if (personalIdEdicion) {
            actualizarPersonal(
                personalIdEdicion,
                personal,
                function (error) {
                    if (error) {
                        return mostrarAlerta(
                            "danger",
                            obtenerMensajeError(
                                error,
                                "Error al actualizar el colaborador."
                            )
                        );
                    }

                    mostrarAlerta(
                        "success",
                        "Colaborador actualizado correctamente."
                    );

                    resetFormulario();
                    cargarPersonal();
                }
            );
        } else {
            crearPersonal(personal, function (error) {
                if (error) {
                    return mostrarAlerta(
                        "danger",
                        obtenerMensajeError(
                            error,
                            "Error al registrar el colaborador."
                        )
                    );
                }

                mostrarAlerta(
                    "success",
                    "Colaborador registrado correctamente."
                );

                resetFormulario();
                cargarPersonal();
            });
        }
    });

    $("#btnCancelar").on("click", resetFormulario);
});

function cargarPersonal() {
    obtenerPersonal(function (error, personal) {
        if (error) {
            return mostrarAlerta(
                "danger",
                "No se pudo cargar la lista del personal."
            );
        }

        dibujarTabla(personal);
    });
}

function dibujarTabla(personal) {
    const tabla = $("#tablaPersonal");

    tabla.empty();

    if (personal.length === 0) {
        tabla.append(`
      <tr>
        <td colspan="7" class="text-center text-muted">
          No hay colaboradores registrados
        </td>
      </tr>
    `);

        return;
    }

    personal.forEach(function (persona) {
        const idiomas = persona.idiomas?.length
            ? persona.idiomas.join(", ")
            : "—";

        const fechaContratacion = formatearFecha(
            persona.fecha_contratacion
        );

        const salario = formatearMoneda(persona.salario_base);

        const fila = `
      <tr>
        <td>${persona.nombre}</td>
        <td>${persona.puesto}</td>
        <td>${idiomas}</td>
        <td>${persona.cedula}</td>
        <td>${fechaContratacion}</td>
        <td>${salario}</td>

        <td class="text-end">
          <button
            type="button"
            class="btn btn-sm btn-outline-secondary me-1 btn-editar"
            data-id="${persona._id}"
            title="Editar colaborador">

            <i class="bi bi-pencil"></i>
          </button>

          <button
            type="button"
            class="btn btn-sm btn-outline-danger btn-eliminar"
            data-id="${persona._id}"
            title="Eliminar colaborador">

            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>
    `;

        tabla.append(fila);
    });

    $(".btn-editar").on("click", function () {
        const id = $(this).data("id");

        const persona = personal.find(function (registro) {
            return registro._id === id;
        });

        if (!persona) {
            return mostrarAlerta(
                "danger",
                "No se encontró el colaborador seleccionado."
            );
        }

        cargarFormulario(persona);
    });

    $(".btn-eliminar").on("click", function () {
        const id = $(this).data("id");

        const confirmar = confirm(
            "¿Seguro que deseas eliminar este colaborador?"
        );

        if (!confirmar) {
            return;
        }

        eliminarPersonal(id, function (error) {
            if (error) {
                return mostrarAlerta(
                    "danger",
                    "Error al eliminar el colaborador."
                );
            }

            mostrarAlerta(
                "success",
                "Colaborador eliminado correctamente."
            );

            if (personalIdEdicion === id) {
                resetFormulario();
            }

            cargarPersonal();
        });
    });
}

function cargarFormulario(persona) {
    personalIdEdicion = persona._id;

    $("#nombre").val(persona.nombre);
    $("#puesto").val(persona.puesto);
    $("#idiomas").val((persona.idiomas || []).join(", "));
    $("#cedula").val(persona.cedula);

    $("#fecha_contratacion").val(
        fechaParaInput(persona.fecha_contratacion)
    );

    $("#salario_base").val(persona.salario_base);

    $("#tituloFormulario").text("Editar colaborador");
    $("#btnGuardar").text("Actualizar");
    $("#btnCancelar").removeClass("d-none");
}

function resetFormulario() {
    personalIdEdicion = null;

    $("#formPersonal")[0].reset();

    $("#tituloFormulario").text("Nuevo colaborador");
    $("#btnGuardar").text("Guardar");
    $("#btnCancelar").addClass("d-none");
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

    const anio = partes[0];
    const mes = partes[1];
    const dia = partes[2];

    return `${dia}/${mes}/${anio}`;
}

function formatearMoneda(valor) {
    return Number(valor).toLocaleString("es-CR", {
        style: "currency",
        currency: "CRC",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}

function obtenerMensajeError(error, mensajePredeterminado) {
    const mensajeApi = error.responseJSON?.mensaje;
    const detalleApi = error.responseJSON?.error;

    if (
        detalleApi &&
        detalleApi.includes("E11000") &&
        detalleApi.includes("cedula")
    ) {
        return "Ya existe un colaborador con esa cédula.";
    }

    if (detalleApi) {
        return `${mensajeApi || mensajePredeterminado}: ${detalleApi}`;
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