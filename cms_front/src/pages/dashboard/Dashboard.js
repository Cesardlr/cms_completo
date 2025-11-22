import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";
import KPICard from "../../components/common/KPICard";
import Loading from "../../components/common/Loading";
import SystemStatus from "../../components/common/SystemStatus";
import dashboardService from "../../services/dashboardService";
import "./Dashboard.css";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [kpis, setKpis] = useState([]);
  const [charts, setCharts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getDashboardData();

      console.log("Dashboard data received:", data);

      // Transformar KPIs para el componente
      const kpiData = [
        {
          title: "Total Consultas",
          value: data.kpis.totalConsultas?.toString() || "0",
          icon: "📊",
          color: "primary",
          trend: 0,
        },
        {
          title: "Total Pacientes",
          value: data.kpis.totalPacientes?.toString() || "0",
          icon: "👥",
          color: "info",
          trend: 0,
        },
        {
          title: "Total Médicos",
          value: data.kpis.totalMedicos?.toString() || "0",
          icon: "👨‍⚕️",
          color: "warning",
          trend: 0,
        },
      ];

      setKpis(kpiData);
      setCharts(data.charts);

      console.log("Charts data:", data.charts);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      setError("Error al cargar los datos del dashboard");

      // Fallback a datos mock en caso de error
      const fallbackKpis = [
        {
          title: "Total Consultas",
          value: "0",
          icon: "📊",
          color: "primary",
          trend: 0,
        },
        {
          title: "Total Pacientes",
          value: "0",
          icon: "👥",
          color: "info",
          trend: 0,
        },
        {
          title: "Total Médicos",
          value: "0",
          icon: "👨‍⚕️",
          color: "warning",
          trend: 0,
        },
      ];
      setKpis(fallbackKpis);
    } finally {
      setLoading(false);
    }
  };

  // Función para formatear fechas del backend
  const formatMonthLabel = (dateString) => {
    if (!dateString) return "N/A";

    try {
      // Si ya es un string formateado como "Ene 2024", devolverlo tal como está
      if (
        typeof dateString === "string" &&
        /^[A-Za-z]{3}\s\d{4}$/.test(dateString)
      ) {
        return dateString;
      }

      // Si viene como string de fecha, convertir a objeto Date
      const date = new Date(dateString);

      // Verificar si la fecha es válida
      if (isNaN(date.getTime())) {
        console.warn("Invalid date format:", dateString);
        return dateString; // Si no es una fecha válida, devolver el string original
      }

      // Formatear como mes abreviado con año
      return date.toLocaleDateString("es-ES", {
        month: "short",
        year: "numeric",
      });
    } catch (error) {
      console.warn("Error formatting date:", dateString, error);
      return dateString; // Fallback al string original
    }
  };

  // Transformar datos de gráficos del backend - Solo consultas
  const consultationStatus = {
    labels: charts.consultasPorEstado?.map((item) => item.estado) || [
      "En Proceso",
      "Completadas",
    ],
    datasets: [
      {
        label: "Consultas",
        data: charts.consultasPorEstado?.map(
          (item) => parseInt(item.total) || 0
        ) || [0, 0],
        backgroundColor: "rgba(37, 99, 235, 0.8)",
      },
    ],
  };

  const activityByEntity = {
    labels: charts.actividadPorEntidad?.map((item) => item.entidad) || [
      "Usuarios",
      "Pacientes",
    ],
    datasets: [
      {
        label: "Actividad (30 días)",
        data: charts.actividadPorEntidad?.map(
          (item) => parseInt(item.total) || 0
        ) || [0, 0],
        backgroundColor: "rgba(139, 92, 246, 0.8)",
      },
    ],
  };

  const consultationGrowth = {
    labels: charts.crecimientoConsultas?.map((item) =>
      formatMonthLabel(item.mes)
    ) || ["Ene 24", "Feb 24", "Mar 24"],
    datasets: [
      {
        label: "Consultas Acumuladas",
        data: charts.crecimientoConsultas?.map(
          (item) => parseInt(item.total) || 0
        ) || [0, 0, 0],
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const topDoctors = {
    labels: charts.topMedicosConsultas?.map((item) => item.medico) || [
      "Dr. García",
      "Dra. Martínez",
    ],
    datasets: [
      {
        label: "Consultas",
        data: charts.topMedicosConsultas?.map(
          (item) => parseInt(item.total) || 0
        ) || [0, 0],
        backgroundColor: "rgba(245, 158, 11, 0.8)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          title: function (context) {
            // Mostrar la fecha completa en el tooltip
            return `Período: ${context[0].label}`;
          },
          label: function (context) {
            return `${context.dataset.label}: ${context.parsed.y}`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "Período",
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Cantidad",
        },
        beginAtZero: true,
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
      },
    },
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="page-header">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-description">Cargando datos...</p>
        </div>
        <Loading
          message="Cargando datos del sistema..."
          size="large"
          type="spinner"
        />
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-description">Vista general del sistema</p>
        {error && (
          <div className="alert alert-warning">
            ⚠️ {error}
            <button
              onClick={loadDashboardData}
              className="btn btn-sm btn-outline"
            >
              Reintentar
            </button>
          </div>
        )}
      </div>

      {/* System Status */}
      <SystemStatus />

      {/* KPIs */}
      <div className="kpi-grid">
        {kpis.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3 className="chart-title">Estados de Consulta</h3>
          <div className="chart-container">
            <Bar data={consultationStatus} options={chartOptions} />
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Actividad por Entidad (30 días)</h3>
          <div className="chart-container">
            <Bar data={activityByEntity} options={chartOptions} />
          </div>
        </div>

        <div className="chart-card chart-card-large">
          <h3 className="chart-title">
            Crecimiento Acumulado de Consultas (24 meses)
          </h3>
          <div className="chart-container">
            <Line data={consultationGrowth} options={chartOptions} />
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Top 5 Médicos por Consultas</h3>
          <div className="chart-container">
            <Bar data={topDoctors} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
