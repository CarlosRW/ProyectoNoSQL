function obtenerEmbarcaciones(callback) {
  $.ajax({
    type: "GET",
    url: `${API_URL}/embarcaciones`,
    dataType: "json",
    success: function (data) {
      callback(null, data);
    },
    error: function (error) {
      callback(error, null);
    }
  });
}

function crearEmbarcacion(embarcacion, callback) {
  $.ajax({
    type: "POST",
    url: `${API_URL}/embarcaciones`,
    contentType: "application/json",
    data: JSON.stringify(embarcacion),
    success: function (data) {
      callback(null, data);
    },
    error: function (error) {
      callback(error, null);
    }
  });
}

function actualizarEmbarcacion(id, embarcacion, callback) {
  $.ajax({
    type: "PUT",
    url: `${API_URL}/embarcaciones/${id}`,
    contentType: "application/json",
    data: JSON.stringify(embarcacion),
    success: function (data) {
      callback(null, data);
    },
    error: function (error) {
      callback(error, null);
    }
  });
}

function eliminarEmbarcacion(id, callback) {
  $.ajax({
    type: "DELETE",
    url: `${API_URL}/embarcaciones/${id}`,
    success: function (data) {
      callback(null, data);
    },
    error: function (error) {
      callback(error, null);
    }
  });
}