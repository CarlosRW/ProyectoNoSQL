let embarcacionIdEdicion = null;

$(document).ready(function () {
  cargarEmbarcaciones();

  $("#formEmbarcacion").on("submit", function (e) {
    e.preventDefault();

    const embarcacion = {
      nombre: $("#nombre").val().trim(),
      capacidad_maxima: Number($("#capacidad_maxima").val()),
      tipo: $("#tipo").val(),
      estado: $("#estado").val(),
      ultimo_mantenimiento: $("#ultimo_mantenimiento").val() || null
    };

    if (embarcacionIdEdicion) {
      actualizarEmbarcacion(embarcacionIdEdicion, embarcacion, function (error) {
        if (error) return mostrarAlerta("danger", "Error al actualizar la embarcación.");
        mostrarAlerta("success", "Embarcación actualizada correctamente.");
        resetFormulario();
        cargarEmbarcaciones();
      });
    } else {
      crearEmbarcacion(embarcacion, function (error) {
        if (error) return mostrarAlerta("danger", "Error al crear la embarcación.");
        mostrarAlerta("success", "Embarcación creada correctamente.");
        resetFormulario();
        cargarEmbarcaciones();
      });
    }
  });

  $("#btnCancelar").on("click", resetFormulario);
});

function cargarEmbarcaciones() {
  obtenerEmbarcaciones(function (error, embarcaciones) {
    if (error) return mostrarAlerta("danger", "No se pudo cargar la lista de embarcaciones.");
    dibujarTabla(embarcaciones);
  });
}

function dibujarTabla(embarcaciones) {
  const tabla = $("#tablaEmbarcaciones");
  tabla.empty();

  if (embarcaciones.length === 0) {
    tabla.append(`<tr><td colspan="6" class="text-center text-muted">No hay embarcaciones registradas</td></tr>`);
    return;
  }

  embarcaciones.forEach(function (e) {
    const fila = `
      <tr>
        <td>${e.nombre}</td>
        <td>${e.capacidad_maxima} pax</td>
        <td>${e.tipo}</td>
        <td>${e.estado}</td>
        <td>${e.ultimo_mantenimiento ? new Date(e.ultimo_mantenimiento).toLocaleDateString() : '—'}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-secondary me-1 btn-editar" data-id="${e._id}"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-sm btn-outline-danger btn-eliminar" data-id="${e._id}"><i class="bi bi-trash"></i></button>
        </td>
      </tr>`;
    tabla.append(fila);
  });

  $(".btn-editar").on("click", function () {
    const id = $(this).data("id");
    const embarcacion = embarcaciones.find(e => e._id === id);
    cargarFormulario(embarcacion);
  });

  $(".btn-eliminar").on("click", function () {
    const id = $(this).data("id");
    if (confirm("¿Seguro que quieres eliminar esta embarcación?")) {
      eliminarEmbarcacion(id, function (error) {
        if (error) return mostrarAlerta("danger", "Error al eliminar la embarcación.");
        mostrarAlerta("success", "Embarcación eliminada.");
        cargarEmbarcaciones();
      });
    }
  });
}

function cargarFormulario(embarcacion) {
  embarcacionIdEdicion = embarcacion._id;
  $("#nombre").val(embarcacion.nombre);
  $("#capacidad_maxima").val(embarcacion.capacidad_maxima);
  $("#tipo").val(embarcacion.tipo);
  $("#estado").val(embarcacion.estado);
  $("#ultimo_mantenimiento").val(embarcacion.ultimo_mantenimiento ? embarcacion.ultimo_mantenimiento.substring(0, 10) : "");
  $("#tituloFormulario").text("Editar embarcación");
  $("#btnGuardar").text("Actualizar");
  $("#btnCancelar").removeClass("d-none");
}

function resetFormulario() {
  embarcacionIdEdicion = null;
  $("#formEmbarcacion")[0].reset();
  $("#tituloFormulario").text("Nueva embarcación");
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