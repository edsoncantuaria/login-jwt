const request = require("supertest");
const app = require("../index");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

let accessToken = "";
const randomEmail = `edson+${Date.now()}@teste.com`;

// beforeAll(async () => {
//   // comando para limpar o banco de dados antes dos testes
//   await prisma.user.deleteMany();
// });

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Autenticação com JWT", () => {
  it("deve registrar um novo usuário", async () => {
    const res = await request(app).post("/auth/register").send({
      name: "Edson",
      email: randomEmail,
      password: "123456",
    });
    expect(res.statusCode).toBe(201);
  });

  it("deve fazer login e retornar tokens", async () => {
    const res = await request(app).post("/auth/login").send({
      email: randomEmail,
      password: "123456",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
    accessToken = res.body.accessToken;
  });

  it("deve acessar rota protegida com token válido", async () => {
    const res = await request(app)
      .get("/private")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user.email).toBe(randomEmail);
  });

  it("deve bloquear acesso sem token", async () => {
    const res = await request(app).get("/private");
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe("Token não fornecido");
  });

  it("deve bloquear acesso com token inválido", async () => {
    const res = await request(app)
      .get("/private")
      .set("Authorization", "Bearer token_invalido");
    expect(res.statusCode).toBe(403);
    expect(res.body.error).toBe("Token inválido ou expirado");
  });
});
