import React from "react";
import GenericCatalog from "./GenericCatalog";
import catalogService from "../../services/catalogService";

const CodeStatus = () => {
  const fields = [
    {
      name: "id",
      label: "ID",
      type: "number",
      showInTable: true,
      searchable: false,
    },
    { name: "nombre", label: "Estado", type: "text", required: true },
  ];

  const apiConfig = {
    get: catalogService.getCodeStatuses,
    getById: catalogService.getCodeStatusById,
    create: catalogService.createCodeStatus,
    update: catalogService.updateCodeStatus,
    delete: catalogService.deleteCodeStatus,
  };

  return (
    <GenericCatalog
      title="Estados de Código"
      description="Catálogo de estados de códigos de acceso"
      fields={fields}
      apiConfig={apiConfig}
    />
  );
};

export default CodeStatus;
