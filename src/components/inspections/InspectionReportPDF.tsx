import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface InspectionReportPDFProps {
  inspection: {
    id: string;
    title: string;
    type: 'safety' | 'environmental' | 'quality';
    location: string;
    date: Date;
    inspector: string;
    findings: string[];
    report?: {
      generalObservations: string;
      nonConformities: string;
      correctiveActions: string;
      recommendations: string;
      images?: string[];
    };
  };
}

export function generateInspectionReportPDF({ inspection }: InspectionReportPDFProps) {
  const reportElement = document.createElement('div');
  reportElement.className = 'bg-white p-10';
  reportElement.innerHTML = `
    <div class="border-2 border-gray-200 p-10 relative" style="font-family: Arial, sans-serif;">
      <div class="text-center mb-10">
        <h1 class="text-3xl font-bold text-teal-800" style="letter-spacing: 1px; margin-bottom: 12px;">RELATÓRIO DE INSPEÇÃO</h1>
        <p class="text-xl font-semibold text-gray-700">${inspection.title}</p>
      </div>

      <div class="grid grid-cols-2 gap-6 mb-8" style="border: 1px solid #e5e7eb; padding: 16px; border-radius: 8px;">
        <div class="p-3" style="background-color: #f9fafb;">
          <p class="font-semibold text-gray-700 mb-1">Local:</p>
          <p class="text-gray-900">${inspection.location}</p>
        </div>
        <div class="p-3" style="background-color: #f9fafb;">
          <p class="font-semibold text-gray-700 mb-1">Data:</p>
          <p class="text-gray-900">${format(inspection.date, 'dd/MM/yyyy', { locale: ptBR })}</p>
        </div>
        <div class="p-3" style="background-color: #f9fafb;">
          <p class="font-semibold text-gray-700 mb-1">Tipo:</p>
          <p class="text-gray-900">${inspection.type === 'safety' ? 'Segurança' : 
              inspection.type === 'environmental' ? 'Ambiental' : 'Qualidade'}</p>
        </div>
        <div class="p-3" style="background-color: #f9fafb;">
          <p class="font-semibold text-gray-700 mb-1">Inspetor:</p>
          <p class="text-gray-900">${inspection.inspector}</p>
        </div>
      </div>

      ${inspection.findings.length > 0 ? `
        <div class="mb-8 p-4" style="background-color: #f9fafb; border-radius: 8px;">
          <h2 class="text-xl font-semibold mb-3 text-gray-800">Constatações:</h2>
          <ul class="list-disc list-inside space-y-2">
            ${inspection.findings.map(finding => `<li class="text-gray-700">${finding}</li>`).join('')}
          </ul>
        </div>
      ` : ''}

      ${inspection.report ? `
        <div class="space-y-8">
          ${inspection.report.images && inspection.report.images.length > 0 ? `
            <div class="p-4" style="background-color: #f9fafb; border-radius: 8px;">
              <h2 class="text-xl font-semibold mb-3 text-gray-800">Imagens da Inspeção:</h2>
              <div class="grid grid-cols-2 gap-4">
                ${inspection.report.images.map((image, index) => `
                  <div style="page-break-inside: avoid;">
                    <img src="${image}" alt="Imagem ${index + 1}" style="width: 100%; height: auto; border-radius: 4px; margin-bottom: 8px;" />
                    <p class="text-sm text-gray-600 text-center">Imagem ${index + 1}</p>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
          <div class="p-4" style="background-color: #f9fafb; border-radius: 8px;">
            <h2 class="text-xl font-semibold mb-3 text-gray-800">Observações Gerais:</h2>
            <p class="whitespace-pre-line text-gray-700 leading-relaxed">${inspection.report.generalObservations}</p>
          </div>

          ${inspection.report.nonConformities ? `
            <div class="p-4" style="background-color: #f9fafb; border-radius: 8px;">
              <h2 class="text-xl font-semibold mb-3 text-gray-800">Não Conformidades:</h2>
              <p class="whitespace-pre-line text-gray-700 leading-relaxed">${inspection.report.nonConformities}</p>
            </div>
          ` : ''}

          ${inspection.report.correctiveActions ? `
            <div class="p-4" style="background-color: #f9fafb; border-radius: 8px;">
              <h2 class="text-xl font-semibold mb-3 text-gray-800">Ações Corretivas:</h2>
              <p class="whitespace-pre-line text-gray-700 leading-relaxed">${inspection.report.correctiveActions}</p>
            </div>
          ` : ''}

          ${inspection.report.recommendations ? `
            <div class="p-4" style="background-color: #f9fafb; border-radius: 8px;">
              <h2 class="text-xl font-semibold mb-3 text-gray-800">Recomendações:</h2>
              <p class="whitespace-pre-line text-gray-700 leading-relaxed">${inspection.report.recommendations}</p>
            </div>
          ` : ''}
        </div>
      ` : ''}

      <div class="mt-20" style="display: flex; justify-content: space-around; margin-bottom: 40px; padding: 0 60px;">
        <div style="text-align: center; width: 200px;">
          <div style="height: 60px;"></div>
          <div style="width: 100%; border-top: 2px solid #9CA3AF; margin-bottom: 12px;" />
          <p style="font-size: 14px; color: #4B5563; font-weight: 500;">Inspetor Responsável</p>
        </div>
        <div style="text-align: center; width: 200px;">
          <div style="height: 60px;"></div>
          <div style="width: 100%; border-top: 2px solid #9CA3AF; margin-bottom: 12px;" />
          <p style="font-size: 14px; color: #4B5563; font-weight: 500;">Gestor da Área</p>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(reportElement);

  return html2canvas(reportElement, {
    scale: 1, // Reduz a escala para melhorar performance
    logging: false, // Desativa logs
    imageTimeout: 0, // Não espera por imagens
    useCORS: true, // Permite carregar imagens de outros domínios
    allowTaint: true, // Permite elementos com taint
    backgroundColor: '#ffffff'
  }).then(canvas => {
    document.body.removeChild(reportElement);
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
      precision: 2 // Reduz a precisão para melhorar performance
    });

    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, 'PNG', 0, 0, width, height);
    
    // Gerar o arquivo PDF como Blob
    const pdfBlob = pdf.output('blob');
    
    // Criar URL do arquivo
    const pdfUrl = URL.createObjectURL(pdfBlob);
    
    // Salvar o arquivo localmente
    const fileName = `relatorio_inspecao_${inspection.id}.pdf`;
    const downloadLink = document.createElement('a');
    downloadLink.href = pdfUrl;
    downloadLink.download = fileName;
    downloadLink.click();
    
    return pdfUrl;
  });
}