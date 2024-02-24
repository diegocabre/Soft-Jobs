const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "tu_clave_secreta";
const pool = require("../db/db");

async function registrarUsuario(req, res) {
  const { email, password, rol, lenguage } = req.body;

  try {
    // Verificar si el usuario ya existe en la base de datos
    const usuarioExistente = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [email]
    );

    if (usuarioExistente.rows.length > 0) {
      return res
        .status(400)
        .json({ mensaje: "El usuario ya está registrado." });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar el nuevo usuario en la base de datos
    await pool.query(
      "INSERT INTO usuarios (email, password, rol, lenguage) VALUES ($1, $2, $3, $4)",
      [email, hashedPassword, rol, lenguage]
    );

    return res
      .status(201)
      .json({ mensaje: "Usuario registrado exitosamente." });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    return res.status(500).json({ mensaje: "Error interno del servidor." });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  try {
    // Verificar si el usuario existe en la base de datos
    const usuario = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [email]
    );

    if (usuario.rows.length === 0) {
      return res.status(401).json({ mensaje: "Credenciales inválidas." });
    }

    // Comparar la contraseña proporcionada con la contraseña almacenada en la base de datos
    const passwordMatch = await bcrypt.compare(
      password,
      usuario.rows[0].password
    );

    if (!passwordMatch) {
      return res.status(401).json({ mensaje: "Credenciales inválidas." });
    }

    // Generar un token JWT con la información del usuario
    const token = jwt.sign({ email: usuario.rows[0].email }, SECRET_KEY);

    // Devolver el token JWT como respuesta
    return res.status(200).json({ token });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return res.status(500).json({ mensaje: "Error interno del servidor." });
  }
}

async function obtenerUsuario(req, res) {
  try {
    // Extraer el token de las cabeceras de la solicitud
    const token = req.headers.authorization;

    // Verificar si el token está presente
    if (!token) {
      return res
        .status(401)
        .json({ mensaje: "Acceso no autorizado. Token no proporcionado." });
    }

    // Verificar y decodificar el token
    const decoded = jwt.verify(token, SECRET_KEY);

    // Obtener el correo electrónico del usuario del token decodificado
    const email = decoded.email;

    // Consultar la base de datos para obtener los datos del usuario
    const usuario = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [email]
    );

    // Verificar si el usuario existe
    if (usuario.rows.length === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado." });
    }

    // Devolver los datos del usuario como respuesta
    return res.status(200).json({ usuario: usuario.rows[0] });
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    return res.status(500).json({ mensaje: "Error interno del servidor." });
  }
}

module.exports = { registrarUsuario, login, obtenerUsuario };
