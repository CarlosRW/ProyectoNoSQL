let vendedorIdEdicion = null;

$(document).ready(function () {
  cargarVendedores();

  $("#formVendedor").on("submit", function (e) {
    e.preventDefault();

    const vendedor = {
      nombre: $("#nombre").val().trim(),
      zona: $("#zona").val().trim(),
      tipo: $("#tipo").val(),
      porcentaje_comision: Number($("#porcentaje_comision").val()),
      telefono: $("#telefono").val().trim(),
      activo: $("#activo").is(":checked")
    };

    if (vendedorIdEdicion) {
      actualizarVendedor(vendedorIdEdicion, vendedor, function (error) {
        if (error) return mostrarAlerta("danger", "Error al actualizar el vendedor.");
        mostrarAlerta("success", "Vendedor actualizado correctamente.");
        resetFormulario();
        cargarVendedores();
      });
    } else {
      crearVendedor(vendedor, function (error) {
        if (error) return mostrarAlerta("danger", "Error al crear el vendedor.");
        mostrarAlerta("success", "Vendedor creado correctamente.");
        resetFormulario();
        cargarVendedores();
      });
    }
  });

  $("#btnCancelar").on("click", resetFormulario);
});

function cargarVendedores() {
  obtenerVendedores(function (error, vendedores) {
    if (error) return mostrarAlerta("danger", "No se pudo cargar la lista de vendedores.");
    dibujarTabla(vendedores);
  });
}

function dibujarTabla(vendedores) {
  const tabla = $("#tablaVendedores");
  tabla.empty();

  if (vendedores.length === 0) {
    tabla.append(`<tr><td colspan="6" class="text-center text-muted">No hay vendedores registrados</td></tr>`);
    return;
  }

  vendedores.forEach(function (v) {
    const badge = v.activo
      ? `<span class="badge badge-activo">Activo</span>`
      : `<span class="badge badge-inactivo">Inactivo</span>`;

    const fila = `
      <tr>
        <td>${v.nombre}</td>
        <td>${v.zona}</td>
        <td>${v.tipo}</td>
        <td>${v.porcentaje_comision}%</td>
        <td>${badge}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-secondary me-1 btn-editar" data-id="${v._id}"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-sm btn-outline-danger btn-eliminar" data-id="${v._id}"><i class="bi bi-trash"></i></button>
        </td>
      </tr>`;
    tabla.append(fila);
  });

  $(".btn-editar").on("click", function () {
    const id = $(this).data("id");
    const vendedor = vendedores.find(v => v._id === id);
    cargarFormulario(vendedor);
  });

  $(".btn-eliminar").on("click", function () {
    const id = $(this).data("id");
    if (confirm("¿Seguro que quieres eliminar este vendedor?")) {
      eliminarVendedor(id, function (error) {
        if (error) return mostrarAlerta("danger", "Error al eliminar el vendedor.");
        mostrarAlerta("success", "Vendedor eliminado.");
        cargarVendedores();
      });
    }
  });
}

function cargarFormulario(vendedor) {
  vendedorIdEdicion = vendedor._id;
  $("#nombre").val(vendedor.nombre);
  $("#zona").val(vendedor.zona);
  $("#tipo").val(vendedor.tipo);
  $("#porcentaje_comision").val(vendedor.porcentaje_comision);
  $("#telefono").val(vendedor.telefono);
  $("#activo").prop("checked", vendedor.activo);
  $("#tituloFormulario").text("Editar vendedor");
  $("#btnGuardar").text("Actualizar");
  $("#btnCancelar").removeClass("d-none");
}

function resetFormulario() {
  vendedorIdEdicion = null;
  $("#formVendedor")[0].reset();
  $("#activo").prop("checked", true);
  $("#tituloFormulario").text("Nuevo vendedor");
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