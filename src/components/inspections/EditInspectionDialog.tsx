import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { CalendarIcon, Pencil } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EditInspectionDialogProps {
  inspection: {
    id: string;
    title: string;
    type: 'safety' | 'environmental' | 'quality';
    status: 'pending' | 'in_progress' | 'completed';
    date: Date;
  };
  onUpdate: (id: string, updates: { date?: Date; status?: 'pending' | 'in_progress' | 'completed' }) => void;
  onDelete: (id: string) => void;
}

export function EditInspectionDialog({ inspection, onUpdate, onDelete }: EditInspectionDialogProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<Date>(inspection.date);
  const [status, setStatus] = useState(inspection.status);

  const handleUpdate = () => {
    onUpdate(inspection.id, { date, status });
    setIsOpen(false);
    toast({
      title: 'Inspeção atualizada',
      description: 'As alterações foram salvas com sucesso.',
    });
  };

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja remover esta inspeção?')) {
      onDelete(inspection.id);
      setIsOpen(false);
      toast({
        title: 'Inspeção removida',
        description: 'A inspeção foi removida com sucesso.',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          title="Editar inspeção"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Inspeção</DialogTitle>
          <DialogDescription>
            {inspection.title}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Data de Agendamento */}
          <div className="grid gap-2">
            <Label>Data de Agendamento</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  initialFocus
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Status */}
          <div className="grid gap-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="in_progress">Em Progresso</SelectItem>
                <SelectItem value="completed">Concluída</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="flex justify-between items-center">
          <Button
            variant="destructive"
            onClick={handleDelete}
          >
            Remover
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleUpdate}>
              Salvar Alterações
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}