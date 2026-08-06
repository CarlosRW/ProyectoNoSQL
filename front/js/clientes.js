let clienteIdEdicion = null;

$(document).ready(function () {
  cargarClientes();

  $("#formCliente").on("submit", function (e) {
    e.preventDefault();

    const cliente = {
      nombre: $("#nombre").val().trim(),
      nacionalidad: $("#nacionalidad").val().trim(),
      tipo_cliente: $("#tipo_cliente").val(),
      telefono: $("#telefono").val().trim(),
      email: $("#email").val().trim(),
      alojamiento: $("#alojamiento").val().trim()
    };

    if (clienteIdEdicion) {
      actualizarCliente(clienteIdEdicion, cliente, function (error) {
        if (error) return mostrarAlerta("danger", "Error al actualizar el cliente.");
        mostrarAlerta("success", "Cliente actualizado correctamente.");
        resetFormulario();
        cargarClientes();
      });
    } else {
      crearCliente(cliente, function (error) {
        if (error) return mostrarAlerta("danger", "Error al crear el cliente.");
        mostrarAlerta("success", "Cliente creado correctamente.");
        resetFormulario();
        cargarClientes();
      });
    }
  });

  $("#btnCancelar").on("click", resetFormulario);
});

function cargarClientes() {
  obtenerClientes(function (error, clientes) {
    if (error) return mostrarAlerta("danger", "No se pudo cargar la lista de clientes.");
    dibujarTabla(clientes);
  });
}

function dibujarTabla(clientes) {
  const tabla = $("#tablaClientes");
  tabla.empty();

  if (clientes.length === 0) {
    tabla.append(`<tr><td colspan="6" class="text-center text-muted">No hay clientes registrados</td></tr>`);
    return;
  }

  clientes.forEach(function (c) {
    const fila = `
      <tr>
        <td>${c.nombre}</td>
        <td>${c.nacionalidad}</td>
        <td>${c.tipo_cliente}</td>
        <td>${c.telefono}</td>
        <td>${c.email}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-secondary me-1 btn-editar" data-id="${c._id}"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-sm btn-outline-danger btn-eliminar" data-id="${c._id}"><i class="bi bi-trash"></i></button>
        </td>
      </tr>`;
    tabla.append(fila);
  });

  $(".btn-editar").on("click", function () {
    const id = $(this).data("id");
    const cliente = clientes.find(c => c._id === id);
    cargarFormulario(cliente);
  });

  $(".btn-eliminar").on("click", function () {
    const id = $(this).data("id");
    if (confirm("¿Seguro que quieres eliminar este cliente?")) {
      eliminarCliente(id, function (error) {
        if (error) return mostrarAlerta("danger", "Error al eliminar el cliente.");
        mostrarAlerta("success", "Cliente eliminado.");
        cargarClientes();
      });
    }
  });
}

function cargarFormulario(cliente) {
  clienteIdEdicion = cliente._id;
  $("#nombre").val(cliente.nombre);
  $("#nacionalidad").val(cliente.nacionalidad);
  $("#tipo_cliente").val(cliente.tipo_cliente);
  $("#telefono").val(cliente.telefono);
  $("#email").val(cliente.email);
  $("#alojamiento").val(cliente.alojamiento);
  $("#tituloFormulario").text("Editar cliente");
  $("#btnGuardar").text("Actualizar");
  $("#btnCancelar").removeClass("d-none");
}

function resetFormulario() {
  clienteIdEdicion = null;
  $("#formCliente")[0].reset();
  $("#tituloFormulario").text("Nuevo cliente");
  $("#btnGuardar").text("Guardar");
  $("#btnCancelar").addClass("d-none");
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