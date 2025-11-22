import React from "react";
import GenericCatalog from "./GenericCatalog";
import catalogService from "../../services/catalogService";

const MaritalStatus = () => {
  const fields = [
    {
      name: "id",
      label: "ID",
      type: "number",
      showInTable: true,
      searchable: false,
    },
    { name: "nombre", label: "Estado Civil", type: "text", required: true },
  ];

  const apiConfig = {
    get: catalogService.getMaritalStatuses,
    getById: catalogService.getMaritalStatusById,
    create: catalogService.createMaritalStatus,
    update: catalogService.updateMaritalStatus,
    delete: catalogService.deleteMaritalStatus,
  };

  return (
    <GenericCatalog
      title="Estado Civil"
      description="Catálogo de estados civiles"
      fields={fields}
      apiConfig={apiConfig}
    />
  );
};

export default MaritalStatus;
