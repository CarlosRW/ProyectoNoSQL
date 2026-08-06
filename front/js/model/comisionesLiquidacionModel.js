function obtenerComisionesLiquidacion(callback) {
    $.ajax({
        type: "GET",
        url: `${API_URL}/comisiones-liquidacion`,
        dataType: "json",

        success: function (data) {
            callback(null, data);
        },

        error: function (error) {
            callback(error, null);
        }
    });
}

function crearComisionLiquidacion(comision, callback) {
    $.ajax({
        type: "POST",
        url: `${API_URL}/comisiones-liquidacion`,
        contentType: "application/json",
        data: JSON.stringify(comision),

        success: function (data) {
            callback(null, data);
        },

        error: function (error) {
            callback(error, null);
        }
    });
}

function actualizarComisionLiquidacion(id, comision, callback) {
    $.ajax({
        type: "PUT",
        url: `${API_URL}/comisiones-liquidacion/${id}`,
        contentType: "application/json",
        data: JSON.stringify(comision),

        success: function (data) {
            callback(null, data);
        },

        error: function (error) {
            callback(error, null);
        }
    });
}

function eliminarComisionLiquidacion(id, callback) {
    $.ajax({
        type: "DELETE",
        url: `${API_URL}/comisiones-liquidacion/${id}`,

        success: function (data) {
            callback(null, data);
        },

        error: function (error) {
            callback(error, null);
        }
    });
}

// Consultar vendedores para el formulario de comisiones y liquidaciones
function obtenerVendedoresParaComision(callback) {
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

// Consultar reservas para el formulario de comisiones y liquidaciones
function obtenerReservasParaComision(callback) {
    $.ajax({
        type: "GET",
        url: `${API_URL}/reservas`,
        dataType: "json",

        success: function (data) {
            callback(null, data);
        },

        error: function (error) {
            callback(error, null);
        }
    });
}
