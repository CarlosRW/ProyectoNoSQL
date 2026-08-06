const express = require('express');
const router = express.Router();

const SalidaOperacion = require('../models/SalidaOperacion');
const Tour = require('../models/Tour');
const Embarcacion = require('../models/Embarcacion');
const Personal = require('../models/Personal');

function crearError(mensaje, status = 400) {
    const error = new Error(mensaje);
    error.status = status;

    return error;
}

function normalizarTexto(texto) {
    return String(texto || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

async function prepararDatosSalida(datos) {
    const {
        tour_id,
        embarcacion_id,
        capitan_id,
        guia_id,
        fecha_salida
    } = datos;

    const pasajerosConfirmados = Number(
        datos.pasajeros_confirmados
    );

    if (
        !tour_id ||
        !embarcacion_id ||
        !capitan_id ||
        !guia_id ||
        !fecha_salida
    ) {
        throw crearError(
            'Debe completar todos los campos obligatorios'
        );
    }

    if (
        !Number.isInteger(pasajerosConfirmados) ||
        pasajerosConfirmados < 1
    ) {
        throw crearError(
            'La cantidad de pasajeros debe ser un número entero mayor que cero'
        );
    }

    const [
        tour,
        embarcacion,
        capitan,
        guia
    ] = await Promise.all([
        Tour.findById(tour_id),
        Embarcacion.findById(embarcacion_id),
        Personal.findById(capitan_id),
        Personal.findById(guia_id)
    ]);

    if (!tour) {
        throw crearError(
            'El tour seleccionado no existe',
            404
        );
    }

    if (!embarcacion) {
        throw crearError(
            'La embarcación seleccionada no existe',
            404
        );
    }

    if (
        normalizarTexto(embarcacion.estado) !==
        'operativa'
    ) {
        throw crearError(
            'La embarcación seleccionada no se encuentra operativa'
        );
    }

    if (!capitan) {
        throw crearError(
            'El capitán seleccionado no existe',
            404
        );
    }

    if (
        !normalizarTexto(capitan.puesto).includes(
            'capitan'
        )
    ) {
        throw crearError(
            'El colaborador seleccionado como capitán no tiene ese puesto'
        );
    }

    if (!guia) {
        throw crearError(
            'El guía seleccionado no existe',
            404
        );
    }

    if (
        !normalizarTexto(guia.puesto).includes(
            'guia'
        )
    ) {
        throw crearError(
            'El colaborador seleccionado como guía no tiene ese puesto'
        );
    }

    const capacidadEmbarcacion = Number(
        embarcacion.capacidad_maxima
    );

    if (
        pasajerosConfirmados >
        capacidadEmbarcacion
    ) {
        throw crearError(
            `La embarcación admite un máximo de ${capacidadEmbarcacion} pasajeros`
        );
    }

    const tasaOcupacion = Number(
        (
            pasajerosConfirmados /
            capacidadEmbarcacion
        ).toFixed(4)
    );

    return {
        tour_id,
        embarcacion_id,
        capitan_id,
        guia_id,
        fecha_salida,
        pasajeros_confirmados:
            pasajerosConfirmados,
        capacidad_embarcacion:
            capacidadEmbarcacion,
        tasa_ocupacion:
            tasaOcupacion
    };
}

// GET /api/salidas-operaciones
// Listar todas las salidas
router.get('/', async (req, res) => {
    try {
        const salidas =
            await SalidaOperacion.find()
                .populate(
                    'tour_id',
                    'nombre_tour tipo'
                )
                .populate(
                    'embarcacion_id',
                    'nombre capacidad_maxima estado'
                )
                .populate(
                    'capitan_id',
                    'nombre puesto'
                )
                .populate(
                    'guia_id',
                    'nombre puesto'
                )
                .sort({
                    fecha_salida: 1
                });

        res.status(200).json(salidas);
    } catch (error) {
        res.status(500).json({
            mensaje:
                'Error al obtener las salidas y operaciones',
            error: error.message
        });
    }
});

// POST /api/salidas-operaciones
// Crear una nueva salida
router.post('/', async (req, res) => {
    try {
        const datosSalida =
            await prepararDatosSalida(req.body);

        const nuevaSalida =
            new SalidaOperacion(datosSalida);

        const salidaGuardada =
            await nuevaSalida.save();

        res.status(201).json(salidaGuardada);
    } catch (error) {
        res.status(error.status || 400).json({
            mensaje: 'Error al crear la salida',
            error: error.message
        });
    }
});

// PUT /api/salidas-operaciones/:id
// Actualizar una salida
router.put('/:id', async (req, res) => {
    try {
        const datosSalida =
            await prepararDatosSalida(req.body);

        const salidaActualizada =
            await SalidaOperacion.findByIdAndUpdate(
                req.params.id,
                datosSalida,
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!salidaActualizada) {
            return res.status(404).json({
                mensaje:
                    'Salida u operación no encontrada'
            });
        }

        res.status(200).json(
            salidaActualizada
        );
    } catch (error) {
        res.status(error.status || 400).json({
            mensaje:
                'Error al actualizar la salida',
            error: error.message
        });
    }
});

// DELETE /api/salidas-operaciones/:id
// Eliminar una salida
router.delete('/:id', async (req, res) => {
    try {
        const salidaEliminada =
            await SalidaOperacion.findByIdAndDelete(
                req.params.id
            );

        if (!salidaEliminada) {
            return res.status(404).json({
                mensaje:
                    'Salida u operación no encontrada'
            });
        }

        res.status(200).json({
            mensaje:
                'Salida eliminada correctamente',
            salida: salidaEliminada
        });
    } catch (error) {
        res.status(500).json({
            mensaje:
                'Error al eliminar la salida',
            error: error.message
        });
    }
});

module.exports = router;