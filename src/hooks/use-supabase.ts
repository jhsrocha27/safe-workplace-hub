import { useState } from 'react';
import { useToast } from './use-toast';
import { ppeItemService, ppeDeliveryService } from '@/features/ppe/services/ppe-service';
import { Employee, PPEItem, PPEDelivery } from '@/services/types';
import { employeesService } from '@/services/supabase-service';
import { supabase } from '@/config/supabase'; // Import directly from the config file

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
        const data = await employeesService.getAll();
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
        const data = await employeesService.create(employee);
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
        const data = await employeesService.update(id, employee);
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
        await employeesService.delete(id);
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
        // Using the direct supabase client instead of query()
        const { data, error } = await supabase
          .from('ppe_deliveries')
          .select('*')
          .eq('employee_id', employeeId);
          
        if (error) throw error;
        return data ? data.map(convertToPPEDelivery) : [];
      } catch (err) {
        handleError(err as Error);
        return [];
      } finally {
        setLoading(false);
      }
    },
  };
  
  // Helper function for converting from DB format to our app format
  const convertToPPEDelivery = (delivery: any): PPEDelivery => ({
    id: delivery.id,
    employee_id: delivery.employee_id,
    employeeName: delivery.employeeName,
    position: delivery.position,
    department: delivery.department,
    ppe_id: delivery.ppe_id,
    ppeName: delivery.ppeName,
    delivery_date: delivery.delivery_date,
    expiryDate: delivery.expiryDate,
    quantity: delivery.quantity || 1,
    status: delivery.status,
    signature: delivery.signature,
    created_at: delivery.created_at
  });

  return {
    loading,
    error,
    employees,
    ppeItems,
    ppeDeliveries,
  };
}
