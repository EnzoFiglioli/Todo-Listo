require("dotenv").config();
const { Usuario } = require("../models/Usuario.js");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const secretKey = process.env.SECRET_KEY;

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const usuario = await Usuario.findOne({ username });
    if (usuario) {
      const contraseña = bcryptjs.compareSync(password, usuario.password);
      if (contraseña) {
        const data = {
          id: usuario._id,
          username: usuario.username,
        };
        const token = jwt.sign(data, secretKey, { expiresIn: "3d" });
        res.cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        });

        res.json({ ok: true, msg: `Bienvenido ${username}`, token });
      } else {
        res.status(404).json({ msg: "Usuario o contraseña incorrecta" });
      }
    } else {
      res.status(404).json("Usuario no registrado");
    }
  } catch (err) {
    res.json({ msg: `Error al iniciar sesion: ${err.message}` });
  }
};

const signIn = async (req, res) => {
  try {
    const { username, password, name, email } = req.body;
    console.log(req.body);

    const newUser = {
      username,
      password,
      nombreCompleto: name,
      email,
    };
    newUser.password = bcryptjs.hashSync(password, 14);
    const userExists = await Usuario.findOne({ username });

    if (userExists) {
      return res.status(400).json({ msg: "El usuario ya existe" });
    }

    await Usuario.create(newUser);
    return res.json({ msg: "Usuario creado exitosamente", data: newUser });
  } catch (err) {
    res
      .status(500)
      .json({
        msg: "No se pudo crear el usuario. Error en el servidor",
        error: err.message,
      });
  }
};

const logout = (req, res) => {
  try {
    res.clearCookie("token");
    res.json({ msg: "sesion cerrada correctamente" });
  } catch {
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const id = req.user.id;
    if(id == "6928c87649c8d8003c27b84a") return res.status(203).json({msg: "El usuario de prueba no debe ser eliminado"})      
    const deleteUser = await Usuario.findOneAndDelete({ _id: id });

    if (!deleteUser)
      return res.status(403).json({ msg: "No se pudo eliminar usuario" });
    res.clearCookie("token");
    res.json({ msg: "Usuario eliminado exitosamente" });
  } catch (ex) {
    throw ex;
  }
};

module.exports = { login, signIn, logout, deleteAccount };
