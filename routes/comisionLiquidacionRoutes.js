const express = require('express');
const router = express.Router();
const ComisionLiquidacion = require('../models/ComisionLiquidacion');

function requiereFechaLiquidacion(estadoLiquidacion) {
    return estadoLiquidacion === 'liquidada';
}

// GET /api/comisiones-liquidacion
// Listar todas las comisiones y liquidaciones
router.get('/', async (req, res) => {
    try {
        const comisiones = await ComisionLiquidacion.find()
            .populate('vendedor_id', 'nombre zona tipo')
            .sort({ periodo: -1 });

        res.status(200).json(comisiones);
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener las comisiones y liquidaciones',
            error: error.message
        });
    }
});

// POST /api/comisiones-liquidacion
// Crear una nueva comisión o liquidación
router.post('/', async (req, res) => {
    try {
        const datosComision = {
            ...req.body
        };

        if (!requiereFechaLiquidacion(datosComision.estado_liquidacion)) {
            datosComision.fecha_liquidacion = null;
        }

        const nuevaComision = new ComisionLiquidacion(datosComision);
        const comisionGuardada = await nuevaComision.save();

        res.status(201).json(comisionGuardada);
    } catch (error) {
        res.status(400).json({
            mensaje: 'Error al crear la comisión o liquidación',
            error: error.message
        });
    }
});

// PUT /api/comisiones-liquidacion/:id
// Actualizar una comisión o liquidación existente
router.put('/:id', async (req, res) => {
    try {
        const datosComision = {
            ...req.body
        };

        if (!requiereFechaLiquidacion(datosComision.estado_liquidacion)) {
            datosComision.fecha_liquidacion = null;
        }

        const comisionActualizada = await ComisionLiquidacion.findByIdAndUpdate(
            req.params.id,
            datosComision,
            {
                new: true,
                runValidators: true
            }
        );

        if (!comisionActualizada) {
            return res.status(404).json({
                mensaje: 'Comisión o liquidación no encontrada'
            });
        }

        res.status(200).json(comisionActualizada);
    } catch (error) {
        res.status(400).json({
            mensaje: 'Error al actualizar la comisión o liquidación',
            error: error.message
        });
    }
});

// DELETE /api/comisiones-liquidacion/:id
// Eliminar una comisión o liquidación
router.delete('/:id', async (req, res) => {
    try {
        const comisionEliminada = await ComisionLiquidacion.findByIdAndDelete(
            req.params.id
        );

        if (!comisionEliminada) {
            return res.status(404).json({
                mensaje: 'Comisión o liquidación no encontrada'
            });
        }

        res.status(200).json({
            mensaje: 'Comisión o liquidación eliminada correctamente',
            comision: comisionEliminada
        });
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al eliminar la comisión o liquidación',
            error: error.message
        });
    }
});

module.exports = router;