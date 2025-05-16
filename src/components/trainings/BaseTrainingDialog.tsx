import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from 'lucide-react';

interface BaseTrainingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  children?: React.ReactNode;
  onCancel?: () => void;
  onConfirm: () => void;
  confirmText?: string;
  loading?: boolean;
}

export function BaseTrainingDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  onCancel,
  onConfirm,
  confirmText = 'Confirmar Agendamento',
  loading = false
}: BaseTrainingDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {children}
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onCancel || (() => onOpenChange(false))}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button 
            onClick={onConfirm}
            className="bg-[#1A4235] hover:bg-[#1A4235]/90 text-white"
            disabled={loading}
          >
            {loading ? 'Processando...' : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export function FormField({ label, children, disabled }: FormFieldProps) {
  return (
    <div className="grid gap-2">
      <label className={`text-sm font-medium leading-none ${disabled ? 'opacity-70' : ''}`}>
        {label}
      </label>
      {children}
    </div>
  );
}

interface DateFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  minDate?: string;
}

export function DateField({ label, value, onChange, disabled, minDate }: DateFieldProps) {
  return (
    <FormField label={label} disabled={disabled}>
      <div className="relative">
        <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
        <Input 
          type="date" 
          className="pl-10"
          min={minDate || new Date().toISOString().split('T')[0]}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        />
      </div>
    </FormField>
  );
}