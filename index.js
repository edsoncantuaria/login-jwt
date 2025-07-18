const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./auth");
const verifyToken = require("./verifyToken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("API de autenticação rodando!");
});

app.get("/private", verifyToken, (req, res) => {
  res.json({
    loggedIn: true,
    message: "Você acessou uma rota protegida!",
    user: req.user, // mostra os dados do token
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
module.exports = app;
