
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
}

export function ScheduleTrainingRecycleDialog({ employeeName, trainingTitle }: ScheduleTrainingRecycleDialogProps) {
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
    
    // Here you would typically save this to your backend
    toast({
      title: "Reciclagem agendada",
      description: `Reciclagem de ${trainingTitle} para ${employeeName} agendada com sucesso para ${new Date(scheduledDate).toLocaleDateString('pt-BR')}.`,
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
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Data da Reciclagem
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
            <Button onClick={handleSchedule} className="bg-safety-blue hover:bg-safety-blue/90">
              Confirmar Agendamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
