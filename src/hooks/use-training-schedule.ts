import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

interface TrainingScheduleFormData {
  employeeName: string;
  role?: string;
  scheduledDate: string;
  instructor: string;
}

interface UseTrainingScheduleProps {
  onSchedule?: (data: {
    employeeName?: string;
    role?: string;
    scheduledDate: Date;
    instructor: string;
  }) => void;
  initialData?: Partial<TrainingScheduleFormData>;
}

export function useTrainingSchedule({ onSchedule, initialData = {} }: UseTrainingScheduleProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<TrainingScheduleFormData>({
    employeeName: initialData.employeeName || '',
    role: initialData.role || '',
    scheduledDate: initialData.scheduledDate || '',
    instructor: initialData.instructor || ''
  });

  const handleSchedule = () => {
    if (!formData.scheduledDate || !formData.instructor) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
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

    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      employeeName: initialData.employeeName || '',
      role: initialData.role || '',
      scheduledDate: '',
      instructor: ''
    });
  };

  const updateField = (field: keyof TrainingScheduleFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return {
    open,
    setOpen,
    formData,
    updateField,
    handleSchedule,
    resetForm
  };
}