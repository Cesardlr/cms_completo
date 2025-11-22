import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Basic validation
    if (!username || !password) {
      setError("Por favor ingrese usuario y contraseña");
      setLoading(false);
      return;
    }

    try {
      const result = await login(username, password);
      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.error || "Credenciales inválidas");
      }
    } catch (error) {
      setError(
        "Error de conexión. Verifique que el servidor esté funcionando."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">CMS Médico</h1>
          <p className="login-subtitle">Panel de Administración</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="alert alert-error">{error}</div>}

          <div className="form-group">
            <label className="form-label">Usuario</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ingrese su usuario"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingrese su contraseña"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </form>

        <div className="login-footer">
          <p className="login-hint">
            💡 Usuarios de prueba: <strong>admin</strong> o{" "}
            <strong>editor</strong>
            <br />
            Contraseña: cualquier texto
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
