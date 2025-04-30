import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { InspectionReportDialog } from '@/components/inspections/InspectionReportDialog';

interface Inspection {
  id: string;
  title: string;
  type: 'safety' | 'environmental' | 'quality';
  location: string;
  date: Date;
  inspector: string;
  findings: string[];
  reportPdfUrl?: string;
  hasReport?: boolean;
  status: 'pending' | 'in_progress' | 'completed';
}

export function InspectionDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [inspection, setInspection] = useState<Inspection | null>(null);

  // TODO: Buscar dados da inspeção do backend usando o ID
  React.useEffect(() => {
    // Simular busca de dados
    const mockInspection: Inspection = {
      id: '1',
      title: 'Inspeção de Segurança',
      type: 'safety',
      location: 'Área de Produção',
      date: new Date(),
      inspector: 'João Silva',
      findings: ['Equipamento com manutenção vencida', 'Sinalização inadequada'],
      status: 'completed',
      hasReport: false
    };
    setInspection(mockInspection);
  }, [id]);

  const handleSaveReport = async (report: any) => {
    if (inspection) {
      // TODO: Implementar salvamento do relatório no backend
      setInspection({
        ...inspection,
        hasReport: true,
        reportPdfUrl: report.pdfUrl
      });
    }
  };

  if (!inspection) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => navigate('/inspecoes')}>
          Voltar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{inspection.title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Inspeção realizada em {format(inspection.date, 'dd/MM/yyyy', { locale: ptBR })}
              </p>
            </div>
            <Badge
              variant={inspection.status === 'completed' ? 'success' : 
                     inspection.status === 'pending' ? 'warning' : 
                     'info'}
            >
              {inspection.status === 'completed' ? 'Concluída' : 
               inspection.status === 'pending' ? 'Pendente' : 
               'Em Progresso'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium">Local</h3>
              <p>{inspection.location}</p>
            </div>
            <div>
              <h3 className="font-medium">Inspetor</h3>
              <p>{inspection.inspector}</p>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Constatações</h3>
            <ul className="list-disc list-inside space-y-1">
              {inspection.findings.map((finding, index) => (
                <li key={index}>{finding}</li>
              ))}
            </ul>
          </div>

          {inspection.status === 'completed' && (
            <div className="pt-4">
              <h3 className="font-medium mb-4">Relatório da Inspeção</h3>
              {inspection.hasReport ? (
                <Button
                  variant="outline"
                  onClick={() => window.open(inspection.reportPdfUrl, '_blank')}
                >
                  Visualizar PDF do Relatório
                </Button>
              ) : (
                <InspectionReportDialog
                  inspection={inspection}
                  onSaveReport={handleSaveReport}
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}