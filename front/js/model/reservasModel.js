function obtenerReservas(callback) {
    $.ajax({
        type: "GET",
        url: `${API_URL}/reservas`,
        dataType: "json",

        success: function (data) {
            callback(null, data);
        },

        error: function (error) {
            console.error("Error GET reservas:", error);
            callback(error, null);
        }
    });
}

function crearReserva(reserva, callback) {
    $.ajax({
        type: "POST",
        url: `${API_URL}/reservas`,
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(reserva),

        success: function (data) {
            callback(null, data);
        },

        error: function (error) {
            console.error("Error POST reserva:", error);
            callback(error, null);
        }
    });
}

function actualizarReserva(id, reserva, callback) {
    $.ajax({
        type: "PUT",
        url: `${API_URL}/reservas/${id}`,
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(reserva),

        success: function (data) {
            callback(null, data);
        },

        error: function (error) {
            console.error("Error PUT reserva:", error);
            callback(error, null);
        }
    });
}

function eliminarReserva(id, callback) {
    $.ajax({
        type: "DELETE",
        url: `${API_URL}/reservas/${id}`,
        dataType: "json",

        success: function (data) {
            callback(null, data);
        },

        error: function (error) {
            console.error("Error DELETE reserva:", error);
            callback(error, null);
        }
    });
}

// Consultar clientes para el formulario de reservas
function obtenerClientesParaReserva(callback) {
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

// Consultar tours para el formulario de reservas
function obtenerToursParaReserva(callback) {
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

// Consultar vendedores para el formulario de reservas
function obtenerVendedoresParaReserva(callback) {
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