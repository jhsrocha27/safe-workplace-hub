import { Employee } from './types';
import { employeesService } from './supabase-service';

export const employeeService = {
  async getAll(): Promise<Employee[]> {
    return employeesService.getAll();
  },

  async create(employee: Omit<Employee, 'id' | 'created_at'>): Promise<Employee> {
    return employeesService.create(employee);
  },

  async update(id: number, employee: Partial<Employee>): Promise<Employee> {
    return employeesService.update(id, employee);
  },

  async delete(id: number): Promise<void> {
    return employeesService.delete(id);
  },

  async getByDepartment(department: string): Promise<Employee[]> {
    const query = await employeesService.query();
    const { data, error } = await query
      .select('*')
      .eq('department', department);
    
    if (error) throw error;
    return data;
  },

  async getByStatus(status: string): Promise<Employee[]> {
    const query = await employeesService.query();
    const { data, error } = await query
      .select('*')
      .eq('status', status);
    
    if (error) throw error;
    return data;
  }
};