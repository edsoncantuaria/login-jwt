const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const { z } = require("zod");

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const authSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Nome é muito curto")
      .max(50, "Nome é muito longo"),
    email: z
      .email("Email inválido")
      .nonempty({ message: "Email é obrigatório" }),
    password: z
      .string()
      .min(6, "Senha deve ter pelo menos 6 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        "Senha deve conter letra maiúscula, minúscula, número e caractere especial"
      )
      .nonempty({ message: "Senha é obrigatória" }),
    confirmPassword: z
      .string()
      .nonempty({ message: "Confirmação de senha é obrigatória" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

// Gerar tokens
function generateTokens(user) {
  const accessToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign(
    { id: user.id, email: user.email },
    JWT_REFRESH_SECRET,
    { expiresIn: "3h" }
  );

  return { accessToken, refreshToken };
}

// Rota de registro
router.post("/register", async (req, res) => {
  const { name, email, password } = authSchema.parse(req.body);
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Usuário já existe com esse email cadastrado." });
    }
  } catch (error) {
    console.error("Erro ao verificar usuário:", error);
    return res.status(500).json({ error: "Erro ao verificar usuário" });
  }
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
