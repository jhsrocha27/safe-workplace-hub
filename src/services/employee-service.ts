import { Employee } from './types';
import { store } from './data-service';

export const employeeService = {
  async getAll(): Promise<Employee[]> {
    return store.employees;
  },

  async create(employee: Omit<Employee, 'id' | 'created_at'>): Promise<Employee> {
    const newEmployee = {
      ...employee,
      id: store.employees.length > 0 ? Math.max(...store.employees.map(e => e.id)) + 1 : 1,
      created_at: new Date().toISOString()
    } as Employee;
    
    store.employees.push(newEmployee);
    return newEmployee;
  },

  async update(id: number, employee: Partial<Employee>): Promise<Employee> {
    const index = store.employees.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Employee not found');
    
    store.employees[index] = { ...store.employees[index], ...employee };
    return store.employees[index];
  },

  async delete(id: number): Promise<void> {
    const index = store.employees.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Employee not found');
    
    store.employees.splice(index, 1);
  },

  async getByDepartment(department: string): Promise<Employee[]> {
    return store.employees.filter(e => e.department === department);
  },

  async getByStatus(status: string): Promise<Employee[]> {
    return store.employees.filter(e => e.status === status);
  }
};