import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generatePendientesPDF = (pendientes) => {
  try {
    const doc = new jsPDF();
    const dateStr = new Date().toLocaleDateString('es-CR');
    const timeStr = new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' });

    // Configuración de fuentes y colores
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(26, 54, 93); // Navy blue

    // Título
    doc.text("Reporte de SINPE Móvil Pendientes", 14, 22);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text(`Transportes Los Zarcereños - Generado el ${dateStr} a las ${timeStr}`, 14, 30);
    
    doc.setDrawColor(200);
    doc.line(14, 35, 196, 35);

    // Tabla de datos
    const tableColumn = ["Fecha", "N° Guía", "Cliente", "Monto", "Recibido por"];
    const tableRows = [];

    pendientes.forEach(p => {
      const rowData = [
        new Date(p.date).toLocaleDateString('es-CR'),
        p.guide_number,
        p.client_name,
        `C. ${parseFloat(p.amount).toLocaleString('es-CR', { minimumFractionDigits: 2 })}`,
        p.received_by
      ];
      tableRows.push(rowData);
    });

    // Usar la función autoTable directamente para mejor compatibilidad con Vite/Vercel
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      headStyles: { 
        fillColor: [26, 54, 93], 
        textColor: [255, 255, 255],
        fontSize: 10,
        halign: 'center'
      },
      columnStyles: {
        3: { halign: 'right' }, // Monto
      },
      styles: { fontSize: 9, cellPadding: 3 },
      margin: { top: 40 }
    });

    // Pie de página
    const total = pendientes.reduce((sum, p) => sum + parseFloat(p.amount), 0);
    const finalY = doc.previousAutoTable ? doc.previousAutoTable.finalY : 40;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(`Total Pendiente: C. ${total.toLocaleString('es-CR', { minimumFractionDigits: 2 })}`, 196, (doc.lastAutoTable ? doc.lastAutoTable.finalY : finalY) + 10, { align: 'right' });

    // Guardar el PDF
    doc.save(`SINPE_Pendientes_${dateStr.replace(/\//g, '-')}.pdf`);
  } catch (error) {
    console.error("Error al generar PDF:", error);
    alert("Hubo un error al generar el PDF. Por favor, revisa la consola.");
  }
};
