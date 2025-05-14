import { Employee } from './types';
import { storageService } from './storage-service';

export const employeeService = {
  async getAll(): Promise<Employee[]> {
    return storageService.getAll('employees');
  },

  async create(employee: Omit<Employee, 'id' | 'created_at'>): Promise<Employee> {
    return storageService.create('employees', employee);
  },

  async update(id: number, employee: Partial<Employee>): Promise<Employee> {
    return storageService.update('employees', id, employee);
  },

  async delete(id: number): Promise<void> {
    return storageService.delete('employees', id);
  },

  async getByDepartment(department: string): Promise<Employee[]> {
    const employees = await storageService.getAll('employees');
    return employees.filter(emp => emp.department === department);
  },

  async getByStatus(status: string): Promise<Employee[]> {
    const employees = await storageService.getAll('employees');
    return employees.filter(emp => emp.status === status);
  }
};