
import React from 'react';
import { Button } from '@/components/ui/button';
import { Shield, Plus, Loader2 } from 'lucide-react';
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { PPEItem } from '@/services/types';

interface PPEHeaderProps {
  isNewPPEDialogOpen: boolean;
  setIsNewPPEDialogOpen: (open: boolean) => void;
  isDeliveryDialogOpen: boolean;
  setIsDeliveryDialogOpen: (open: boolean) => void;
  loading: boolean;
}

export const PPEHeader: React.FC<PPEHeaderProps> = ({
  isNewPPEDialogOpen,
  setIsNewPPEDialogOpen,
  isDeliveryDialogOpen,
  setIsDeliveryDialogOpen,
  loading
}) => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold text-white">Gestão de EPIs</h1>

      <div className="flex gap-3">
        <Dialog open={isNewPPEDialogOpen} onOpenChange={setIsNewPPEDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Shield className="mr-2 h-4 w-4" /> Cadastrar EPI
            </Button>
          </DialogTrigger>
        </Dialog>

        <Dialog open={isDeliveryDialogOpen} onOpenChange={setIsDeliveryDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Nova Entrega
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>
    </div>
  );
};
