import React from "react";
import GenericCatalog from "../catalogs/GenericCatalog";
import insuranceService from "../../services/insuranceService";

const Policies = () => {
  const fields = [
    {
      name: "id",
      label: "ID",
      type: "number",
      showInTable: true,
      searchable: false,
    },
    {
      name: "numero_poliza",
      label: "Número de Póliza",
      type: "text",
      required: true,
    },
    {
      name: "aseguradora",
      label: "Aseguradora",
      type: "text",
      required: true,
      showInTable: true,
    },
    { name: "paciente", label: "Paciente", type: "text", required: true },
    {
      name: "vigente_desde",
      label: "Fecha Inicio",
      type: "date",
      required: true,
    },
    { name: "vigente_hasta", label: "Fecha Fin", type: "date", required: true },
  ];

  const apiConfig = {
    get: insuranceService.getPolicies,
    getById: insuranceService.getPolicyById,
    create: insuranceService.createPolicy,
    update: insuranceService.updatePolicy,
    delete: insuranceService.deletePolicy,
  };

  return (
    <GenericCatalog
      title="Pólizas"
      description="Gestión de pólizas de seguro"
      fields={fields}
      apiConfig={apiConfig}
    />
  );
};

export default Policies;
