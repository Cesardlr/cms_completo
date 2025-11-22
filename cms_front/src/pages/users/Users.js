import React, { useState, useEffect } from "react";
import Table from "../../components/common/Table";
import Modal from "../../components/common/Modal";
import SearchBar from "../../components/common/SearchBar";
import Pagination from "../../components/common/Pagination";
import Loading from "../../components/common/Loading";
import userService from "../../services/userService";
import "./Users.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    username: "",
    correo: "",
    telefono: "",
    password: "",
    rol_id: 3, // 3 = Paciente por defecto
  });

  // Cargar usuarios al montar el componente
  useEffect(() => {
    loadUsers();
  }, [currentPage, searchTerm]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.getUsers({
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
      });
      console.log(response);

      setUsers(response.data || []);
      setTotalUsers(response.pagination?.total || 0);
      setTotalPages(
        Math.ceil((response.pagination?.total || 0) / itemsPerPage)
      );
    } catch (error) {
      console.error("Error loading users:", error);
      setError("Error al cargar los usuarios");
    } finally {
      setLoading(false);
    }
  };

  console.log(users);

  const handleAdd = () => {
    setEditingUser(null);
    setFormData({
      username: "",
      correo: "",
      telefono: "",
      password: "",
      rol_id: 3,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      correo: user.correo,
      telefono: user.telefono,
      password: "",
      rol_id: user.rol_id,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (user) => {
    if (
      window.confirm(`¿Está seguro de eliminar el usuario ${user.username}?`)
    ) {
      try {
        await userService.deleteUser(user.id);
        await loadUsers(); // Recargar la lista
      } catch (error) {
        console.error("Error deleting user:", error);
        setError("Error al eliminar el usuario");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingUser) {
        await userService.updateUser(editingUser.id, formData);
      } else {
        await userService.createUser(formData);
      }

      setIsModalOpen(false);
      await loadUsers(); // Recargar la lista
    } catch (error) {
      console.error("Error saving user:", error);
      setError("Error al guardar el usuario");
    }
  };

  // Los datos ya vienen filtrados del backend
  const paginatedUsers = users;

  const columns = [
    { header: "ID", accessor: "id" },
    { header: "Usuario", accessor: "username" },
    { header: "Email", accessor: "correo" },
    { header: "Teléfono", accessor: "telefono" },
    {
      header: "Rol",
      accessor: "rol_nombre",
      render: (value, row) => {
        const rolId = row.rol_id;
        let badgeClass = "badge-info";
        if (rolId === 1) badgeClass = "badge-primary";
        if (rolId === 2) badgeClass = "badge-success";
        if (rolId === 3) badgeClass = "badge-info";

        return (
          <span className={`badge ${badgeClass}`}>{value || "Sin Rol"}</span>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Gestión de Usuarios</h1>
          <p className="page-description">Cargando usuarios...</p>
        </div>
        <Loading message="Cargando usuarios..." />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Gestión de Usuarios</h1>
          <p className="page-description">
            Administrar usuarios del sistema ({totalUsers} usuarios)
          </p>
          {error && (
            <div className="alert alert-warning">
              ⚠️ {error}
              <button onClick={loadUsers} className="btn btn-sm btn-outline">
                Reintentar
              </button>
            </div>
          )}
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>
          + Agregar Usuario
        </button>
      </div>

      <div className="card">
        <div className="card-toolbar">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar usuarios..."
          />
        </div>

        <Table
          columns={columns}
          data={paginatedUsers}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? "Editar Usuario" : "Nuevo Usuario"}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Usuario *</label>
            <input
              type="text"
              className="form-control"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email *</label>
            <input
              type="email"
              className="form-control"
              value={formData.correo}
              onChange={(e) =>
                setFormData({ ...formData, correo: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Teléfono</label>
            <input
              type="tel"
              className="form-control"
              value={formData.telefono}
              onChange={(e) =>
                setFormData({ ...formData, telefono: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Contraseña {!editingUser && "*"}
            </label>
            <input
              type="password"
              className="form-control"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required={!editingUser}
              placeholder={editingUser ? "Dejar en blanco para no cambiar" : ""}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Rol *</label>
            <select
              className="form-control form-select"
              value={formData.rol_id}
              onChange={(e) =>
                setFormData({ ...formData, rol_id: parseInt(e.target.value) })
              }
              required
            >
              <option value={1}>Administrador</option>
              <option value={2}>Médico</option>
              <option value={3}>Paciente</option>
            </select>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              {editingUser ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Users;
