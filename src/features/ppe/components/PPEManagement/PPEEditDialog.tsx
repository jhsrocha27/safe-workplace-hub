
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { PPEItem } from '@/services/types';
import { useToast } from '@/hooks/use-toast';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";

interface PPEEditDialogProps {
  selectedPPEItem: PPEItem | null;
  handleUpdatePPE: (id: number, data: Partial<PPEItem>) => void;
  loading: boolean;
}

export const PPEEditDialog: React.FC<PPEEditDialogProps> = ({
  selectedPPEItem,
  handleUpdatePPE,
  loading
}) => {
  const { toast } = useToast();

  const handleSave = () => {
    if (!selectedPPEItem) return;

    const nameInput = document.querySelector('input[name="edit-ppe-name"]') as HTMLInputElement;
    const caInput = document.querySelector('input[name="edit-ppe-ca"]') as HTMLInputElement;
    const typeInput = document.querySelector('input[name="edit-ppe-type"]') as HTMLInputElement;
    const validityInput = document.querySelector('input[name="edit-ppe-validity"]') as HTMLInputElement;
    const descriptionInput = document.querySelector('input[name="edit-ppe-description"]') as HTMLInputElement;

    if (!nameInput?.value || !caInput?.value || !typeInput?.value || !validityInput?.value) {
      toast({
        title: "Erro ao atualizar",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const updatedData: Partial<PPEItem> = {
      name: nameInput.value,
      ca: caInput.value,
      type: typeInput.value,
      validityPeriod: parseInt(validityInput.value),
      description: descriptionInput?.value || ''
    };

    handleUpdatePPE(selectedPPEItem.id, updatedData);
  };

  return (
    <DialogContent className="sm:max-w-[625px]">
      <DialogHeader>
        <DialogTitle>Editar EPI</DialogTitle>
        <DialogDescription>
          Atualize as informações do equipamento de proteção individual.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Nome do EPI</label>
            <Input 
              name="edit-ppe-name"
              defaultValue={selectedPPEItem?.name || ''}
              placeholder="Ex: Capacete de Segurança"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Número do CA</label>
            <Input 
              name="edit-ppe-ca"
              defaultValue={selectedPPEItem?.ca || ''}
              placeholder="Ex: CA-12345"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tipo de Proteção</label>
            <Input 
              name="edit-ppe-type"
              defaultValue={selectedPPEItem?.type || ''}
              placeholder="Ex: Proteção para cabeça"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Validade (meses)</label>
            <Input 
              name="edit-ppe-validity"
              type="number" 
              defaultValue={selectedPPEItem?.validityPeriod.toString() || ''}
              placeholder="Ex: 12"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Descrição</label>
            <Input 
              name="edit-ppe-description"
              defaultValue={selectedPPEItem?.description || ''}
              placeholder="Detalhes adicionais sobre o EPI"
            />
          </div>
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancelar</Button>
        </DialogClose>
        <Button 
          className="bg-safety-blue hover:bg-safety-blue/90"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando
            </>
          ) : 'Salvar'}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
