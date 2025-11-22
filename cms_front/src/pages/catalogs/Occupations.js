import React from "react";
import GenericCatalog from "./GenericCatalog";
import catalogService from "../../services/catalogService";

const Occupations = () => {
  const fields = [
    {
      name: "id",
      label: "ID",
      type: "number",
      showInTable: true,
      searchable: false,
    },
    { name: "nombre", label: "Ocupación", type: "text", required: true },
  ];

  const apiConfig = {
    get: catalogService.getOccupations,
    getById: catalogService.getOccupationById,
    create: catalogService.createOccupation,
    update: catalogService.updateOccupation,
    delete: catalogService.deleteOccupation,
  };

  return (
    <GenericCatalog
      title="Ocupaciones"
      description="Catálogo de ocupaciones"
      fields={fields}
      apiConfig={apiConfig}
    />
  );
};

export default Occupations;
