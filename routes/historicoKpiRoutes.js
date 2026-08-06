const express = require('express');
const router = express.Router();
const HistoricoKpi = require('../models/HistoricoKpi');

// GET /api/historico-kpis
// Listar todo el histórico de indicadores
router.get('/', async (req, res) => {
    try {
        const historicoKpis = await HistoricoKpi.find().sort({ fecha: -1 });

        res.status(200).json(historicoKpis);
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener el histórico de indicadores',
            error: error.message
        });
    }
});

// POST /api/historico-kpis
// Crear un nuevo registro en el histórico de indicadores
router.post('/', async (req, res) => {
    try {
        const nuevoHistoricoKpi = new HistoricoKpi(req.body);
        const historicoKpiGuardado = await nuevoHistoricoKpi.save();

        res.status(201).json(historicoKpiGuardado);
    } catch (error) {
        res.status(400).json({
            mensaje: 'Error al crear el registro del histórico de indicadores',
            error: error.message
        });
    }
});

// PUT /api/historico-kpis/:id
// Actualizar un registro del histórico de indicadores por ID
router.put('/:id', async (req, res) => {
    try {
        const historicoKpiActualizado = await HistoricoKpi.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!historicoKpiActualizado) {
            return res.status(404).json({
                mensaje: 'Registro del histórico de indicadores no encontrado'
            });
        }

        res.status(200).json(historicoKpiActualizado);
    } catch (error) {
        res.status(400).json({
            mensaje: 'Error al actualizar el registro del histórico de indicadores',
            error: error.message
        });
    }
});

// DELETE /api/historico-kpis/:id
// Eliminar un registro del histórico de indicadores por ID
router.delete('/:id', async (req, res) => {
    try {
        const historicoKpiEliminado = await HistoricoKpi.findByIdAndDelete(
            req.params.id
        );

        if (!historicoKpiEliminado) {
            return res.status(404).json({
                mensaje: 'Registro del histórico de indicadores no encontrado'
            });
        }

        res.status(200).json({
            mensaje: 'Registro del histórico de indicadores eliminado correctamente',
            historicoKpi: historicoKpiEliminado
        });
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al eliminar el registro del histórico de indicadores',
            error: error.message
        });
    }
});

module.exports = router;