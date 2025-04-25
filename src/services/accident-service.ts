import { Accident } from './types';
import { accidentService as dataService } from './data-service';

export const accidentService = {
  async getAll(): Promise<Accident[]> {
    const accidents = dataService.getAll();
    return accidents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async create(accident: Omit<Accident, 'id' | 'created_at'>): Promise<Accident> {
    return dataService.create(accident);
  },

  async update(id: number, accident: Partial<Accident>): Promise<Accident> {
    const updatedAccident = dataService.update(id, accident);
    if (!updatedAccident) throw new Error('Acidente não encontrado');
    return updatedAccident;
  },

  async delete(id: number): Promise<void> {
    const success = dataService.delete(id);
    if (!success) throw new Error('Acidente não encontrado');
  },

  async getByEmployee(employeeId: number): Promise<Accident[]> {
    const accidents = dataService.getAll();
    return accidents
      .filter(accident => accident.employee_id === employeeId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async getBySeverity(severity: string): Promise<Accident[]> {
    const accidents = dataService.getAll();
    return accidents
      .filter(accident => accident.severity === severity)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
};