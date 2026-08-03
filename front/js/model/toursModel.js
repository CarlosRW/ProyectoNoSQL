function obtenerTours(callback) {
  $.ajax({
    type: "GET",
    url: `${API_URL}/tours`,
    dataType: "json",
    success: function (data) {
      callback(null, data);
    },
    error: function (error) {
      callback(error, null);
    }
  });
}

function crearTour(tour, callback) {
  $.ajax({
    type: "POST",
    url: `${API_URL}/tours`,
    contentType: "application/json",
    data: JSON.stringify(tour),
    success: function (data) {
      callback(null, data);
    },
    error: function (error) {
      callback(error, null);
    }
  });
}

function actualizarTour(id, tour, callback) {
  $.ajax({
    type: "PUT",
    url: `${API_URL}/tours/${id}`,
    contentType: "application/json",
    data: JSON.stringify(tour),
    success: function (data) {
      callback(null, data);
    },
    error: function (error) {
      callback(error, null);
    }
  });
}

function eliminarTour(id, callback) {
  $.ajax({
    type: "DELETE",
    url: `${API_URL}/tours/${id}`,
    success: function (data) {
      callback(null, data);
    },
    error: function (error) {
      callback(error, null);
    }
  });
}