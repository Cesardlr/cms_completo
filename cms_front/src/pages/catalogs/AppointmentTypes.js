import React from "react";
import GenericCatalog from "./GenericCatalog";
import catalogService from "../../services/catalogService";

const AppointmentTypes = () => {
  const fields = [
    {
      name: "id",
      label: "ID",
      type: "number",
      showInTable: true,
      searchable: false,
    },
    { name: "nombre", label: "Tipo", type: "text", required: true },
  ];

  const apiConfig = {
    get: catalogService.getAppointmentTypes,
    getById: catalogService.getAppointmentTypeById,
    create: catalogService.createAppointmentType,
    update: catalogService.updateAppointmentType,
    delete: catalogService.deleteAppointmentType,
  };

  return (
    <GenericCatalog
      title="Tipos de Cita"
      description="Catálogo de tipos de citas"
      fields={fields}
      apiConfig={apiConfig}
    />
  );
};

export default AppointmentTypes;
