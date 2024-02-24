const express = require("express");
const router = express.Router();
const {
  registrarUsuario,
  login,
  obtenerUsuario,
} = require("../consultas/consultas");
const {
  verificarExistenciaCredenciales,
  validarToken,
} = require("../middleware/verificar");

router.post("/usuarios", verificarExistenciaCredenciales, registrarUsuario);
router.post("/login", login);
router.get("/usuarios", validarToken, obtenerUsuario);

module.exports = router;
