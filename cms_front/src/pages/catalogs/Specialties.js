import React from "react";
import GenericCatalog from "./GenericCatalog";
import catalogService from "../../services/catalogService";

const Specialties = () => {
  const fields = [
    {
      name: "id",
      label: "ID",
      type: "number",
      showInTable: true,
      searchable: false,
    },
    { name: "nombre", label: "Nombre", type: "text", required: true },
  ];

  const apiConfig = {
    get: catalogService.getSpecialties,
    getById: catalogService.getSpecialtyById,
    create: catalogService.createSpecialty,
    update: catalogService.updateSpecialty,
    delete: catalogService.deleteSpecialty,
  };

  return (
    <GenericCatalog
      title="Especialidades"
      description="Catálogo de especialidades médicas"
      fields={fields}
      apiConfig={apiConfig}
    />
  );
};

export default Specialties;
