function obtenerPersonal(callback) {
    $.ajax({
        type: "GET",
        url: `${API_URL}/personal`,
        dataType: "json",

        success: function (data) {
            callback(null, data);
        },

        error: function (error) {
            callback(error, null);
        }
    });
}

function crearPersonal(personal, callback) {
    $.ajax({
        type: "POST",
        url: `${API_URL}/personal`,
        contentType: "application/json",
        data: JSON.stringify(personal),

        success: function (data) {
            callback(null, data);
        },

        error: function (error) {
            callback(error, null);
        }
    });
}

function actualizarPersonal(id, personal, callback) {
    $.ajax({
        type: "PUT",
        url: `${API_URL}/personal/${id}`,
        contentType: "application/json",
        data: JSON.stringify(personal),

        success: function (data) {
            callback(null, data);
        },

        error: function (error) {
            callback(error, null);
        }
    });
}

function eliminarPersonal(id, callback) {
    $.ajax({
        type: "DELETE",
        url: `${API_URL}/personal/${id}`,

        success: function (data) {
            callback(null, data);
        },

        error: function (error) {
            callback(error, null);
        }
    });
}