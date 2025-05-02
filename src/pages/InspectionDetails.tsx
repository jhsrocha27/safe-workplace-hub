
import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { InspectionReportDialog } from '@/components/inspections/InspectionReportDialog';
import { useErrorHandler } from '@/hooks/use-error-handler';

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
  const location = useLocation();
  const [inspection, setInspection] = useState<Inspection | null>(
    location.state?.inspection || null
  );
  const { withErrorHandling, loading } = useErrorHandler();

  // Fetch inspection data only if not available in location state
  React.useEffect(() => {
    if (!inspection) {
      const fetchInspection = async () => {
        await withErrorHandling(async () => {
          // Mock data fetch - would be an API call in a real app
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
        }, "Erro ao carregar detalhes da inspeção");
      };
      
      fetchInspection();
    }
  }, [id, inspection, withErrorHandling]);

  const handleSaveReport = async (report: any) => {
    if (inspection) {
      // TODO: Implement report saving to the backend
      setInspection({
        ...inspection,
        hasReport: true,
        reportPdfUrl: report.pdfUrl
      });
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Carregando...</div>;
  }

  if (!inspection) {
    return <div className="flex justify-center items-center h-64">Inspeção não encontrada</div>;
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'completed';
      case 'pending': return 'pending';
      case 'in_progress': return 'inProgress';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Concluída';
      case 'pending': return 'Pendente';
      case 'in_progress': return 'Em Progresso';
      default: return status;
    }
  };

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
            <Badge variant={getStatusVariant(inspection.status)}>
              {getStatusLabel(inspection.status)}
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
