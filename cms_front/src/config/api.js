// 🔧 Configuración de la API
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  TIMEOUT: 10000, // 10 segundos
  RETRY_ATTEMPTS: 3,
};

export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    PROFILE: "/auth/profile",
  },
  DASHBOARD: {
    KPIS: "/dashboard/kpis",
    CHARTS: "/dashboard/charts",
    ALL: "/dashboard",
  },
  USERS: "/users",
  DOCTORS: "/doctors",
  PATIENTS: "/patients",
  GEOGRAPHY: {
    COUNTRIES: "/geography/paises",
    STATES: "/geography/estados",
    CITIES: "/geography/ciudades",
    COLONIES: "/geography/colonias",
  },
  CATALOGS: {
    SPECIALTIES: "/catalogs/especialidades",
    BLOOD_TYPES: "/catalogs/tipos-sangre",
    OCCUPATIONS: "/catalogs/ocupaciones",
    MARITAL_STATUS: "/catalogs/estado-civil",
    APPOINTMENT_STATUS: "/catalogs/estado-cita",
    APPOINTMENT_TYPES: "/catalogs/tipo-cita",
    CONSULTATION_STATUS: "/catalogs/estado-consulta",
    CODE_STATUS: "/catalogs/estado-codigo",
  },
  CLINICS: "/clinics",
  APPOINTMENTS: {
    CITAS: "/appointments/citas",
    CONSULTAS: "/appointments/consultas",
    EPISODIOS: "/appointments/episodios",
  },
  FILES: "/files",
  INSURANCE: {
    COMPANIES: "/insurance/companies",
    POLICIES: "/insurance/policies",
  },
  NOTIFICATIONS: {
    NOTIFICATIONS: "/notifications",
    ACCESS_CODES: "/notifications/access-codes",
  },
  AUDIT: "/audit",
};
