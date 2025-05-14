import { useState, useEffect } from 'react';
import { Employee } from '@/services/types';
import { employeesService } from '@/services/storage-service';

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Carregar funcionários inicialmente
  useEffect(() => {
    loadEmployees();
    
    // Inscrever para atualizações em tempo real
    const unsubscribe = employeesService.subscribe(() => {
      loadEmployees();
    });

    // Limpar inscrição quando o componente for desmontado
    return () => {
      unsubscribe();
    };
  }, []);

  // Função para carregar funcionários
  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await employeesService.getAll();
      setEmployees(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao carregar funcionários'));
    } finally {
      setLoading(false);
    }
  };

  // Função para adicionar funcionário
  const addEmployee = async (employee: Omit<Employee, 'id' | 'created_at'>) => {
    try {
      const newEmployee = await employeesService.create(employee);
      setEmployees([...employees, newEmployee]);
      return newEmployee;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Erro ao adicionar funcionário');
    }
  };

  // Função para atualizar funcionário
  const updateEmployee = async (id: number, employee: Partial<Employee>) => {
    try {
      const updatedEmployee = await employeesService.update(id, employee);
      setEmployees(employees.map(emp => emp.id === id ? updatedEmployee : emp));
      return updatedEmployee;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Erro ao atualizar funcionário');
    }
  };

  // Função para deletar funcionário
  const deleteEmployee = async (id: number) => {
    try {
      await employeesService.delete(id);
      setEmployees(employees.filter(emp => emp.id !== id));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Erro ao deletar funcionário');
    }
  };

  return {
    employees,
    loading,
    error,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    reloadEmployees: loadEmployees
  };
}