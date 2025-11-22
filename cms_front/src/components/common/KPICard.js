import React from "react";
import "./KPICard.css";

const KPICard = ({ title, value, icon, color = "primary", trend }) => {
  return (
    <div className={`kpi-card kpi-${color}`}>
      <div className="kpi-header">
        <div className="kpi-info">
          <p className="kpi-title">{title}</p>
          <h3 className="kpi-value">{value}</h3>
          {trend && (
            <span
              className={`kpi-trend ${trend > 0 ? "positive" : "negative"}`}
            >
              {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
            </span>
          )}
        </div>
        {icon && <div className="kpi-icon">{icon}</div>}
      </div>
    </div>
  );
};

export default KPICard;
