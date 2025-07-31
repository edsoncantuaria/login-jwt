import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Moon, Sun } from "lucide-react";
import useDarkMode from "../hooks/useDarkMode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ThemeToggleButton from "../components/ThemeToggleButton";

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [theme, toggleTheme] = useDarkMode();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/");

    axios
      .get("http://192.168.0.171:6062/private", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data.user))
      .catch(() => navigate("/"));
  }, [navigate]);

  const [usuarios, setUsuarios] = useState([]);

  async function buscarUsuarios() {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://192.168.0.171:6062/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsuarios(res.data);
    } catch (err) {
      console.error("Erro ao buscar usuários");
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    toast.success("Deslogando!");
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-blue-900 md:bg-white dark:bg-gray-900 text-white md:text-black dark:text-white transition-all">
      <div className="absolute top-4 left-4 text-sm font-medium">
        {user && <span>Logado como: {user.email}</span>}
      </div>
      {/* Botão de tema */}
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        <ThemeToggleButton />
        <button
          onClick={handleLogout}
          className="px-3 py-1 text-sm border rounded-md bg-red-600 text-white hover:bg-red-700 transition"
        >
          Sair
        </button>
      </div>

      {/* Conteúdo principal para a pagina */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
          {user ? (
            <p className="text-lg">
              Bem-vindo, <span className="font-semibold">{user.email}</span>
            </p>
          ) : (
            <p className="text-lg">Carregando dados do usuário...</p>
          )}
          <ToastContainer
            position="top-center"
            autoClose={3000}
            theme={theme}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
