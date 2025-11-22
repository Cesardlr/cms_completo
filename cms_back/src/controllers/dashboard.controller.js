const { query } = require("../config/database");

const getKPIs = async (req, res, next) => {
  try {
    // Obtener KPIs importantes usando consultas directas
    const kpi1 = await query("SELECT COUNT(*) as value FROM CONSULTA");
    const kpi2 = await query("SELECT COUNT(*) as value FROM PACIENTE");
    const kpi3 = await query("SELECT COUNT(*) as value FROM MEDICO");

    res.json({
      totalConsultas: parseInt(kpi1.rows[0].value) || 0,
      totalPacientes: parseInt(kpi2.rows[0].value) || 0,
      totalMedicos: parseInt(kpi3.rows[0].value) || 0,
    });
  } catch (error) {
    next(error);
  }
};

const getCharts = async (req, res, next) => {
  try {
    // Obtener todas las gráficas usando consultas directas - Solo consultas
    const chart1 = await query(`
      SELECT ec.nombre as estado, count(*) as total 
      FROM CONSULTA c 
      JOIN ESTADO_CONSULTA ec ON c.id_estado_consulta = ec.id 
      GROUP BY 1
    `);
    const chart2 = await query(`
      SELECT 'Consultas' as entidad, COUNT(*) as total FROM CONSULTA WHERE fecha_hora > CURRENT_DATE - INTERVAL '30 days'
      UNION ALL
      SELECT 'Pacientes' as entidad, COUNT(DISTINCT id) as total FROM PACIENTE WHERE id IN (SELECT DISTINCT id_paciente FROM CONSULTA WHERE fecha_hora > CURRENT_DATE - INTERVAL '30 days')
      UNION ALL
      SELECT 'Médicos' as entidad, COUNT(DISTINCT id) as total FROM MEDICO WHERE id IN (SELECT DISTINCT id_medico FROM CONSULTA WHERE fecha_hora > CURRENT_DATE - INTERVAL '30 days')
    `);
    const chart3 = await query(`
      WITH monthly AS (
        SELECT to_char(fecha_hora, 'YYYY-MM') as mes, count(*) as cnt
        FROM CONSULTA
        WHERE fecha_hora > CURRENT_DATE - INTERVAL '24 months'
        GROUP BY 1
      )
      SELECT mes, sum(cnt) OVER (ORDER BY mes) as total
      FROM monthly
      ORDER BY mes
    `);
    const chart4 = await query(`
      SELECT m.nombre as medico, count(*) as total
      FROM CONSULTA c
      LEFT JOIN CITA ci ON c.cita_id = ci.id
      LEFT JOIN MEDICO m ON (ci.medico_id = m.id OR c.id_medico = m.id)
      WHERE m.id IS NOT NULL
      GROUP BY 1
      ORDER BY 2 DESC
      LIMIT 5
    `);

    res.json({
      consultasPorEstado: chart1.rows,
      actividadPorEntidad: chart2.rows,
      crecimientoConsultas: chart3.rows,
      topMedicos: chart4.rows,
    });
  } catch (error) {
    next(error);
  }
};

const getDashboardData = async (req, res, next) => {
  try {
    // Obtener KPIs importantes usando consultas directas
    const kpi1 = await query("SELECT COUNT(*) as value FROM CONSULTA");
    const kpi2 = await query("SELECT COUNT(*) as value FROM PACIENTE");
    const kpi3 = await query("SELECT COUNT(*) as value FROM MEDICO");

    // Obtener gráficas usando consultas directas - Solo consultas
    const chart1 = await query(`
      SELECT ec.nombre as estado, count(*) as total 
      FROM CONSULTA c 
      JOIN ESTADO_CONSULTA ec ON c.id_estado_consulta = ec.id 
      GROUP BY 1
    `);
    const chart2 = await query(`
      SELECT 'Consultas' as entidad, COUNT(*) as total FROM CONSULTA WHERE fecha_hora > CURRENT_DATE - INTERVAL '30 days'
      UNION ALL
      SELECT 'Pacientes' as entidad, COUNT(DISTINCT id) as total FROM PACIENTE WHERE id IN (SELECT DISTINCT id_paciente FROM CONSULTA WHERE fecha_hora > CURRENT_DATE - INTERVAL '30 days')
      UNION ALL
      SELECT 'Médicos' as entidad, COUNT(DISTINCT id) as total FROM MEDICO WHERE id IN (SELECT DISTINCT id_medico FROM CONSULTA WHERE fecha_hora > CURRENT_DATE - INTERVAL '30 days')
    `);
    const chart3 = await query(`
      WITH monthly AS (
        SELECT to_char(fecha_hora, 'YYYY-MM') as mes, count(*) as cnt
        FROM CONSULTA
        WHERE fecha_hora > CURRENT_DATE - INTERVAL '24 months'
        GROUP BY 1
      )
      SELECT mes, sum(cnt) OVER (ORDER BY mes) as total
      FROM monthly
      ORDER BY mes
    `);
    const chart4 = await query(`
      SELECT m.nombre as medico, count(*) as total
      FROM CONSULTA c
      LEFT JOIN CITA ci ON c.cita_id = ci.id
      LEFT JOIN MEDICO m ON (ci.medico_id = m.id OR c.id_medico = m.id)
      WHERE m.id IS NOT NULL
      GROUP BY 1
      ORDER BY 2 DESC
      LIMIT 5
    `);

    res.json({
      kpis: {
        totalConsultas: parseInt(kpi1.rows[0].value) || 0,
        totalPacientes: parseInt(kpi2.rows[0].value) || 0,
        totalMedicos: parseInt(kpi3.rows[0].value) || 0,
      },
      charts: {
        consultasPorEstado: chart1.rows,
        actividadPorEntidad: chart2.rows,
        crecimientoConsultas: chart3.rows,
        topMedicos: chart4.rows,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getKPIs,
  getCharts,
  getDashboardData,
};
