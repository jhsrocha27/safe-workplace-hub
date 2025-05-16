import { useMemo } from 'react';
import { PPEDelivery } from '@/services/types';
import { useDialogState } from './use-dialog-state';

type DialogActions = {
  handleShowDetails: (delivery: PPEDelivery) => void;
  handleRenewPPE: (delivery: PPEDelivery) => void;
  handleDeleteDelivery: (delivery: PPEDelivery) => void;
  handleConfirmDeleteDelivery: () => void;
};

export type PPEDialogState = ReturnType<typeof useDialogState> & DialogActions & {
  isNewPPEDialogOpen: boolean;
  isDeliveryDialogOpen: boolean;
  detailDialogOpen: boolean;
  renewalDialogOpen: boolean;
  deleteDialogOpen: boolean;
  isEditPPEDialogOpen: boolean;
  isPPEHistoryDialogOpen: boolean;
  isDeletePPEDialogOpen: boolean;
  setIsNewPPEDialogOpen: (open: boolean) => void;
  setIsDeliveryDialogOpen: (open: boolean) => void;
  setDetailDialogOpen: (open: boolean) => void;
  setRenewalDialogOpen: (open: boolean) => void;
  setDeleteDialogOpen: (open: boolean) => void;
  setIsEditPPEDialogOpen: (open: boolean) => void;
  setIsPPEHistoryDialogOpen: (open: boolean) => void;
  setIsDeletePPEDialogOpen: (open: boolean) => void;
  resetDialogs: () => void;
};

export function usePPEDialogs(
  selectedDelivery: PPEDelivery | null,
  setSelectedDelivery: (delivery: PPEDelivery | null) => void,
  deleteDeliveryMutation: { mutate: (id: number) => void }
): PPEDialogState {
  const { dialogStates, setDialogOpen } = useDialogState({
    isNewPPEDialogOpen: false,
    isDeliveryDialogOpen: false,
    detailDialogOpen: false,
    renewalDialogOpen: false,
    deleteDialogOpen: false,
    isEditPPEDialogOpen: false,
    isPPEHistoryDialogOpen: false,
    isDeletePPEDialogOpen: false
  });


  const dialogActions = useMemo(
    () => ({
      handleShowDetails: (delivery: PPEDelivery) => {
        setSelectedDelivery(delivery);
        setDialogOpen('detailDialogOpen', true);
      },
      handleRenewPPE: (delivery: PPEDelivery) => {
        setSelectedDelivery(delivery);
        setDialogOpen('renewalDialogOpen', true);
      },
      handleDeleteDelivery: (delivery: PPEDelivery) => {
        setSelectedDelivery(delivery);
        setDialogOpen('deleteDialogOpen', true);
      },
      handleConfirmDeleteDelivery: () => {
        if (selectedDelivery) {
          deleteDeliveryMutation.mutate(selectedDelivery.id);
          setDialogOpen('deleteDialogOpen', false);
        }
      },
    }),
    [selectedDelivery, deleteDeliveryMutation, setSelectedDelivery, setDialogOpen]
  );

  return {
    isNewPPEDialogOpen: dialogStates.isNewPPEDialogOpen,
    isDeliveryDialogOpen: dialogStates.isDeliveryDialogOpen,
    detailDialogOpen: dialogStates.detailDialogOpen,
    renewalDialogOpen: dialogStates.renewalDialogOpen,
    deleteDialogOpen: dialogStates.deleteDialogOpen,
    isEditPPEDialogOpen: dialogStates.isEditPPEDialogOpen,
    isPPEHistoryDialogOpen: dialogStates.isPPEHistoryDialogOpen,
    isDeletePPEDialogOpen: dialogStates.isDeletePPEDialogOpen,
    ...dialogActions,
    setIsNewPPEDialogOpen: (open: boolean) => setDialogOpen('isNewPPEDialogOpen', open),
    setIsDeliveryDialogOpen: (open: boolean) => setDialogOpen('isDeliveryDialogOpen', open),
    setDetailDialogOpen: (open: boolean) => setDialogOpen('detailDialogOpen', open),
    setRenewalDialogOpen: (open: boolean) => setDialogOpen('renewalDialogOpen', open),
    setDeleteDialogOpen: (open: boolean) => setDialogOpen('deleteDialogOpen', open),
    setIsEditPPEDialogOpen: (open: boolean) => setDialogOpen('isEditPPEDialogOpen', open),
    setIsPPEHistoryDialogOpen: (open: boolean) => setDialogOpen('isPPEHistoryDialogOpen', open),
    setIsDeletePPEDialogOpen: (open: boolean) => setDialogOpen('isDeletePPEDialogOpen', open),
    resetDialogs: () => setDialogOpen('isNewPPEDialogOpen', false)
  };
}