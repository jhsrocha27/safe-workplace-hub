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
import { EmployeeSelect } from './EmployeeSelect';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ScheduleTrainingDialogProps {
  trainingId: string;
  trainingTitle: string;
  targetRoles: string[];
  onSchedule?: (data: {
    employeeName: string;
    role: string;
    scheduledDate: Date;
    instructor: string;
  }) => void;
}

interface Employee {
  id: string;
  name: string;
  role: string;
}

export function ScheduleTrainingDialog({ 
  trainingId, 
  trainingTitle, 
  targetRoles,
  onSchedule 
}: ScheduleTrainingDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    employeeName: '',
    role: '',
    scheduledDate: '',
    instructor: ''
  });

  // Lista de funcionários cadastrados
  const employees: Employee[] = [
    { id: 'E001', name: 'João Silva', role: 'Eletricista' },
    { id: 'E002', name: 'Maria Souza', role: 'Técnico de Manutenção' },
    { id: 'E003', name: 'Carlos Ferreira', role: 'Operador de Produção' },
    { id: 'E004', name: 'Ana Oliveira', role: 'Brigadista' },
    { id: 'E005', name: 'Pedro Santos', role: 'Membro da CIPA' }
  ];

  const handleSchedule = () => {
    if (!formData.employeeName || !formData.role || !formData.scheduledDate || !formData.instructor) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }
    
    const scheduleData = {
      employeeName: formData.employeeName,
      role: formData.role,
      scheduledDate: new Date(formData.scheduledDate),
      instructor: formData.instructor
    };

    if (onSchedule) {
      onSchedule(scheduleData);
    }

    toast({
      title: "Treinamento agendado",
      description: `Treinamento ${trainingTitle} agendado com sucesso para ${scheduleData.employeeName}.`,
    });
    
    setOpen(false);
    setFormData({
      employeeName: '',
      role: '',
      scheduledDate: '',
      instructor: ''
    });
  };
  
  return (
    <>
      <Button onClick={() => setOpen(true)} className="bg-[#1A4235] hover:bg-[#1A4235]/90 text-white">
        Agendar
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Agendar Treinamento</DialogTitle>
            <DialogDescription>
              Agende um novo treinamento para um colaborador.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium leading-none">
                Treinamento
              </label>
              <Input value={trainingTitle} readOnly disabled />
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium leading-none">
                Nome do Colaborador
              </label>
              <EmployeeSelect
                value={formData.employeeName}
                onValueChange={(value) => {
                  const selectedEmployee = employees.find(emp => emp.name === value);
                  setFormData({
                    ...formData,
                    employeeName: value,
                    role: selectedEmployee?.role || ''
                  });
                }}
                employees={employees}
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium leading-none">
                Função
              </label>
              <Select 
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a função" />
                </SelectTrigger>
                <SelectContent>
                  {targetRoles.map((role) => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium leading-none">
                Data do Treinamento
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input 
                  type="date" 
                  className="pl-10"
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium leading-none">
                Instrutor
              </label>
              <Input 
                placeholder="Nome do instrutor"
                value={formData.instructor}
                onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button 
              onClick={handleSchedule} 
              className="bg-[#1A4235] hover:bg-[#1A4235]/90 text-white"
            >
              Confirmar Agendamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}