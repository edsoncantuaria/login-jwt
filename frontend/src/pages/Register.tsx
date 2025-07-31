import { useEffect, useState } from "react";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Mail, KeyRound, Sun, Moon, User } from "lucide-react";
import { useDarkMode } from "../hooks/useDarkMode";
import InputWithError from "../components/InputWithError";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ThemeToggleButton from "../components/ThemeToggleButton";

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

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<any>({});
  const navigate = useNavigate();
  const [theme, toggleTheme] = useDarkMode();

  async function stillLoggedIn() {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const res = await axios.get("http://192.168.0.171:6062/private", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data.loggedIn === true) {
          navigate("/dashboard");
        }
      } catch (err) {
        console.error("Erro ao verificar o login:", err);
        localStorage.removeItem("token");
        navigate("/");
      }
    }
  }

  useEffect(() => {
    stillLoggedIn();
  }, []);

  async function handleRegister(e) {
    e.preventDefault();

    const data = {
      name,
      email,
      password,
      confirmPassword,
    };

    const parsedData = authSchema.safeParse(data);

    if (!parsedData.success) {
      const fieldErrors: any = {};
      parsedData.error.issues.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setFormErrors(fieldErrors);
      return;
    }

    try {
      const res = await axios.post(
        "http://192.168.0.171:6062/auth/register",
        parsedData.data
      );
      console.log("Registro bem-sucedido:", res.data);
      setError(null);
      toast.success("Usuário registrado com sucesso!");

      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err: any) {
      console.error("Erro ao registrar:", err.response?.data || err);
      setError(err.response?.data?.error || "Erro ao registrar");
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-blue-900 md:bg-white dark:bg-gray-900">
      <div className="absolute top-4 right-4">
        <ThemeToggleButton />
      </div>

      {/* Lado esquerdo com o nome do sistema */}
      <div className="bg-blue-900 text-white flex items-center justify-center md:w-[35%] w-full h-40 md:h-auto">
        <h1 className="text-3xl font-bold">API: JWT-TOKEN</h1>
      </div>

      {/* Lado direito com o Formulário de register */}
      <div className="flex flex-col justify-center items-center flex-1 p-8">
        <form
          onSubmit={handleRegister}
          data-testid="register-form"
          className="w-full max-w-sm bg-white md:bg-white dark:bg-gray-800 md:shadow-md rounded-xl p-8 border border-gray-200 md:dark:border-gray-700
             text-white md:text-black dark:text-white"
        >
          <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">
            Registrar
          </h2>
          <div className="mb-4">
            <span className="flex items-center gap-2 mb-2">
              <User />
              {""}
              <label className="block text-gray-700 dark:text-white">
                Nome
              </label>
            </span>

            <InputWithError
              type="name"
              id="name"
              data-testid="name-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={formErrors.name}
              required
            />
          </div>
          <div className="mb-4">
            <span className="flex items-center gap-2 mb-2">
              <Mail />{" "}
              <label className="block text-gray-700 dark:text-white">
                E-mail
              </label>
            </span>

            <InputWithError
              type="email"
              id="email"
              data-testid="email-input"
              value={email}
              error={formErrors.email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <span className="flex items-center gap-2 mb-2">
              <KeyRound />{" "}
              <label className="block text-gray-700 dark:text-white">
                Senha
              </label>
            </span>
            <InputWithError
              type="password"
              id="password"
              data-testid="password-input"
              value={password}
              error={formErrors.password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <span className="flex items-center gap-2 mb-2">
              <KeyRound />{" "}
              <label className="block text-gray-700 dark:text-white">
                Confirmar Senha
              </label>
            </span>
            <InputWithError
              type="password"
              id="password-confirm"
              data-testid="password-confirm-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={formErrors.confirmPassword}
              required
            />
          </div>
          <button
            type="submit"
            data-testid="register-button"
            id="register-button"
            className="w-full bg-blue-700 text-white py-2 rounded-md hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            Registrar-se
          </button>
          {error && (
            <p
              data-testid="register-error-message"
              className="mt-4 text-red-600 text-center"
              id="register-error-message"
            >
              {error}
            </p>
          )}
          <ToastContainer
            position="top-center"
            autoClose={3000}
            theme={theme}
          />

          <div
            className="text-center mt-4"
            id="login-link"
            data-testid="login-link"
          >
            <span className="text-gray-600 dark:text-gray-400">
              Já tem uma conta?{" "}
              <button
                onClick={() => navigate("/")}
                className="text-blue-600 dark:text-blue-400 hover:underline logar"
                data-testid="login-button"
              >
                Logar
              </button>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
