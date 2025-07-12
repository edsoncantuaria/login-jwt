const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// Gerar tokens
function generateTokens(user) {
  const accessToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign(
    { id: user.id, email: user.email },
    JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
}

// Rota de registro
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });
    res.status(201).json({ message: "Usuário registrado com sucesso" });
  } catch (error) {
    console.error("Erro ao registrar:", error);
    res.status(400).json({ error: "Erro ao registrar usuário" });
  }
});

// Rota de login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) return res.status(401).json({ error: "Senha inválida" });

    const tokens = generateTokens(user);
    res.json(tokens);
  } catch (error) {
    res.status(500).json({ error: "Erro ao fazer login" });
  }
});

// Rota de refresh
router.post("/refresh", (req, res) => {
  const { token } = req.body;

  if (!token) return res.status(401).json({ error: "Refresh token ausente" });

  try {
    const user = jwt.verify(token, JWT_REFRESH_SECRET);
    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );
    res.json({ accessToken });
  } catch (error) {
    res.status(403).json({ error: "Refresh token inválido ou expirado" });
  }
});

module.exports = router;
