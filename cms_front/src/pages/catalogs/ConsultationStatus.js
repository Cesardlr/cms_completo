import React from "react";
import GenericCatalog from "./GenericCatalog";
import catalogService from "../../services/catalogService";

const ConsultationStatus = () => {
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
    get: catalogService.getConsultationStatuses,
    getById: catalogService.getConsultationStatusById,
    create: catalogService.createConsultationStatus,
    update: catalogService.updateConsultationStatus,
    delete: catalogService.deleteConsultationStatus,
  };

  return (
    <GenericCatalog
      title="Estados de Consulta"
      description="Catálogo de estados de consultas"
      fields={fields}
      apiConfig={apiConfig}
    />
  );
};

export default ConsultationStatus;
