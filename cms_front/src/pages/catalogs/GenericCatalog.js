import React, { useState, useEffect } from "react";
import Table from "../../components/common/Table";
import Modal from "../../components/common/Modal";
import SearchBar from "../../components/common/SearchBar";
import Pagination from "../../components/common/Pagination";
import Loading from "../../components/common/Loading";
import "../users/Users.css";

const GenericCatalog = ({
  title,
  description,
  fields,
  initialData,
  apiConfig,
}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const initialFormData = fields.reduce((acc, field) => {
    acc[field.name] =
      field.type === "select" ? field.options[0]?.value || "" : "";
    return acc;
  }, {});

  const [formData, setFormData] = useState(initialFormData);

  // Cargar datos al montar el componente
  useEffect(() => {
    if (apiConfig) {
      loadItems();
    } else if (initialData) {
      setItems(initialData);
      setLoading(false);
    }
  }, [currentPage, searchTerm]);

  const loadItems = async () => {
    try {
      setLoading(true);
      setError(null);

      // Solo enviar parámetros esenciales
      const params = {
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
      };

      const response = await apiConfig.get(params);

      setItems(response.data || []);
      setTotalItems(response.pagination?.total || 0);
      setTotalPages(
        Math.ceil((response.pagination?.total || 0) / itemsPerPage)
      );
    } catch (error) {
      console.error(`Error loading ${title.toLowerCase()}:`, error);
      setError(`Error al cargar ${title.toLowerCase()}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData(initialFormData);
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    const editData = fields.reduce((acc, field) => {
      acc[field.name] = item[field.name] || "";
      return acc;
    }, {});
    setFormData(editData);
    setIsModalOpen(true);
  };

  const handleDelete = async (item) => {
    if (window.confirm(`¿Está seguro de eliminar este registro?`)) {
      try {
        if (apiConfig) {
          await apiConfig.delete(item.id);
          await loadItems(); // Recargar la lista
        } else {
          setItems(items.filter((i) => i.id !== item.id));
        }
      } catch (error) {
        console.error("Error deleting item:", error);
        setError("Error al eliminar el registro");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (apiConfig) {
        if (editingItem) {
          await apiConfig.update(editingItem.id, formData);
        } else {
          await apiConfig.create(formData);
        }
        await loadItems(); // Recargar la lista
      } else {
        if (editingItem) {
          setItems(
            items.map((i) =>
              i.id === editingItem.id ? { ...i, ...formData } : i
            )
          );
        } else {
          const newItem = {
            id: Math.max(...items.map((i) => i.id), 0) + 1,
            ...formData,
          };
          setItems([...items, newItem]);
        }
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving item:", error);
      setError("Error al guardar el registro");
    }
  };

  // Los datos ya vienen filtrados del backend si hay apiConfig
  const paginatedItems = items;

  const columns = fields
    .filter((field) => field.showInTable !== false)
    .map((field) => ({
      header: field.label,
      accessor: field.name,
      render: field.render,
    }));

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">{title}</h1>
          <p className="page-description">Cargando...</p>
        </div>
        <Loading message={`Cargando ${title.toLowerCase()}...`} />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">{title}</h1>
          <p className="page-description">
            {description} ({totalItems} registros)
          </p>
          {error && (
            <div className="alert alert-warning">
              ⚠️ {error}
              <button onClick={loadItems} className="btn btn-sm btn-outline">
                Reintentar
              </button>
            </div>
          )}
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>
          + Agregar
        </button>
      </div>

      <div className="card">
        <div className="card-toolbar">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar..."
          />
        </div>

        <Table
          columns={columns}
          data={paginatedItems}
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
        title={editingItem ? `Editar ${title}` : `Nuevo ${title}`}
      >
        <form onSubmit={handleSubmit}>
          {fields.map((field) => (
            <div key={field.name} className="form-group">
              <label className="form-label">
                {field.label} {field.required && "*"}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  className="form-control"
                  value={formData[field.name]}
                  onChange={(e) =>
                    setFormData({ ...formData, [field.name]: e.target.value })
                  }
                  required={field.required}
                  rows={4}
                />
              ) : field.type === "select" ? (
                <select
                  className="form-control form-select"
                  value={formData[field.name]}
                  onChange={(e) =>
                    setFormData({ ...formData, [field.name]: e.target.value })
                  }
                  required={field.required}
                >
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type || "text"}
                  className="form-control"
                  value={formData[field.name]}
                  onChange={(e) =>
                    setFormData({ ...formData, [field.name]: e.target.value })
                  }
                  required={field.required}
                />
              )}
            </div>
          ))}

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              {editingItem ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default GenericCatalog;
