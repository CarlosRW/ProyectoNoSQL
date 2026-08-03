function obtenerVendedores(callback) {
  $.ajax({
    type: "GET",
    url: `${API_URL}/vendedores`,
    dataType: "json",
    success: function (data) {
      callback(null, data);
    },
    error: function (error) {
      callback(error, null);
    }
  });
}

function crearVendedor(vendedor, callback) {
  $.ajax({
    type: "POST",
    url: `${API_URL}/vendedores`,
    contentType: "application/json",
    data: JSON.stringify(vendedor),
    success: function (data) {
      callback(null, data);
    },
    error: function (error) {
      callback(error, null);
    }
  });
}

function actualizarVendedor(id, vendedor, callback) {
  $.ajax({
    type: "PUT",
    url: `${API_URL}/vendedores/${id}`,
    contentType: "application/json",
    data: JSON.stringify(vendedor),
    success: function (data) {
      callback(null, data);
    },
    error: function (error) {
      callback(error, null);
    }
  });
}

function eliminarVendedor(id, callback) {
  $.ajax({
    type: "DELETE",
    url: `${API_URL}/vendedores/${id}`,
    success: function (data) {
      callback(null, data);
    },
    error: function (error) {
      callback(error, null);
    }
  });
}