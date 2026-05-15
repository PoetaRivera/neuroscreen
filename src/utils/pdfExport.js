/**
 * Exporta resultados a PDF (formato texto plano, ligero, sin dependencia de canvas).
 * @param {Array} results - Array de objetos { testTitle, category, total, maxScore, description, dimensions }
 */
export async function exportResultsToPDF(results) {
  const { default: jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  const today = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  let y = 20;

  // Header
  doc.setFontSize(20);
  doc.setTextColor(30, 41, 59);
  doc.text('EvaluMind', 20, y);
  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(107, 114, 128);
  doc.text('Perfil de screening orientativo', 20, y);
  y += 6;
  doc.text(`Fecha: ${today}`, 20, y);
  y += 12;

  // Línea separadora
  doc.setDrawColor(226, 232, 240);
  doc.line(20, y, 190, y);
  y += 10;

  // Resultados por test
  results.forEach((result) => {
    if (y > 250) {
      doc.addPage();
      y = 20;
    }

    // Título del test
    doc.setFontSize(13);
    doc.setTextColor(30, 41, 59);
    doc.setFont(undefined, 'bold');
    doc.text(result.testTitle, 20, y);
    y += 7;

    // Categoría
    doc.setFont(undefined, 'normal');
    doc.setFontSize(11);
    doc.setTextColor(79, 70, 229);
    doc.text(`Categoría: ${result.category}`, 20, y);
    y += 6;

    // Puntuación
    doc.setTextColor(55, 65, 81);
    doc.text(`Puntuación: ${result.total} de ${result.maxScore}`, 20, y);
    y += 6;

    // Dimensiones
    if (result.dimensions && result.dimensions.length > 0) {
      doc.setFontSize(10);
      doc.setTextColor(107, 114, 128);
      result.dimensions.forEach((dim) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        const pct = dim.max > 0 ? Math.round((dim.score / dim.max) * 100) : 0;
        doc.text(`  ${dim.label}: ${dim.score}/${dim.max} (${pct}%)`, 20, y);
        y += 5;
      });
    }

    y += 6;

    // Descripción (resumida)
    if (result.description) {
      doc.setFontSize(9);
      doc.setTextColor(75, 85, 99);
      const descLines = doc.splitTextToSize(result.description, 170);
      descLines.forEach((line) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 20, y);
        y += 4;
      });
      y += 4;
    }
  });

  // Disclaimer
  y += 4;
  if (y > 250) {
    doc.addPage();
    y = 20;
  }
  doc.setDrawColor(226, 232, 240);
  doc.line(20, y, 190, y);
  y += 8;

  doc.setFontSize(8);
  doc.setTextColor(156, 163, 175);
  const disclaimer =
    'Este documento es orientativo y no constituye un diagnóstico médico ni psicológico. ' +
    'EvaluMind es una herramienta de screening anónima y gratuita. ' +
    'Consulta siempre con un profesional de la salud mental.';
  const discLines = doc.splitTextToSize(disclaimer, 170);
  discLines.forEach((line) => {
    doc.text(line, 20, y);
    y += 4;
  });

  doc.save(`evalumind-perfil-${new Date().toISOString().split('T')[0]}.pdf`);
}

/**
 * Exporta el perfil completo (todos los tests de la sesión) a PDF.
 */
export function exportFullProfileToPDF(profileData) {
  return exportResultsToPDF(profileData);
}
