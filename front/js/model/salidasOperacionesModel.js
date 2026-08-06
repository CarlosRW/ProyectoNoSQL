function obtenerSalidasOperaciones(callback) {
    $.ajax({
        type: "GET",
        url: `${API_URL}/salidas-operaciones`,
        dataType: "json",

        success: function (data) {
            callback(null, data);
        },

        error: function (error) {
            console.error(
                "Error GET salidas:",
                error
            );

            callback(error, null);
        }
    });
}

function crearSalidaOperacion(
    salida,
    callback
) {
    $.ajax({
        type: "POST",
        url: `${API_URL}/salidas-operaciones`,
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(salida),

        success: function (data) {
            callback(null, data);
        },

        error: function (error) {
            console.error(
                "Error POST salida:",
                error
            );

            callback(error, null);
        }
    });
}

function actualizarSalidaOperacion(
    id,
    salida,
    callback
) {
    $.ajax({
        type: "PUT",
        url:
            `${API_URL}/salidas-operaciones/${id}`,
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(salida),

        success: function (data) {
            callback(null, data);
        },

        error: function (error) {
            console.error(
                "Error PUT salida:",
                error
            );

            callback(error, null);
        }
    });
}

function eliminarSalidaOperacion(
    id,
    callback
) {
    $.ajax({
        type: "DELETE",
        url:
            `${API_URL}/salidas-operaciones/${id}`,
        dataType: "json",

        success: function (data) {
            callback(null, data);
        },

        error: function (error) {
            console.error(
                "Error DELETE salida:",
                error
            );

            callback(error, null);
        }
    });
}

function obtenerToursParaSalida(callback) {
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

function obtenerEmbarcacionesParaSalida(
    callback
) {
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

function obtenerPersonalParaSalida(
    callback
) {
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