function obtenerUsuariosSistema(callback) {
    $.ajax({
        type: "GET",
        url: `${API_URL}/usuarios-sistema`,
        dataType: "json",

        success: function (data) {
            callback(null, data);
        },

        error: function (error) {
            callback(error, null);
        }
    });
}

function crearUsuarioSistema(usuario, callback) {
    $.ajax({
        type: "POST",
        url: `${API_URL}/usuarios-sistema`,
        contentType: "application/json",
        data: JSON.stringify(usuario),

        success: function (data) {
            callback(null, data);
        },

        error: function (error) {
            callback(error, null);
        }
    });
}

function actualizarUsuarioSistema(id, usuario, callback) {
    $.ajax({
        type: "PUT",
        url: `${API_URL}/usuarios-sistema/${id}`,
        contentType: "application/json",
        data: JSON.stringify(usuario),

        success: function (data) {
            callback(null, data);
        },

        error: function (error) {
            callback(error, null);
        }
    });
}

function eliminarUsuarioSistema(id, callback) {
    $.ajax({
        type: "DELETE",
        url: `${API_URL}/usuarios-sistema/${id}`,

        success: function (data) {
            callback(null, data);
        },

        error: function (error) {
            callback(error, null);
        }
    });
}
