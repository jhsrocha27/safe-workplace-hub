import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Employee {
  id: string;
  name: string;
  role: string;
}

interface EmployeeSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  employees: Employee[];
}

export function EmployeeSelect({ value, onValueChange, employees }: EmployeeSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder="Selecione o colaborador" />
      </SelectTrigger>
      <SelectContent>
        {employees.map((employee) => (
          <SelectItem key={employee.id} value={employee.name}>
            {employee.name} - {employee.role}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}