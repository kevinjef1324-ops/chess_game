//importamos la libreria path para mejorar el control de directorios
const path = require('path');
// Configuración de variables de entorno apuntando a la carpeta backend
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middlewares para comunicación con el frontend y lectura de JSON
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

// Función asíncrona para gestionar la conexión a MongoDB Atlas
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error(' connection failed:', error.message);
    }
};

// Inicialización del proceso de conexión
connectDB();

// Ruta de prueba inicial para el navegador
app.get('/', (req, res) => {
    res.send('Servidor de ajedrez activo');
});

// Inicialización del servidor en el puerto correspondiente
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});
