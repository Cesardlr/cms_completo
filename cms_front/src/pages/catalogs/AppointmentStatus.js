import React from "react";
import GenericCatalog from "./GenericCatalog";
import catalogService from "../../services/catalogService";

const AppointmentStatus = () => {
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
    get: catalogService.getAppointmentStatuses,
    getById: catalogService.getAppointmentStatusById,
    create: catalogService.createAppointmentStatus,
    update: catalogService.updateAppointmentStatus,
    delete: catalogService.deleteAppointmentStatus,
  };

  return (
    <GenericCatalog
      title="Estados de Cita"
      description="Catálogo de estados de citas"
      fields={fields}
      apiConfig={apiConfig}
    />
  );
};

export default AppointmentStatus;
