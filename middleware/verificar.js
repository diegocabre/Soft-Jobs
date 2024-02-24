const jwt = require("jsonwebtoken");
const SECRET_KEY = "tu_clave_secreta";

function verificarExistenciaCredenciales(req, res, next) {
  const { email, password, rol, lenguage } = req.body;

  // Verificar si el cuerpo de la solicitud está vacío
  if (!email || !password || !rol || !lenguage) {
    return res
      .status(400)
      .json({
        mensaje: "El cuerpo de la solicitud debe contener los campos email, password, rol y lenguage.",
      });
  }

  // Verificar si el email tiene un formato válido
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ mensaje: "El correo electrónico proporcionado no es válido." });
  }

  // Verificar si la contraseña tiene al menos 6 caracteres
  if (password.length < 6) {
    return res
      .status(400)
      .json({ mensaje: "La contraseña debe tener al menos 6 caracteres." });
  }

  // Llamar a next() para pasar al siguiente middleware si todo está bien
  next();
}

function validarToken(req, res, next) {
  // Extraer el token de las cabeceras de la solicitud
  const token = req.headers.authorization;

  // Verificar si el token está presente
  if (!token) {
    return res
      .status(401)
      .json({ mensaje: "Acceso no autorizado. Token no proporcionado." });
  }

  try {
    // Verificar y decodificar el token
    const decoded = jwt.verify(token, SECRET_KEY);

    // Agregar los datos decodificados del token a la solicitud para uso posterior
    req.usuario = decoded;

    // Llamar a next() para pasar al siguiente middleware si el token es válido
    next();
  } catch (error) {
    // Capturar y manejar errores de verificación de token
    return res.status(401).json({ mensaje: "Token inválido." });
  }
}

module.exports = { verificarExistenciaCredenciales, validarToken };
