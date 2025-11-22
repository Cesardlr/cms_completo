import React from "react";
import GenericCatalog from "../catalogs/GenericCatalog";
import insuranceService from "../../services/insuranceService";

const Companies = () => {
  const fields = [
    {
      name: "id",
      label: "ID",
      type: "number",
      showInTable: true,
      searchable: false,
    },
    { name: "nombre", label: "Nombre", type: "text", required: true },
    { name: "telefono", label: "Teléfono", type: "tel", required: true },
    { name: "correo", label: "Email", type: "email", required: true },
    {
      name: "rfc",
      label: "RFC",
      type: "text",
      required: false,
      showInTable: true,
    },
  ];

  const apiConfig = {
    get: insuranceService.getInsuranceCompanies,
    getById: insuranceService.getInsuranceCompanyById,
    create: insuranceService.createInsuranceCompany,
    update: insuranceService.updateInsuranceCompany,
    delete: insuranceService.deleteInsuranceCompany,
  };

  return (
    <GenericCatalog
      title="Aseguradoras"
      description="Catálogo de compañías aseguradoras"
      fields={fields}
      apiConfig={apiConfig}
    />
  );
};

export default Companies;
