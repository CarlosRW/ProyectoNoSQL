
const API_URL = window.API_URL || "http://localhost:3000/api";
const ENDPOINT_CLIENTES = `${API_URL}/clientes`;

let clienteIdEdicion = null;

$(document).ready(function () {
  cargarClientes();

  $("#formCliente").on("submit", function (e) {Select Default Profile
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

/* ==========================================================================
   1. (PETICIONES HTTP)
   ========================================================================== */

// GET: Obtener todos los clientes
function obtenerClientes(callback) {
  $.ajax({
    url: ENDPOINT_CLIENTES,
    method: "GET",
    dataType: "json",
    success: function (data) {
      callback(null, data);
    },
    error: function (xhr, status, error) {
      console.error("Error al obtener clientes:", error);
      callback(error, null);
    }
  });
}

// POST: Crear un nuevo cliente
function crearCliente(cliente, callback) {
  $.ajax({
    url: ENDPOINT_CLIENTES,
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(cliente),
    success: function (respuesta) {
      callback(null, respuesta);
    },
    error: function (xhr, status, error) {
      console.error("Error al crear cliente:", error);
      callback(error, null);
    }
  });
}

// PUT: Actualizar un cliente existente
function actualizarCliente(id, cliente, callback) {
  $.ajax({
    url: `${ENDPOINT_CLIENTES}/${id}`,
    method: "PUT",
    contentType: "application/json",
    data: JSON.stringify(cliente),
    success: function (respuesta) {
      callback(null, respuesta);
    },
    error: function (xhr, status, error) {
      console.error("Error al actualizar cliente:", error);
      callback(error, null);
    }
  });
}

// DELETE: Eliminar un cliente por ID
function eliminarCliente(id, callback) {
  $.ajax({
    url: `${ENDPOINT_CLIENTES}/${id}`,
    method: "DELETE",
    success: function (respuesta) {
      callback(null, respuesta);
    },
    error: function (xhr, status, error) {
      console.error("Error al eliminar cliente:", error);
      callback(error, null);
    }
  });
}

/* ==========================================================================
   2. FUNCIONES DE MANIPULACIÓN DEL DOM / VISTA
   ========================================================================== */

function cargarClientes() {
  obtenerClientes(function (error, clientes) {
    if (error) return mostrarAlerta("danger", "No se pudo cargar la lista de clientes.");
    dibujarTabla(clientes);
  });
}

function dibujarTabla(clientes) {
  const tabla = $("#tablaClientes");
  tabla.empty();

  if (!clientes || clientes.length === 0) {
    tabla.append(`<tr><td colspan="6" class="text-center text-muted">No hay clientes registrados</td></tr>`);
    return;
  }

  clientes.forEach(function (c) {
    const fila = `
      <tr>
        <td>${c.nombre || ''}</td>
        <td>${c.nacionalidad || ''}</td>
        <td>${c.tipo_cliente || ''}</td>
        <td>${c.telefono || ''}</td>
        <td>${c.email || ''}</td>
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
    if (cliente) {
      cargarFormulario(cliente);
    }
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