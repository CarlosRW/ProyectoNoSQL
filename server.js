const path = require('path');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const conectarDB = require('./config/db');
const tourRoutes = require('./routes/tourRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const vendedorRoutes = require('./routes/vendedorRoutes');
const embarcacionRoutes = require('./routes/embarcacionRoutes');
const transporteTerrestreRoutes = require('./routes/transporteTerrestreRoutes');
const personalRoutes = require('./routes/personalRoutes');

const app = express();

// Conectar a la base de datos
conectarDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir el frontend estático (carpeta front/)
app.use(express.static(path.join(__dirname, 'front')));

// Rutas API
app.use('/api/tours', tourRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/vendedores', vendedorRoutes);
app.use('/api/embarcaciones', embarcacionRoutes);
app.use('/api/transporte-terrestre', transporteTerrestreRoutes);
app.use('/api/personal', personalRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});