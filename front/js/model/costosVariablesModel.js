function obtenerCostosVariables(callback) {
    $.ajax({
        type: "GET",
        url: `${API_URL}/costos-variables`,
        dataType: "json",

        success: function (data) {
            callback(null, data);
        },

        error: function (error) {
            callback(error, null);
        }
    });
}

function crearCostoVariable(costoVariable, callback) {
    $.ajax({
        type: "POST",
        url: `${API_URL}/costos-variables`,
        contentType: "application/json",
        data: JSON.stringify(costoVariable),

        success: function (data) {
            callback(null, data);
        },

        error: function (error) {
            callback(error, null);
        }
    });
}

function actualizarCostoVariable(id, costoVariable, callback) {
    $.ajax({
        type: "PUT",
        url: `${API_URL}/costos-variables/${id}`,
        contentType: "application/json",
        data: JSON.stringify(costoVariable),

        success: function (data) {
            callback(null, data);
        },

        error: function (error) {
            callback(error, null);
        }
    });
}

function eliminarCostoVariable(id, callback) {
    $.ajax({
        type: "DELETE",
        url: `${API_URL}/costos-variables/${id}`,

        success: function (data) {
            callback(null, data);
        },

        error: function (error) {
            callback(error, null);
        }
    });
}

// Consultar salidas y operaciones para el formulario de costos variables
function obtenerSalidasParaCosto(callback) {
    $.ajax({
        type: "GET",
        url: `${API_URL}/salidas-operaciones`,
        dataType: "json",

        success: function (data) {
            callback(null, data);
        },

        error: function (error) {
            callback(error, null);
        }
    });
}
