import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Mail, KeyRound, Moon, Sun } from "lucide-react";
import { useDarkMode } from "../hooks/useDarkMode";
import Input from "../components/Input";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ThemeToggleButton from "../components/ThemeToggleButton";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [theme, toggleTheme] = useDarkMode();

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const res = await axios.post("http://192.168.0.171:6062/auth/login", {
        email,
        password,
      });
      // const token = res.data.accessToken;
      localStorage.setItem("token", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      toast.success("Login realizado com sucesso!");
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      setError("Login inválido");
    }
  }

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

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-blue-900 md:bg-white dark:bg-gray-900">
      <div className="absolute top-4 right-4">
        <ThemeToggleButton />
      </div>

      {/* Lado esquerdo com o nome do sistema */}
      <div className="bg-blue-900 text-white flex items-center justify-center md:w-[35%] w-full h-40 md:h-auto">
        <h1 className="text-3xl font-bold">API: JWT-TOKEN</h1>
      </div>

      {/* Lado direito com o Formulário de login */}
      <div className="flex flex-col justify-center items-center flex-1 p-8">
        <form
          onSubmit={handleLogin}
          data-testid="login-form"
          className="w-full max-w-sm bg-white md:bg-white dark:bg-gray-800 md:shadow-md rounded-xl p-8 border border-gray-200 md:dark:border-gray-700
             text-white md:text-black dark:text-white"
        >
          <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">
            Login
          </h2>
          <div className="mb-4">
            <span className="flex items-center gap-2 mb-2">
              <Mail />{" "}
              <label className="block text-gray-700 dark:text-white">
                E-mail
              </label>
            </span>

            <Input
              type="email"
              id="email"
              data-testid="email-input"
              value={email}
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
            <Input
              type="password"
              id="password"
              data-testid="password-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <button
              type="submit"
              data-testid="login-button"
              className="w-full bg-blue-700 text-white py-2 rounded-md hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700"
              id="login-button"
            >
              Entrar
            </button>
            {error && (
              <p
                data-testid="login-error-message"
                className="mt-4 text-red-600 text-center"
                id="login-error-message"
              >
                {error}
              </p>
            )}
            <ToastContainer
              position="top-center"
              autoClose={3000}
              theme={theme}
            />
          </div>
          <div
            className="text-center mt-4"
            id="register-link"
            data-testid="register-link"
          >
            <span className="text-gray-600 dark:text-gray-400">
              Não tem uma conta?{" "}
              <button
                onClick={() => navigate("/register")}
                className="text-blue-600 dark:text-blue-400 hover:underline registrar"
                data-testid="register-button"
              >
                Registrar
              </button>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
