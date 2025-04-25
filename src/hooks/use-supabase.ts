import { useState } from 'react';
import { useToast } from './use-toast';
import { employeeService, ppeItemService, ppeDeliveryService } from '@/services/ppe-service';
import { Employee, PPEItem, PPEDelivery } from '@/services/types';

export function useSupabase() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleError = (error: Error) => {
    setError(error);
    toast({
      title: 'Erro',
      description: error.message,
      variant: 'destructive',
    });
  };

  const employees = {
    getAll: async () => {
      setLoading(true);
      try {
        const data = await employeeService.getAll();
        return data;
      } catch (err) {
        handleError(err as Error);
        return [];
      } finally {
        setLoading(false);
      }
    },

    create: async (employee: Omit<Employee, 'id' | 'created_at'>) => {
      setLoading(true);
      try {
        const data = await employeeService.create(employee);
        toast({
          title: 'Sucesso',
          description: 'Funcionário cadastrado com sucesso',
        });
        return data;
      } catch (err) {
        handleError(err as Error);
        return null;
      } finally {
        setLoading(false);
      }
    },

    update: async (id: number, employee: Partial<Employee>) => {
      setLoading(true);
      try {
        const data = await employeeService.update(id, employee);
        toast({
          title: 'Sucesso',
          description: 'Funcionário atualizado com sucesso',
        });
        return data;
      } catch (err) {
        handleError(err as Error);
        return null;
      } finally {
        setLoading(false);
      }
    },

    delete: async (id: number) => {
      setLoading(true);
      try {
        await employeeService.delete(id);
        toast({
          title: 'Sucesso',
          description: 'Funcionário excluído com sucesso',
        });
      } catch (err) {
        handleError(err as Error);
      } finally {
        setLoading(false);
      }
    },
  };

  const ppeItems = {
    getAll: async () => {
      setLoading(true);
      try {
        const data = await ppeItemService.getAll();
        return data;
      } catch (err) {
        handleError(err as Error);
        return [];
      } finally {
        setLoading(false);
      }
    },

    create: async (ppeItem: Omit<PPEItem, 'id' | 'created_at'>) => {
      setLoading(true);
      try {
        const data = await ppeItemService.create(ppeItem);
        toast({
          title: 'Sucesso',
          description: 'EPI cadastrado com sucesso',
        });
        return data;
      } catch (err) {
        handleError(err as Error);
        return null;
      } finally {
        setLoading(false);
      }
    },

    update: async (id: number, ppeItem: Partial<PPEItem>) => {
      setLoading(true);
      try {
        const data = await ppeItemService.update(id, ppeItem);
        toast({
          title: 'Sucesso',
          description: 'EPI atualizado com sucesso',
        });
        return data;
      } catch (err) {
        handleError(err as Error);
        return null;
      } finally {
        setLoading(false);
      }
    },

    delete: async (id: number) => {
      setLoading(true);
      try {
        await ppeItemService.delete(id);
        toast({
          title: 'Sucesso',
          description: 'EPI excluído com sucesso',
        });
      } catch (err) {
        handleError(err as Error);
      } finally {
        setLoading(false);
      }
    },
  };

  const ppeDeliveries = {
    getAll: async () => {
      setLoading(true);
      try {
        const data = await ppeDeliveryService.getAll();
        return data;
      } catch (err) {
        handleError(err as Error);
        return [];
      } finally {
        setLoading(false);
      }
    },

    create: async (delivery: Omit<PPEDelivery, 'id' | 'created_at'>) => {
      setLoading(true);
      try {
        const data = await ppeDeliveryService.create(delivery);
        toast({
          title: 'Sucesso',
          description: 'Entrega registrada com sucesso',
        });
        return data;
      } catch (err) {
        handleError(err as Error);
        return null;
      } finally {
        setLoading(false);
      }
    },

    update: async (id: number, delivery: Partial<PPEDelivery>) => {
      setLoading(true);
      try {
        const data = await ppeDeliveryService.update(id, delivery);
        toast({
          title: 'Sucesso',
          description: 'Entrega atualizada com sucesso',
        });
        return data;
      } catch (err) {
        handleError(err as Error);
        return null;
      } finally {
        setLoading(false);
      }
    },

    delete: async (id: number) => {
      setLoading(true);
      try {
        await ppeDeliveryService.delete(id);
        toast({
          title: 'Sucesso',
          description: 'Entrega excluída com sucesso',
        });
      } catch (err) {
        handleError(err as Error);
      } finally {
        setLoading(false);
      }
    },

    getByEmployee: async (employeeId: number) => {
      setLoading(true);
      try {
        const data = await ppeDeliveryService.getByEmployee(employeeId);
        return data;
      } catch (err) {
        handleError(err as Error);
        return [];
      } finally {
        setLoading(false);
      }
    },
  };

  return {
    loading,
    error,
    employees,
    ppeItems,
    ppeDeliveries,
  };
}