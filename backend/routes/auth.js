const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user'); // Importamos el molde de usuario

// Ruta para registrar un nuevo jugador
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 1. Validar si el usuario o email ya existen en la base de datos
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        // 2. Encriptar la contraseña (¡Por seguridad!)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Crear y guardar el nuevo usuario en MongoDB
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Exportamos el enrutador
module.exports = router;

const jwt = require('jsonwebtoken');
// Ruta para iniciar sesión (Login)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Verificar si el usuario existe por su email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // 2. Comparar la contraseña ingresada con la encriptada de la base de datos
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // 3. Generar el JWT (Pase digital de sesión)
        const payload = { id: user.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Enviar el token y datos básicos del jugador al frontend
        res.status(200).json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

