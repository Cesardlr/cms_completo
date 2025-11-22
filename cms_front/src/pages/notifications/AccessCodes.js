import React from "react";
import GenericCatalog from "../catalogs/GenericCatalog";
import notificationService from "../../services/notificationService";

const AccessCodes = () => {
  const fields = [
    {
      name: "id",
      label: "ID",
      type: "number",
      showInTable: true,
      searchable: false,
    },
    { name: "codigo", label: "Código", type: "text", required: true },
    { name: "usuario", label: "Usuario", type: "text", required: true },
    {
      name: "expira_en",
      label: "Fecha Expiración",
      type: "datetime-local",
      required: true,
    },
    {
      name: "usado_en",
      label: "Fecha Uso",
      type: "datetime-local",
      required: false,
    },
    {
      name: "estado",
      label: "Estado",
      type: "select",
      required: true,
      options: [
        { value: "Activo", label: "Activo" },
        { value: "Usado", label: "Usado" },
        { value: "Expirado", label: "Expirado" },
        { value: "Cancelado", label: "Cancelado" },
      ],
      render: (value) => {
        const colors = {
          Activo: "badge-success",
          Usado: "badge-info",
          Expirado: "badge-warning",
          Cancelado: "badge-danger",
        };
        return <span className={`badge ${colors[value]}`}>{value}</span>;
      },
    },
  ];

  const apiConfig = {
    get: notificationService.getAccessCodes,
    getById: notificationService.getAccessCodeById,
    create: notificationService.createAccessCode,
    update: notificationService.updateAccessCode,
    delete: notificationService.deleteAccessCode,
  };

  return (
    <GenericCatalog
      title="Códigos de Acceso"
      description="Gestión de códigos de acceso temporal"
      fields={fields}
      apiConfig={apiConfig}
    />
  );
};

export default AccessCodes;
