import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const navigate = useNavigate();

  async function fetchData() {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/");

    try {
      const res = await axios.get(`http://192.168.0.171:6062/private`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
    } catch (err) {
      navigate("/");
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Dashboard</h2>
      {user ? (
        <p>Bem-vindo, {user.email}</p>
      ) : (
        <p>Carregando dados do usuário...</p>
      )}
    </div>
  );
}

export default Dashboard;
