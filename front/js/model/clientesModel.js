function obtenerClientes(callback) {
  $.ajax({
    type: "GET",
    url: `${API_URL}/clientes`,
    dataType: "json",
    success: function (data) {
      callback(null, data);
    },
    error: function (error) {
      callback(error, null);
    }
  });
}

function crearCliente(cliente, callback) {
  $.ajax({
    type: "POST",
    url: `${API_URL}/clientes`,
    contentType: "application/json",
    data: JSON.stringify(cliente),
    success: function (data) {
      callback(null, data);
    },
    error: function (error) {
      callback(error, null);
    }
  });
}

function actualizarCliente(id, cliente, callback) {
  $.ajax({
    type: "PUT",
    url: `${API_URL}/clientes/${id}`,
    contentType: "application/json",
    data: JSON.stringify(cliente),
    success: function (data) {
      callback(null, data);
    },
    error: function (error) {
      callback(error, null);
    }
  });
}

function eliminarCliente(id, callback) {
  $.ajax({
    type: "DELETE",
    url: `${API_URL}/clientes/${id}`,
    success: function (data) {
      callback(null, data);
    },
    error: function (error) {
      callback(error, null);
    }
  });
}