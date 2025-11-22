import React from "react";
import GenericCatalog from "../catalogs/GenericCatalog";
import appointmentService from "../../services/appointmentService";

const Episodes = () => {
  const fields = [
    {
      name: "id",
      label: "ID",
      type: "number",
      showInTable: true,
      searchable: false,
    },
    { name: "paciente", label: "Paciente", type: "text", required: true },
    {
      name: "fecha_inicio",
      label: "Fecha Inicio",
      type: "date",
      required: true,
    },
    { name: "fecha_fin", label: "Fecha Fin", type: "date", required: false },
    {
      name: "estado",
      label: "Estado",
      type: "select",
      required: true,
      options: [
        { value: "Abierto", label: "Abierto" },
        { value: "Cerrado", label: "Cerrado" },
      ],
      render: (value) => (
        <span
          className={`badge ${
            value === "Abierto" ? "badge-success" : "badge-secondary"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      name: "descripcion",
      label: "Descripción",
      type: "textarea",
      required: false,
      showInTable: false,
    },
  ];

  const apiConfig = {
    get: appointmentService.getEpisodes,
    getById: appointmentService.getEpisodeById,
    create: appointmentService.createEpisode,
    update: appointmentService.updateEpisode,
    delete: appointmentService.deleteEpisode,
  };

  return (
    <GenericCatalog
      title="Episodios"
      description="Gestión de episodios médicos"
      fields={fields}
      apiConfig={apiConfig}
    />
  );
};

export default Episodes;
