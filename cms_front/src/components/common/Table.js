import React from "react";
import "./Table.css";

const Table = ({ columns, data, onEdit, onDelete, actions = true }) => {
  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>{column.header}</th>
            ))}
            {actions && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column, colIndex) => (
                  <td key={colIndex}>
                    {column.render
                      ? column.render(row[column.accessor], row)
                      : row[column.accessor]}
                  </td>
                ))}
                {actions && (
                  <td>
                    <div className="action-buttons">
                      {onEdit && (
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => onEdit(row)}
                        >
                          Editar
                        </button>
                      )}
                      {onDelete && (
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => onDelete(row)}
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length + (actions ? 1 : 0)}
                className="text-center"
              >
                No hay datos disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
