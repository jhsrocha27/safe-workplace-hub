import { useToast } from "@/hooks/use-toast";
import { usePPEForm } from '@/hooks/use-ppe-form';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { PPEItem, PPEDelivery } from '@/services/types';
import { ppeItemService, ppeDeliveryService } from '@/services/ppe-service';
import { ppeData, ppeDeliveryData } from '@/services/mock-data';
import { useState } from 'react';

export function usePPEManagement() {
  const { toast } = useToast();
  const { formData, setField, resetForm, validateForm, errors, isValid } = usePPEForm();
  const { withErrorHandling, loading } = useErrorHandler();
  const [searchTerm, setSearchTerm] = useState('');

  const [currentTab, setCurrentTab] = useState('deliveries');
  const [selectedDelivery, setSelectedDelivery] = useState<PPEDelivery | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [renewalDialogOpen, setRenewalDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isNewPPEDialogOpen, setIsNewPPEDialogOpen] = useState(false);
  const [isDeliveryDialogOpen, setIsDeliveryDialogOpen] = useState(false);
  const [deliveries, setDeliveries] = useState<PPEDelivery[]>(ppeDeliveryData);
  const [ppeItems, setPPEItems] = useState<PPEItem[]>(ppeData);
  
  const [selectedPPEItem, setSelectedPPEItem] = useState<PPEItem | null>(null);
  const [isEditPPEDialogOpen, setIsEditPPEDialogOpen] = useState(false);
  const [isPPEHistoryDialogOpen, setIsPPEHistoryDialogOpen] = useState(false);
  const [isDeletePPEDialogOpen, setIsDeletePPEDialogOpen] = useState(false);

  const filteredDeliveries = deliveries.filter(delivery => {
    return delivery.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.ppeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.department.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const filteredItems = ppeItems.filter(item => {
    return item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ca.toLowerCase().includes(searchTerm.toLowerCase());
  });

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

    const result = await withErrorHandling(
      async () => {
        const savedPPE = await ppeItemService.create(newPPE);
        setPPEItems([...ppeItems, savedPPE]);
        return savedPPE;
      },
      'Erro ao cadastrar EPI'
    );

    if (result) {
      toast({
        title: "EPI cadastrado",
        description: `O EPI ${result.name} foi cadastrado com sucesso no catálogo.`
      });
      setIsNewPPEDialogOpen(false);
      resetForm();
    }
  };

  const handleShowDetails = (delivery: PPEDelivery) => {
    setSelectedDelivery(delivery);
    setDetailDialogOpen(true);
  };

  const handleRenewPPE = (delivery: PPEDelivery) => {
    setSelectedDelivery(delivery);
    setRenewalDialogOpen(true);
  };

  const handleDeletePPE = (delivery: PPEDelivery) => {
    setSelectedDelivery(delivery);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedDelivery) {
      const result = await withErrorHandling(
        async () => {
          await ppeDeliveryService.delete(selectedDelivery.id);
          const updatedDeliveries = deliveries.filter(d => d.id !== selectedDelivery.id);
          setDeliveries(updatedDeliveries);
          return true;
        },
        'Erro ao excluir entrega de EPI'
      );

      if (result) {
        setDeleteDialogOpen(false);
        setSelectedDelivery(null);
        toast({
          title: "Entrega excluída",
          description: "A entrega de EPI foi excluída com sucesso."
        });
      }
    }
  };

  return {
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
    deliveries,
    setDeliveries,
    ppeItems,
    setPPEItems,
    selectedPPEItem,
    setSelectedPPEItem,
    isEditPPEDialogOpen,
    setIsEditPPEDialogOpen,
    isPPEHistoryDialogOpen,
    setIsPPEHistoryDialogOpen,
    isDeletePPEDialogOpen,
    setIsDeletePPEDialogOpen,
    filteredDeliveries,
    filteredItems,
    handleSavePPE,
    handleShowDetails,
    handleRenewPPE,
    handleDeletePPE,
    handleConfirmDelete,
    formData,
    setField,
    resetForm,
    validateForm,
    errors,
    isValid,
    loading
  };
}