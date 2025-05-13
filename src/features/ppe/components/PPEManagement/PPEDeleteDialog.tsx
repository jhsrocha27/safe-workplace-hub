
import React from 'react';
import { PPEItem, PPEDelivery } from '@/services/types';
import { Loader2 } from 'lucide-react';
import {
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface PPEDeleteDialogProps {
  selectedPPEItem: PPEItem | null;
  deliveries: PPEDelivery[];
  handleDeletePPE: (id: number) => void;
  loading: boolean;
}

export const PPEDeleteDialog: React.FC<PPEDeleteDialogProps> = ({
  selectedPPEItem,
  deliveries,
  handleDeletePPE,
  loading
}) => {
  const hasDeliveries = selectedPPEItem ? 
    deliveries.filter(d => d.ppe_id === selectedPPEItem.id).length > 0 : 
    false;

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
        <AlertDialogDescription>
          Tem certeza que deseja excluir o EPI "{selectedPPEItem?.name}"? Esta ação não pode ser desfeita.
          {hasDeliveries && (
            <p className="mt-2 text-red-500">
              <strong>Atenção:</strong> Existem entregas registradas para este EPI. 
              Elas também serão excluídas.
            </p>
          )}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction 
          className="bg-red-600 hover:bg-red-700"
          onClick={() => {
            if (selectedPPEItem) {
              handleDeletePPE(selectedPPEItem.id);
            }
          }}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Excluindo
            </>
          ) : 'Excluir'}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};
