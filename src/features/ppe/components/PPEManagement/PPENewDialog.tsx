
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { usePPEForm } from '@/hooks/use-ppe-form';

interface PPENewDialogProps {
  formData: ReturnType<typeof usePPEForm>['formData'];
  setField: ReturnType<typeof usePPEForm>['setField'];
  handleSavePPE: () => void;
  loading: boolean;
}

export const PPENewDialog: React.FC<PPENewDialogProps> = ({
  formData,
  setField,
  handleSavePPE,
  loading
}) => {
  return (
    <DialogContent className="sm:max-w-[625px]">
      <DialogHeader>
        <DialogTitle>Cadastrar Novo EPI</DialogTitle>
        <DialogDescription>
          Adicione um novo equipamento de proteção individual ao sistema.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Nome do EPI</label>
            <Input 
              placeholder="Ex: Capacete de Segurança" 
              value={formData.name}
              onChange={(e) => setField('name', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Número do CA</label>
            <Input 
              placeholder="Ex: CA-12345" 
              value={formData.ca}
              onChange={(e) => setField('ca', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tipo de Proteção</label>
            <Input 
              placeholder="Ex: Proteção para cabeça" 
              value={formData.type}
              onChange={(e) => setField('type', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Validade (meses)</label>
            <Input 
              type="number" 
              placeholder="Ex: 12" 
              value={formData.validity_period?.toString() || ''}
              onChange={(e) => setField('validity_period', e.target.value)}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Descrição</label>
            <Input 
              placeholder="Detalhes adicionais sobre o EPI" 
              value={formData.description}
              onChange={(e) => setField('description', e.target.value)}
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
          onClick={handleSavePPE}
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
