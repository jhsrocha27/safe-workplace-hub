
import { useToast } from "@/hooks/use-toast";
import { usePPEForm } from '@/hooks/use-ppe-form';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { PPEItem, PPEDelivery } from '@/services/types';
import { ppeItemService, ppeDeliveryService } from '@/features/ppe/services/ppe-service';
import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { usePPEDialogs } from './use-ppe-dialogs';
import { usePPEFilters } from './use-ppe-filters';
import { usePPEMutations } from './use-ppe-mutations';

export function usePPEManagement() {
  const { toast } = useToast();
  const { formData, setField, resetForm, validateForm, errors, isValid } = usePPEForm();
  const { withErrorHandling, loading: operationLoading } = useErrorHandler();
  const [selectedDelivery, setSelectedDelivery] = useState<PPEDelivery | null>(null);
  const [selectedPPEItem, setSelectedPPEItem] = useState<PPEItem | null>(null);

  // Consultas React Query
  const { data: deliveries = [], isLoading: isLoadingDeliveries } = useQuery({
    queryKey: ['ppeDeliveries'],
    queryFn: ppeDeliveryService.getAll
  });

  const { data: ppeItems = [], isLoading: isLoadingPPEs } = useQuery({
    queryKey: ['ppeItems'],
    queryFn: ppeItemService.getAll
  });

  // Hooks personalizados para gerenciamento de estado
  const dialogState = usePPEDialogs(selectedDelivery, setSelectedDelivery, {
    mutate: (id: number) => mutationState.deleteDelivery(id)
  });
  
  const filterState = usePPEFilters(deliveries, ppeItems);
  const mutationState = usePPEMutations(
    resetForm,
    dialogState.setIsNewPPEDialogOpen,
    dialogState.setIsDeliveryDialogOpen,
    dialogState.setIsEditPPEDialogOpen,
    dialogState.setIsDeletePPEDialogOpen,
    setSelectedPPEItem
  );

  // Handlers otimizados
  const handleSavePPE = useCallback(async () => {
    if (!formData.name || !formData.ca || !formData.type || !formData.validity_period) {
      toast({
        title: "Erro ao salvar",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const newPPE: Omit<PPEItem, 'id' | 'created_at'> = {
      name: formData.name,
      ca: formData.ca,
      type: formData.type,
      validityPeriod: parseInt(formData.validity_period.toString()),
      description: formData.description || ''
    };

    mutationState.createPPE(newPPE);
  }, [formData, mutationState.createPPE, toast]);

  const handleSaveDelivery = useCallback(
    async (deliveryData: Omit<PPEDelivery, 'id' | 'created_at'>) => {
      mutationState.createDelivery(deliveryData);
    },
    [mutationState.createDelivery]
  );

  return {
    // Estados do formulário
    formData,
    setField,
    resetForm,
    validateForm,
    errors,
    isValid,

    // Estados de seleção
    selectedDelivery,
    setSelectedDelivery,
    selectedPPEItem,
    setSelectedPPEItem,
    ppeItems,
    deliveries,

    // Estados dos diálogos
    ...dialogState,

    // Estados dos filtros
    ...filterState,

    // Operações de mutação
    handleSavePPE,
    handleUpdatePPE: mutationState.updatePPE,
    handleDeletePPE: mutationState.deletePPE,
    handleSaveDelivery,

    // Estado de carregamento
    loading: isLoadingDeliveries || isLoadingPPEs || operationLoading || mutationState.loading
  };
}
