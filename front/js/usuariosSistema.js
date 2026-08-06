let usuarioIdEdicion = null;

$(document).ready(function () {
    configurarFormularioInicial();
    cargarUsuarios();

    $("#formUsuario").on("submit", function (e) {
        e.preventDefault();

        const usuario = {
            nombre_usuario: $("#nombre_usuario").val().trim(),
            rol: $("#rol").val(),
            permisos: obtenerPermisosSeleccionados()
        };

        const contrasena = $("#contrasena").val();

        if (usuarioIdEdicion) {
            // Solo se envía la contraseña si el usuario escribió una nueva
            if (contrasena) {
                usuario.contrasena = contrasena;
            }

            actualizarUsuarioSistema(usuarioIdEdicion, usuario, function (error) {
                if (error) {
                    return mostrarAlerta(
                        "danger",
                        obtenerMensajeError(error, "Error al actualizar el usuario del sistema.")
                    );
                }

                mostrarAlerta("success", "Usuario del sistema actualizado correctamente.");
                resetFormulario();
                cargarUsuarios();
            });
        } else {
            if (!contrasena) {
                return mostrarAlerta("danger", "La contraseña es obligatoria para crear un usuario.");
            }

            usuario.contrasena = contrasena;

            crearUsuarioSistema(usuario, function (error) {
                if (error) {
                    return mostrarAlerta(
                        "danger",
                        obtenerMensajeError(error, "Error al crear el usuario del sistema.")
                    );
                }

                mostrarAlerta("success", "Usuario del sistema creado correctamente.");
                resetFormulario();
                cargarUsuarios();
            });
        }
    });

    $("#btnCancelar").on("click", resetFormulario);
});

function configurarFormularioInicial() {
    $("#rol").val("operaciones");
    $("#contrasena").prop("required", true);
    $("#textoAyudaContrasena").addClass("d-none");
    $(".chk-permiso").prop("checked", false);
}

function obtenerPermisosSeleccionados() {
    return $(".chk-permiso:checked")
        .map(function () {
            return $(this).val();
        })
        .get();
}

function cargarUsuarios() {
    obtenerUsuariosSistema(function (error, usuarios) {
        if (error) {
            return mostrarAlerta("danger", "No se pudo cargar la lista de usuarios del sistema.");
        }

        const listaUsuarios = Array.isArray(usuarios) ? usuarios : [];
        dibujarTabla(listaUsuarios);
    });
}

function dibujarTabla(usuarios) {
    const tabla = $("#tablaUsuarios");
    tabla.empty();

    if (usuarios.length === 0) {
        tabla.append(`<tr><td colspan="5" class="text-center text-muted">No hay usuarios del sistema registrados</td></tr>`);
        return;
    }

    usuarios.forEach(function (usuario) {
        const badgeRol = `<span class="badge bg-info text-dark">${formatearRol(usuario.rol)}</span>`;
        const permisos = (usuario.permisos || []).map(formatearPermiso).join(", ") || "—";
        const ultimoAcceso = formatearFechaHora(usuario.ultimo_acceso);

        const fila = `
      <tr>
        <td>${usuario.nombre_usuario}</td>
        <td>${badgeRol}</td>
        <td><small>${permisos}</small></td>
        <td>${ultimoAcceso}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-secondary me-1 btn-editar" data-id="${usuario._id}"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-sm btn-outline-danger btn-eliminar" data-id="${usuario._id}"><i class="bi bi-trash"></i></button>
        </td>
      </tr>`;
        tabla.append(fila);
    });

    $(".btn-editar").on("click", function () {
        const id = $(this).data("id");
        const usuario = usuarios.find(u => u._id === id);
        cargarFormulario(usuario);
    });

    $(".btn-eliminar").on("click", function () {
        const id = $(this).data("id");
        if (confirm("¿Seguro que quieres eliminar este usuario del sistema?")) {
            eliminarUsuarioSistema(id, function (error) {
                if (error) return mostrarAlerta("danger", "Error al eliminar el usuario del sistema.");
                mostrarAlerta("success", "Usuario del sistema eliminado.");
                cargarUsuarios();
            });
        }
    });
}

function cargarFormulario(usuario) {
    usuarioIdEdicion = usuario._id;
    $("#nombre_usuario").val(usuario.nombre_usuario);
    $("#rol").val(usuario.rol);
    $("#contrasena").val("");
    $("#contrasena").prop("required", false);
    $("#textoAyudaContrasena").removeClass("d-none");

    $(".chk-permiso").each(function () {
        $(this).prop("checked", (usuario.permisos || []).includes($(this).val()));
    });

    $("#tituloFormulario").text("Editar usuario del sistema");
    $("#btnGuardar").text("Actualizar");
    $("#btnCancelar").removeClass("d-none");
}

function resetFormulario() {
    usuarioIdEdicion = null;
    $("#formUsuario")[0].reset();
    configurarFormularioInicial();
    $("#tituloFormulario").text("Nuevo usuario del sistema");
    $("#btnGuardar").text("Guardar");
    $("#btnCancelar").addClass("d-none");
}

function formatearRol(rol) {
    const roles = {
        gerencia: "Gerencia",
        operaciones: "Operaciones",
        ventas: "Ventas",
        contabilidad: "Contabilidad"
    };

    return roles[rol] || rol;
}

function formatearPermiso(permiso) {
    const permisos = {
        ver_reportes_financieros: "Ver reportes financieros",
        gestionar_usuarios: "Gestionar usuarios",
        ver_kpis: "Ver KPIs",
        gestionar_reservas: "Gestionar reservas",
        gestionar_inventario: "Gestionar inventario",
        ver_comisiones: "Ver comisiones"
    };

    return permisos[permiso] || permiso;
}

function formatearFechaHora(fecha) {
    if (!fecha) return "Nunca";

    const objetoFecha = new Date(fecha);

    if (Number.isNaN(objetoFecha.getTime())) return "—";

    const fechaTexto = objetoFecha.toLocaleDateString("es-CR");
    const horaTexto = objetoFecha.toLocaleTimeString("es-CR", { hour: "2-digit", minute: "2-digit" });

    return `${fechaTexto} ${horaTexto}`;
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
