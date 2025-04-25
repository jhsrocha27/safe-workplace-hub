
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ScheduleTrainingRecycleDialogProps {
  employeeName: string;
  trainingTitle: string;
  onSchedule?: (date: Date, instructor: string) => void;
  currentRecyclingDate?: Date;
  expirationDate?: Date;
}

export function ScheduleTrainingRecycleDialog({ employeeName, trainingTitle, onSchedule, currentRecyclingDate, expirationDate }: ScheduleTrainingRecycleDialogProps) {
  const [open, setOpen] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [instructor, setInstructor] = useState('');
  
  const handleSchedule = () => {
    if (!scheduledDate) {
      toast({
        title: "Data obrigatória",
        description: "Por favor, selecione uma data para a reciclagem.",
        variant: "destructive"
      });
      return;
    }
    
    // Ajusta a data para considerar o fuso horário local
    const [year, month, day] = scheduledDate.split('-').map(Number);
    const recyclingDate = new Date(year, month - 1, day);
    
    // Notify parent component about the new scheduled date and instructor
    if (onSchedule) {
      onSchedule(recyclingDate, instructor);
    }

    toast({
      title: "Reciclagem agendada",
      description: `Reciclagem de ${trainingTitle} para ${employeeName} agendada com sucesso para ${recyclingDate.toLocaleDateString('pt-BR')}.`,
    });
    
    setOpen(false);
    // Reset form
    setScheduledDate('');
    setInstructor('');
  };
  
  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        Agendar Reciclagem
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Agendar Reciclagem de Treinamento</DialogTitle>
            <DialogDescription>
              Agende uma reciclagem para o treinamento vencido ou a vencer.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Funcionário
              </label>
              <Input value={employeeName} readOnly disabled />
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Treinamento
              </label>
              <Input value={trainingTitle} readOnly disabled />
            </div>
            
            <div className="grid gap-2">
              {currentRecyclingDate && (
                <div className="mb-2">
                  <label className="text-sm text-gray-500">Data de Reciclagem Atual:</label>
                  <div className="font-medium">{currentRecyclingDate.toLocaleDateString('pt-BR')}</div>
                </div>
              )}
              {expirationDate && (
                <div className="mb-2">
                  <label className="text-sm text-gray-500">Data de Vencimento:</label>
                  <div className="font-medium">{expirationDate.toLocaleDateString('pt-BR')}</div>
                </div>
              )}
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Nova Data da Reciclagem
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input 
                  type="date" 
                  className="pl-10"
                  min={new Date().toISOString().split('T')[0]} 
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Instrutor
              </label>
              <Input 
                placeholder="Nome do instrutor" 
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleSchedule} className="bg-white hover:bg-white/90 text-black border border-gray-200">
              Confirmar Agendamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
