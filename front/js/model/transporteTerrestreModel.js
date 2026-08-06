function obtenerTransportesTerrestres(callback) {
    $.ajax({
        type: "GET",
        url: `${API_URL}/transporte-terrestre`,
        dataType: "json",
        success: function (data) {
            callback(null, data);
        },
        error: function (error) {
            callback(error, null);
        }
    });
}

function crearTransporteTerrestre(transporte, callback) {
    $.ajax({
        type: "POST",
        url: `${API_URL}/transporte-terrestre`,
        contentType: "application/json",
        data: JSON.stringify(transporte),
        success: function (data) {
            callback(null, data);
        },
        error: function (error) {
            callback(error, null);
        }
    });
}

function actualizarTransporteTerrestre(id, transporte, callback) {
    $.ajax({
        type: "PUT",
        url: `${API_URL}/transporte-terrestre/${id}`,
        contentType: "application/json",
        data: JSON.stringify(transporte),
        success: function (data) {
            callback(null, data);
        },
        error: function (error) {
            callback(error, null);
        }
    });
}

function eliminarTransporteTerrestre(id, callback) {
    $.ajax({
        type: "DELETE",
        url: `${API_URL}/transporte-terrestre/${id}`,
        success: function (data) {
            callback(null, data);
        },
        error: function (error) {
            callback(error, null);
        }
    });
}