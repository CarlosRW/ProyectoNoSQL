const express = require('express');
const router = express.Router();
const Reserva = require('../models/Reserva');

function requiereVendedor(canalVenta) {
    return [
        'vendedor_externo',
        'hotel_asociado'
    ].includes(canalVenta);
}

// GET /api/reservas
// Listar todas las reservas
router.get('/', async (req, res) => {
    try {
        const reservas = await Reserva.find()
            .populate('cliente_id', 'nombre email')
            .populate(
                'tour_id',
                'nombre_tour tipo tarifa_individual'
            )
            .populate(
                'vendedor_id',
                'nombre zona tipo'
            )
            .sort({ fecha_tour: 1 });

        res.status(200).json(reservas);
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener las reservas',
            error: error.message
        });
    }
});

// POST /api/reservas
// Crear una nueva reserva
router.post('/', async (req, res) => {
    try {
        const datosReserva = {
            ...req.body
        };

        if (
            requiereVendedor(datosReserva.canal_venta) &&
            !datosReserva.vendedor_id
        ) {
            return res.status(400).json({
                mensaje:
                    'Debe seleccionar un vendedor para este canal de venta'
            });
        }

        if (!requiereVendedor(datosReserva.canal_venta)) {
            datosReserva.vendedor_id = null;
        }

        const nuevaReserva = new Reserva(datosReserva);
        const reservaGuardada = await nuevaReserva.save();

        res.status(201).json(reservaGuardada);
    } catch (error) {
        res.status(400).json({
            mensaje: 'Error al crear la reserva',
            error: error.message
        });
    }
});

// PUT /api/reservas/:id
// Actualizar una reserva existente
router.put('/:id', async (req, res) => {
    try {
        const datosReserva = {
            ...req.body
        };

        if (
            requiereVendedor(datosReserva.canal_venta) &&
            !datosReserva.vendedor_id
        ) {
            return res.status(400).json({
                mensaje:
                    'Debe seleccionar un vendedor para este canal de venta'
            });
        }

        if (!requiereVendedor(datosReserva.canal_venta)) {
            datosReserva.vendedor_id = null;
        }

        const reservaActualizada =
            await Reserva.findByIdAndUpdate(
                req.params.id,
                datosReserva,
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!reservaActualizada) {
            return res.status(404).json({
                mensaje: 'Reserva no encontrada'
            });
        }

        res.status(200).json(reservaActualizada);
    } catch (error) {
        res.status(400).json({
            mensaje: 'Error al actualizar la reserva',
            error: error.message
        });
    }
});

// DELETE /api/reservas/:id
// Eliminar una reserva
router.delete('/:id', async (req, res) => {
    try {
        const reservaEliminada =
            await Reserva.findByIdAndDelete(req.params.id);

        if (!reservaEliminada) {
            return res.status(404).json({
                mensaje: 'Reserva no encontrada'
            });
        }

        res.status(200).json({
            mensaje: 'Reserva eliminada correctamente',
            reserva: reservaEliminada
        });
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al eliminar la reserva',
            error: error.message
        });
    }
});

module.exports = router;