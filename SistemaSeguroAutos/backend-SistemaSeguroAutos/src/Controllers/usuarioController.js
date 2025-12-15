import { Usuario } from "../Models/Usuario.js";

// crear usuario
export const crearUsuario = async (req, res) => {
    try {
        const { nombreUsuario, email, password } = req.body;

        if (!nombreUsuario || !email || !password) {
            return res.status(400).json({
                mensaje: "Nombre de usuario, email y contraseña son obligatorios"
            });
        }

        // Validar email unico
        const usuarioExistente = await Usuario.findOne({ where: { email } });
        if (usuarioExistente) {
            return res.status(400).json({
                mensaje: "El email ya está registrado"
            });
        }

        const nuevoUsuario = await Usuario.create({
            nombreUsuario,
            email,
            password
        });

        res.status(201).json(nuevoUsuario);

    } catch (error) {
        console.error("Error al crear usuario:", error);
        res.status(500).json({ error: error.message });
    }
};

// obtener todos los usuarios
export const obtenerUsuarios = async (_req, res) => {
    try {
        const usuarios = await Usuario.findAll();
        res.status(200).json(usuarios);
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).json({ mensaje: "Error al obtener usuarios" });
    }
};

// obtener un usuario por id
export const obtenerUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado"
            });
        }
        res.status(200).json(usuario);
    } catch (error) {
        console.error("Error al obtener usuario:", error);
        res.status(500).json({ mensaje: "Error al obtener usuario" });
    }
};

// actualizar un usuario
export const actualizarUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado"
            });
        }

        const { nombreUsuario, email, password, fotoPerfil } = req.body;
        
        if (nombreUsuario == null && email == null && password == null && fotoPerfil == null) {
            return res.status(400).json({
                mensaje: "Ingresar al menos un campo para actualizar"
            });
        }

        // Validar si el email esta siendo usado por otro usuario
        if (email && email !== usuario.email) {
            const emailExistente = await Usuario.findOne({ where: { email } });
            if (emailExistente) {
                return res.status(400).json({
                    mensaje: "El email ya está registrado"
                });
            }
        }

        if (nombreUsuario != null) usuario.nombreUsuario = nombreUsuario;
        if (email != null) usuario.email = email;
        if (password != null) usuario.password = password;
        if (fotoPerfil != null) usuario.fotoPerfil = fotoPerfil;

        await usuario.save();
        res.status(200).json(usuario);

    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        res.status(500).json({ mensaje: "Error al actualizar usuario", error: error.message });
    }
};

// eliminar un usuario
export const eliminarUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado"
            });
        }
        await usuario.destroy();
        res.status(204).send();
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        res.status(500).json({ mensaje: "Error al eliminar usuario", error: error.message });
    }
};

// login de usuario
export const loginUsuario = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                mensaje: "Email y contraseña son obligatorios"
            });
        }

        // Buscar usuario por email
        const usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
            return res.status(401).json({
                mensaje: "Credenciales incorrectas"
            });
        }

        // Verificar contraseña (nota: en producción usa bcrypt)
        if (usuario.password !== password) {
            return res.status(401).json({
                mensaje: "Credenciales incorrectas"
            });
        }

        // Login exitoso
        res.status(200).json({
            mensaje: "Login exitoso",
            usuario: {
                id: usuario.id,
                nombreUsuario: usuario.nombreUsuario,
                email: usuario.email
            }
        });

    } catch (error) {
        console.error("Error al hacer login:", error);
        res.status(500).json({ mensaje: "Error en el servidor", error: error.message });
    }
};
