// ⏳ Componente de Loading
import React from "react";
import "./Loading.css";

const Loading = ({
  message = "Cargando...",
  size = "medium",
  type = "spinner",
  fullScreen = false,
}) => {
  const containerClass = fullScreen
    ? "loading-fullscreen"
    : "loading-container";
  const spinnerClass = `loading-spinner loading-${size} loading-${type}`;

  return (
    <div className={containerClass}>
      <div className={spinnerClass}>
        {type === "spinner" && "⏳"}
        {type === "dots" && "⏳"}
        {type === "pulse" && "💫"}
      </div>
      <p className="loading-message">{message}</p>
    </div>
  );
};

export default Loading;
