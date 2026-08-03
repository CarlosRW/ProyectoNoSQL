const express = require('express');
const router = express.Router();
const Cliente = require('../models/Cliente');

// GET /api/clientes — Listar todos los clientes
router.get('/', async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.status(200).json(clientes);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los clientes', error: error.message });
  }
});

// POST /api/clientes — Agregar un nuevo cliente
router.post('/', async (req, res) => {
  try {
    const nuevoCliente = new Cliente(req.body);
    const clienteGuardado = await nuevoCliente.save();
    res.status(201).json(clienteGuardado);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear el cliente', error: error.message });
  }
});

// PUT /api/clientes/:id — Actualizar un cliente por ID
router.put('/:id', async (req, res) => {
  try {
    const clienteActualizado = await Cliente.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!clienteActualizado) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }

    res.status(200).json(clienteActualizado);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar el cliente', error: error.message });
  }
});

// DELETE /api/clientes/:id — Eliminar un cliente por ID
router.delete('/:id', async (req, res) => {
  try {
    const clienteEliminado = await Cliente.findByIdAndDelete(req.params.id);

    if (!clienteEliminado) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }

    res.status(200).json({ mensaje: 'Cliente eliminado correctamente', cliente: clienteEliminado });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar el cliente', error: error.message });
  }
});

module.exports = router;