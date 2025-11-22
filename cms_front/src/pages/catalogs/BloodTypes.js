import React from "react";
import GenericCatalog from "./GenericCatalog";
import catalogService from "../../services/catalogService";

const BloodTypes = () => {
  const fields = [
    {
      name: "id",
      label: "ID",
      type: "number",
      showInTable: true,
      searchable: false,
    },
    { name: "tipo", label: "Tipo de Sangre", type: "text", required: true },
  ];

  const apiConfig = {
    get: catalogService.getBloodTypes,
    getById: catalogService.getBloodTypeById,
    create: catalogService.createBloodType,
    update: catalogService.updateBloodType,
    delete: catalogService.deleteBloodType,
  };

  return (
    <GenericCatalog
      title="Tipos de Sangre"
      description="Catálogo de tipos de sangre"
      fields={fields}
      apiConfig={apiConfig}
    />
  );
};

export default BloodTypes;
