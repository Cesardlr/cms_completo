import jsPDF from "jspdf";
import "jspdf-autotable";

export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) {
    alert("No hay datos para exportar");
    return;
  }

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          // Escape commas and quotes in values
          if (
            typeof value === "string" &&
            (value.includes(",") || value.includes('"'))
          ) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        })
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = (data, filename, title) => {
  if (!data || data.length === 0) {
    alert("No hay datos para exportar");
    return;
  }

  const doc = new jsPDF();

  // Add title
  doc.setFontSize(18);
  doc.text(title || "Reporte", 14, 22);

  // Add date
  doc.setFontSize(10);
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 30);

  // Prepare table data
  const headers = Object.keys(data[0]);
  const rows = data.map((row) => headers.map((header) => row[header]));

  // Add table
  doc.autoTable({
    head: [headers],
    body: rows,
    startY: 35,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [37, 99, 235] },
  });

  doc.save(`${filename}.pdf`);
};
