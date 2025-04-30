import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { generateInspectionReportPDF } from './InspectionReportPDF';
import { Progress } from '@/components/ui/progress';
import { ImageUpload } from '@/components/ui/image-upload';

interface InspectionReportDialogProps {
  inspection: {
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
  };
  onSaveReport: (report: {
    generalObservations: string;
    nonConformities: string;
    correctiveActions: string;
    recommendations: string;
    images: string[];
    pdfUrl?: string;
  }) => void;
}

export function InspectionReportDialog({ inspection, onSaveReport }: InspectionReportDialogProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [progress, setProgress] = useState(0);
  const [report, setReport] = useState({
    generalObservations: '',
    nonConformities: '',
    correctiveActions: '',
    recommendations: '',
    images: [] as string[],
  });

  const handleSubmit = async () => {
    if (!report.generalObservations.trim()) {
      toast({
        title: 'Campo obrigatório',
        description: 'Por favor, preencha as observações gerais.',
        variant: 'destructive',
      });
      return;
    }

    setIsGeneratingPDF(true);
    setProgress(0);
    
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 10, 90));
    }, 500);

    try {
      // Gerar PDF do relatório
      const pdfUrl = await generateInspectionReportPDF({
        inspection: {
          ...inspection,
          report: {
            ...report,
            images: report.images
          }
        }
      });

      // Atualizar a inspeção com o relatório e URL do PDF
      const updatedInspection = {
        ...inspection,
        hasReport: true,
        reportPdfUrl: pdfUrl,
        report: {
          ...report,
          pdfUrl
        }
      };

      // Salvar relatório com a URL do PDF
      onSaveReport({ ...report, pdfUrl });
      setProgress(100);
      setIsOpen(false);
      toast({
        title: 'Relatório salvo',
        description: 'O relatório da inspeção foi salvo e o PDF foi gerado com sucesso.',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao gerar o PDF do relatório.',
        variant: 'destructive'
      });
    } finally {
      clearInterval(progressInterval);
      setIsGeneratingPDF(false);
      setProgress(0);
    }

    // Reset form
    setReport({
      generalObservations: '',
      nonConformities: '',
      correctiveActions: '',
      recommendations: '',
      images: []
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => setIsOpen(true)}
        >
          Criar Relatório
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[800px] max-h-[90vh] overflow-y-auto">
        {!inspection.hasReport && (
          <>
            <DialogHeader>
              <DialogTitle>Relatório de Inspeção</DialogTitle>
              <DialogDescription>
                Registre as observações e conclusões da inspeção realizada.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-4">
              {/* Informações da Inspeção */}
              <div className="grid gap-2">
                <h4 className="font-medium">Informações da Inspeção</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Título</Label>
                    <Input value={inspection.title} readOnly />
                  </div>
                  <div>
                    <Label>Local</Label>
                    <Input value={inspection.location} readOnly />
                  </div>
                  <div>
                    <Label>Data</Label>
                    <Input value={format(inspection.date, 'dd/MM/yyyy', { locale: ptBR })} readOnly />
                  </div>
                  <div>
                    <Label>Inspetor</Label>
                    <Input value={inspection.inspector} readOnly />
                  </div>
                </div>
              </div>

              {/* Observações Gerais */}
              <div className="grid gap-2">
                <Label htmlFor="generalObservations" className="font-medium">
                  Observações Gerais*
                </Label>
                <Textarea
                  id="generalObservations"
                  placeholder="Descreva as observações gerais da inspeção..."
                  value={report.generalObservations}
                  onChange={(e) => setReport({ ...report, generalObservations: e.target.value })}
                  rows={4}
                />
              </div>

              {/* Não Conformidades */}
              <div className="grid gap-2">
                <Label htmlFor="nonConformities" className="font-medium">
                  Não Conformidades Encontradas
                </Label>
                <Textarea
                  id="nonConformities"
                  placeholder="Liste as não conformidades identificadas..."
                  value={report.nonConformities}
                  onChange={(e) => setReport({ ...report, nonConformities: e.target.value })}
                  rows={3}
                />
              </div>

              {/* Ações Corretivas */}
              <div className="grid gap-2">
                <Label htmlFor="correctiveActions" className="font-medium">
                  Ações Corretivas Sugeridas
                </Label>
                <Textarea
                  id="correctiveActions"
                  placeholder="Descreva as ações corretivas necessárias..."
                  value={report.correctiveActions}
                  onChange={(e) => setReport({ ...report, correctiveActions: e.target.value })}
                  rows={3}
                />
              </div>

              {/* Recomendações */}
              <div className="grid gap-2">
                <Label htmlFor="recommendations" className="font-medium">
                  Recomendações e Melhorias
                </Label>
                <Textarea
                  id="recommendations"
                  placeholder="Sugira recomendações e melhorias..."
                  value={report.recommendations}
                  onChange={(e) => setReport({ ...report, recommendations: e.target.value })}
                  rows={3}
                />
              </div>

              {/* Upload de Imagens */}
              <div className="grid gap-2">
                <Label className="font-medium">Imagens da Inspeção</Label>
                <ImageUpload
                  value={report.images}
                  onChange={(urls) => setReport({ ...report, images: urls })}
                  onError={() => {
                    toast({
                      title: 'Erro',
                      description: 'Ocorreu um erro ao fazer upload da imagem.',
                      variant: 'destructive'
                    });
                  }}
                />
              </div>

              {/* Barra de Progresso */}
              {isGeneratingPDF && (
                <div className="space-y-2">
                  <Label className="text-sm text-gray-500">Gerando PDF...</Label>
                  <Progress value={progress} className="w-full" />
                </div>
              )}
            </div>

            <DialogFooter className="flex justify-end items-center gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit}>Salvar Relatório</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}