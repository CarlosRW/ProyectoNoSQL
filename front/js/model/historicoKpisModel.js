function obtenerHistoricoKpis(callback) {
    $.ajax({
        type: "GET",
        url: `${API_URL}/historico-kpis`,
        dataType: "json",

        success: function (data) {
            callback(null, data);
        },

        error: function (error) {
            callback(error, null);
        }
    });
}

function crearHistoricoKpi(historicoKpi, callback) {
    $.ajax({
        type: "POST",
        url: `${API_URL}/historico-kpis`,
        contentType: "application/json",
        data: JSON.stringify(historicoKpi),

        success: function (data) {
            callback(null, data);
        },

        error: function (error) {
            callback(error, null);
        }
    });
}

function actualizarHistoricoKpi(id, historicoKpi, callback) {
    $.ajax({
        type: "PUT",
        url: `${API_URL}/historico-kpis/${id}`,
        contentType: "application/json",
        data: JSON.stringify(historicoKpi),

        success: function (data) {
            callback(null, data);
        },

        error: function (error) {
            callback(error, null);
        }
    });
}

function eliminarHistoricoKpi(id, callback) {
    $.ajax({
        type: "DELETE",
        url: `${API_URL}/historico-kpis/${id}`,

        success: function (data) {
            callback(null, data);
        },

        error: function (error) {
            callback(error, null);
        }
    });
}

// Consultar tours para sugerir el "tour más vendido"
function obtenerToursParaHistoricoKpi(callback) {
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
