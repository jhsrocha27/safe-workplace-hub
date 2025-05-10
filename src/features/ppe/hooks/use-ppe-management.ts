
import { useToast } from "@/hooks/use-toast";
import { usePPEForm } from '@/hooks/use-ppe-form';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { PPEItem, PPEDelivery } from '@/services/types';
import { ppeItemService, ppeDeliveryService } from '@/features/ppe/services/ppe-service';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function usePPEManagement() {
  const { toast } = useToast();
  const { formData, setField, resetForm, validateForm, errors, isValid } = usePPEForm();
  const { withErrorHandling, loading: operationLoading } = useErrorHandler();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');

  // Estados para UI
  const [currentTab, setCurrentTab] = useState('deliveries');
  const [selectedDelivery, setSelectedDelivery] = useState<PPEDelivery | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [renewalDialogOpen, setRenewalDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isNewPPEDialogOpen, setIsNewPPEDialogOpen] = useState(false);
  const [isDeliveryDialogOpen, setIsDeliveryDialogOpen] = useState(false);
  const [selectedPPEItem, setSelectedPPEItem] = useState<PPEItem | null>(null);
  const [isEditPPEDialogOpen, setIsEditPPEDialogOpen] = useState(false);
  const [isPPEHistoryDialogOpen, setIsPPEHistoryDialogOpen] = useState(false);
  const [isDeletePPEDialogOpen, setIsDeletePPEDialogOpen] = useState(false);

  // Consultas React Query
  const { data: deliveries = [], isLoading: isLoadingDeliveries } = useQuery({
    queryKey: ['ppeDeliveries'],
    queryFn: ppeDeliveryService.getAll
  });

  const { data: ppeItems = [], isLoading: isLoadingPPEs } = useQuery({
    queryKey: ['ppeItems'],
    queryFn: ppeItemService.getAll
  });

  // Mutações para modificar dados
  const createPPEMutation = useMutation({
    mutationFn: ppeItemService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ppeItems'] });
      resetForm();
      setIsNewPPEDialogOpen(false);
      toast({
        title: "EPI cadastrado",
        description: "O EPI foi cadastrado com sucesso no catálogo."
      });
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
      toast({
        title: "EPI atualizado",
        description: "O EPI foi atualizado com sucesso."
      });
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
      toast({
        title: "EPI excluído",
        description: "O EPI foi excluído com sucesso."
      });
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
      toast({
        title: "Entrega registrada",
        description: "A entrega de EPI foi registrada com sucesso."
      });
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
      toast({
        title: "Entrega atualizada",
        description: "A entrega de EPI foi atualizada com sucesso."
      });
    }
  });

  const deleteDeliveryMutation = useMutation({
    mutationFn: ppeDeliveryService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ppeDeliveries'] });
      setDeleteDialogOpen(false);
      setSelectedDelivery(null);
      toast({
        title: "Entrega excluída",
        description: "A entrega de EPI foi excluída com sucesso."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao excluir entrega",
        description: error.message || "Ocorreu um erro ao excluir a entrega.",
        variant: "destructive"
      });
    }
  });

  // Filtragem de dados
  const filteredDeliveries = deliveries.filter(delivery => {
    return (delivery.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.ppeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.department?.toLowerCase().includes(searchTerm.toLowerCase())) ?? false;
  });

  const filteredItems = ppeItems.filter(item => {
    return (item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ca?.toLowerCase().includes(searchTerm.toLowerCase())) ?? false;
  });

  // Handlers
  const handleSavePPE = async () => {
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

    createPPEMutation.mutate(newPPE);
  };

  const handleUpdatePPE = async (id: number, data: Partial<PPEItem>) => {
    updatePPEMutation.mutate({ id, data });
  };

  const handleDeletePPE = async (id: number) => {
    deletePPEMutation.mutate(id);
  };

  const handleShowDetails = (delivery: PPEDelivery) => {
    setSelectedDelivery(delivery);
    setDetailDialogOpen(true);
  };

  const handleRenewPPE = (delivery: PPEDelivery) => {
    setSelectedDelivery(delivery);
    setRenewalDialogOpen(true);
  };

  const handleDeleteDelivery = (delivery: PPEDelivery) => {
    setSelectedDelivery(delivery);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDeleteDelivery = async () => {
    if (selectedDelivery) {
      deleteDeliveryMutation.mutate(selectedDelivery.id);
    }
  };

  const handleSaveDelivery = async (deliveryData: Omit<PPEDelivery, 'id' | 'created_at'>) => {
    createDeliveryMutation.mutate(deliveryData);
  };

  return {
    // Estados
    searchTerm,
    setSearchTerm,
    currentTab,
    setCurrentTab,
    selectedDelivery,
    setSelectedDelivery,
    detailDialogOpen,
    setDetailDialogOpen,
    renewalDialogOpen,
    setRenewalDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    isNewPPEDialogOpen,
    setIsNewPPEDialogOpen,
    isDeliveryDialogOpen,
    setIsDeliveryDialogOpen,
    ppeItems,
    selectedPPEItem,
    setSelectedPPEItem,
    isEditPPEDialogOpen,
    setIsEditPPEDialogOpen,
    isPPEHistoryDialogOpen,
    setIsPPEHistoryDialogOpen,
    isDeletePPEDialogOpen,
    setIsDeletePPEDialogOpen,
    
    // Dados
    deliveries,
    filteredDeliveries,
    filteredItems,
    
    // Operações
    handleSavePPE,
    handleUpdatePPE,
    handleDeletePPE,
    handleShowDetails,
    handleRenewPPE,
    handleDeleteDelivery,
    handleConfirmDeleteDelivery,
    handleSaveDelivery,
    
    // Form
    formData,
    setField,
    resetForm,
    validateForm,
    errors,
    isValid,
    
    // Estado de carregamento
    loading: isLoadingDeliveries || isLoadingPPEs || operationLoading || 
             createPPEMutation.isPending || updatePPEMutation.isPending || 
             deletePPEMutation.isPending || createDeliveryMutation.isPending || 
             updateDeliveryMutation.isPending || deleteDeliveryMutation.isPending
  };
}
