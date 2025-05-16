import { useCallback, useMemo } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { PPEDelivery, PPEItem } from '@/services/types';
import { ppeItemService, ppeDeliveryService } from '@/features/ppe/services/ppe-service';

type MutationState = {
  loading: boolean;
  createPPE: (ppe: Omit<PPEItem, 'id' | 'created_at'>) => void;
  updatePPE: (id: number, data: Partial<PPEItem>) => void;
  deletePPE: (id: number) => void;
  createDelivery: (delivery: Omit<PPEDelivery, 'id' | 'created_at'>) => void;
  updateDelivery: (id: number, data: Partial<PPEDelivery>) => void;
  deleteDelivery: (id: number) => void;
};

export function usePPEMutations(
  resetForm: () => void,
  setIsNewPPEDialogOpen: (open: boolean) => void,
  setIsDeliveryDialogOpen: (open: boolean) => void,
  setIsEditPPEDialogOpen: (open: boolean) => void,
  setIsDeletePPEDialogOpen: (open: boolean) => void,
  setSelectedPPEItem: (item: PPEItem | null) => void
): MutationState {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createPPEMutation = useMutation({
    mutationFn: ppeItemService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ppeItems'] });
      resetForm();
      setIsNewPPEDialogOpen(false);
      // Removida notificação de sucesso ao cadastrar EPI
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao cadastrar",
        description: error.message || "Ocorreu um erro ao cadastrar o EPI.",
        variant: "destructive"
      });
    }
  });

  const updatePPEMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<PPEItem> }) => 
      ppeItemService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ppeItems'] });
      setIsEditPPEDialogOpen(false);
      // Removida notificação de sucesso ao atualizar EPI
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar",
        description: error.message || "Ocorreu um erro ao atualizar o EPI.",
        variant: "destructive"
      });
    }
  });

  const deletePPEMutation = useMutation({
    mutationFn: ppeItemService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ppeItems'] });
      setIsDeletePPEDialogOpen(false);
      setSelectedPPEItem(null);
      // Removida notificação de sucesso ao excluir EPI
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao excluir",
        description: error.message || "Ocorreu um erro ao excluir o EPI.",
        variant: "destructive"
      });
    }
  });

  const createDeliveryMutation = useMutation({
    mutationFn: ppeDeliveryService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ppeDeliveries'] });
      resetForm();
      setIsDeliveryDialogOpen(false);
      // Removida notificação de sucesso ao registrar entrega
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao registrar entrega",
        description: error.message || "Ocorreu um erro ao registrar a entrega.",
        variant: "destructive"
      });
    }
  });

  const updateDeliveryMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<PPEDelivery> }) => 
      ppeDeliveryService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ppeDeliveries'] });
      // Removida notificação de sucesso ao atualizar entrega
    }
  });

  const deleteDeliveryMutation = useMutation({
    mutationFn: ppeDeliveryService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ppeDeliveries'] });
      // Removida notificação de sucesso ao excluir entrega
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao excluir entrega",
        description: error.message || "Ocorreu um erro ao excluir a entrega.",
        variant: "destructive"
      });
    }
  });

  const createPPE = useCallback(
    (ppe: Omit<PPEItem, 'id' | 'created_at'>) => {
      createPPEMutation.mutate(ppe);
    },
    [createPPEMutation]
  );

  const updatePPE = useCallback(
    (id: number, data: Partial<PPEItem>) => {
      updatePPEMutation.mutate({ id, data });
    },
    [updatePPEMutation]
  );

  const deletePPE = useCallback(
    (id: number) => {
      deletePPEMutation.mutate(id);
    },
    [deletePPEMutation]
  );

  const createDelivery = useCallback(
    (delivery: Omit<PPEDelivery, 'id' | 'created_at'>) => {
      createDeliveryMutation.mutate(delivery);
    },
    [createDeliveryMutation]
  );

  const updateDelivery = useCallback(
    (id: number, data: Partial<PPEDelivery>) => {
      updateDeliveryMutation.mutate({ id, data });
    },
    [updateDeliveryMutation]
  );

  const deleteDelivery = useCallback(
    (id: number) => {
      deleteDeliveryMutation.mutate(id);
    },
    [deleteDeliveryMutation]
  );

  const loading = useMemo(
    () =>
      createPPEMutation.isPending ||
      updatePPEMutation.isPending ||
      deletePPEMutation.isPending ||
      createDeliveryMutation.isPending ||
      updateDeliveryMutation.isPending ||
      deleteDeliveryMutation.isPending,
    [
      createPPEMutation.isPending,
      updatePPEMutation.isPending,
      deletePPEMutation.isPending,
      createDeliveryMutation.isPending,
      updateDeliveryMutation.isPending,
      deleteDeliveryMutation.isPending,
    ]
  );

  return {
    loading,
    createPPE,
    updatePPE,
    deletePPE,
    createDelivery,
    updateDelivery,
    deleteDelivery,
  };
}