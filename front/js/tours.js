let tourIdEdicion = null;

$(document).ready(function () {
  cargarTours();

  $("#formTour").on("submit", function (e) {
    e.preventDefault();

    const incluyeTexto = $("#incluye").val().trim();

    const tour = {
      nombre_tour: $("#nombre_tour").val().trim(),
      tipo: $("#tipo").val(),
      tarifa_individual: Number($("#tarifa_individual").val()),
      tarifa_con_transporte: Number($("#tarifa_con_transporte").val()) || 0,
      duracion_horas: Number($("#duracion_horas").val()),
      incluye: incluyeTexto ? incluyeTexto.split(",").map(s => s.trim()) : [],
      activo: $("#activo").is(":checked")
    };

    if (tourIdEdicion) {
      actualizarTour(tourIdEdicion, tour, function (error) {
        if (error) return mostrarAlerta("danger", "Error al actualizar el tour.");
        mostrarAlerta("success", "Tour actualizado correctamente.");
        resetFormulario();
        cargarTours();
      });
    } else {
      crearTour(tour, function (error) {
        if (error) return mostrarAlerta("danger", "Error al crear el tour.");
        mostrarAlerta("success", "Tour creado correctamente.");
        resetFormulario();
        cargarTours();
      });
    }
  });

  $("#btnCancelar").on("click", resetFormulario);
});

function cargarTours() {
  obtenerTours(function (error, tours) {
    if (error) return mostrarAlerta("danger", "No se pudo cargar la lista de tours.");
    dibujarTabla(tours);
  });
}

function dibujarTabla(tours) {
  const tabla = $("#tablaTours");
  tabla.empty();

  if (tours.length === 0) {
    tabla.append(`<tr><td colspan="6" class="text-center text-muted">No hay tours registrados</td></tr>`);
    return;
  }

  tours.forEach(function (t) {
    const badge = t.activo
      ? `<span class="badge badge-activo">Activo</span>`
      : `<span class="badge badge-inactivo">Inactivo</span>`;

    const fila = `
      <tr>
        <td>${t.nombre_tour}</td>
        <td>${t.tipo}</td>
        <td>$${t.tarifa_individual}</td>
        <td>${t.duracion_horas}h</td>
        <td>${badge}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-secondary me-1 btn-editar" data-id="${t._id}"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-sm btn-outline-danger btn-eliminar" data-id="${t._id}"><i class="bi bi-trash"></i></button>
        </td>
      </tr>`;
    tabla.append(fila);
  });

  $(".btn-editar").on("click", function () {
    const id = $(this).data("id");
    const tour = tours.find(t => t._id === id);
    cargarFormulario(tour);
  });

  $(".btn-eliminar").on("click", function () {
    const id = $(this).data("id");
    if (confirm("¿Seguro que quieres eliminar este tour?")) {
      eliminarTour(id, function (error) {
        if (error) return mostrarAlerta("danger", "Error al eliminar el tour.");
        mostrarAlerta("success", "Tour eliminado.");
        cargarTours();
      });
    }
  });
}

function cargarFormulario(tour) {
  tourIdEdicion = tour._id;
  $("#nombre_tour").val(tour.nombre_tour);
  $("#tipo").val(tour.tipo);
  $("#tarifa_individual").val(tour.tarifa_individual);
  $("#tarifa_con_transporte").val(tour.tarifa_con_transporte);
  $("#duracion_horas").val(tour.duracion_horas);
  $("#incluye").val(Array.isArray(tour.incluye) ? tour.incluye.join(", ") : "");
  $("#activo").prop("checked", tour.activo);
  $("#tituloFormulario").text("Editar tour");
  $("#btnGuardar").text("Actualizar");
  $("#btnCancelar").removeClass("d-none");
}

function resetFormulario() {
  tourIdEdicion = null;
  $("#formTour")[0].reset();
  $("#activo").prop("checked", true);
  $("#tituloFormulario").text("Nuevo tour");
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