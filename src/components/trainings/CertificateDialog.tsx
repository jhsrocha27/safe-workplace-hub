import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { EmployeeSelect } from './EmployeeSelect';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface CertificateDialogProps {
  trainingTitle: string;
  regulation: string;
  duration: string;
}

interface Employee {
  id: string;
  name: string;
  role: string;
}

export function CertificateDialog({ trainingTitle, regulation, duration }: CertificateDialogProps) {
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const employees: Employee[] = [
    { id: 'E001', name: 'João Silva', role: 'Eletricista' },
    { id: 'E002', name: 'Maria Souza', role: 'Técnico de Manutenção' },
    { id: 'E003', name: 'Carlos Ferreira', role: 'Operador de Produção' },
    { id: 'E004', name: 'Ana Oliveira', role: 'Brigadista' },
    { id: 'E005', name: 'Pedro Santos', role: 'Membro da CIPA' },
  ];

  const generatePDF = async () => {
    const certificateElement = document.getElementById('certificate-template');
    if (!certificateElement) return;

    const canvas = await html2canvas(certificateElement);
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, 'PNG', 0, 0, width, height);
    pdf.save(`certificado_${selectedEmployee.replace(' ', '_')}.pdf`);
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Certificados
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Gerar Certificado</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="w-full">
            <label className="text-sm font-medium">Selecione o Funcionário</label>
            <EmployeeSelect
              value={selectedEmployee}
              onValueChange={setSelectedEmployee}
              employees={employees}
            />
          </div>

          {selectedEmployee && (
            <div className="bg-white p-8" id="certificate-template">
              <div className="border-8 border-green-100 p-8 relative">
                <div className="absolute top-4 right-4">
                  <img src="/tecsafe-logo.svg" alt="Logo" className="w-16 h-16" />
                </div>
                <h1 className="text-4xl font-bold text-center text-teal-800 mb-8">CERTIFICADO</h1>
                <div className="text-lg text-center space-y-6">
                  <p>
                    A Empresa <span className="font-bold">TecSafe</span> certifica que
                    <span className="font-bold"> {selectedEmployee}</span>, participou do treinamento
                    de <span className="font-bold">{trainingTitle}</span>, realizado no período de
                    {format(new Date(), 'dd \'à\' dd \'de\' MMMM \'de\' yyyy', { locale: ptBR })}.
                  </p>
                  <p>
                    Carga horária: <span className="font-bold">{duration}</span><br />
                    Norma regulamentadora: <span className="font-bold">{regulation}</span>
                  </p>
                </div>
                <div className="mt-16 flex justify-between items-end">
                  <div className="text-center">
                    <div className="w-48 border-t border-gray-400" />
                    <p className="text-sm mt-2">Instrutor</p>
                  </div>
                  <div className="text-center">
                    <div className="w-48 border-t border-gray-400" />
                    <p className="text-sm mt-2">Participante</p>
                  </div>
                  <div className="text-center">
                    <div className="w-48 border-t border-gray-400" />
                    <p className="text-sm mt-2">Coordenador</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedEmployee && (
            <div className="flex justify-end">
              <Button onClick={generatePDF}>Gerar PDF</Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}