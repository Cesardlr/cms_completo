import React from "react";
import GenericCatalog from "../catalogs/GenericCatalog";
import notificationService from "../../services/notificationService";

const Notifications = () => {
  const fields = [
    {
      name: "id",
      label: "ID",
      type: "number",
      showInTable: true,
      searchable: false,
    },
    { name: "mensaje", label: "Mensaje", type: "textarea", required: true },
    {
      name: "canal",
      label: "Canal",
      type: "select",
      required: true,
      options: [
        { value: "Email", label: "Email" },
        { value: "SMS", label: "SMS" },
        { value: "Push", label: "Push" },
        { value: "Sistema", label: "Sistema" },
      ],
    },
    {
      name: "estado",
      label: "Estado",
      type: "select",
      required: true,
      options: [
        { value: "Pendiente", label: "Pendiente" },
        { value: "Enviada", label: "Enviada" },
        { value: "Fallida", label: "Fallida" },
        { value: "Leída", label: "Leída" },
      ],
      render: (value) => {
        const colors = {
          Pendiente: "badge-warning",
          Enviada: "badge-success",
          Fallida: "badge-danger",
          Leída: "badge-info",
        };
        return <span className={`badge ${colors[value]}`}>{value}</span>;
      },
    },
    { name: "usuario", label: "Usuario", type: "text", required: true },
    {
      name: "fecha_envio",
      label: "Fecha Envío",
      type: "datetime-local",
      required: true,
    },
  ];

  const apiConfig = {
    get: notificationService.getNotifications,
    getById: notificationService.getNotificationById,
    create: notificationService.createNotification,
    update: notificationService.updateNotification,
    delete: notificationService.deleteNotification,
  };

  return (
    <GenericCatalog
      title="Notificaciones"
      description="Gestión de notificaciones del sistema"
      fields={fields}
      apiConfig={apiConfig}
    />
  );
};

export default Notifications;
