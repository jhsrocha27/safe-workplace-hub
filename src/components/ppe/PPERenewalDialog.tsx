
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PPEDelivery {
  id: number;
  employeeId: number;
  employeeName: string;
  position: string;
  department: string;
  ppeId: number;
  ppeName: string;
  issueDate: string;
  expiryDate: string;
  status: 'valid' | 'expired' | 'expiring';
  signature: boolean;
}

interface PPERenewalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  delivery: PPEDelivery | null;
}

export function PPERenewalDialog({ open, onOpenChange, delivery }: PPERenewalDialogProps) {
  const [newExpiryDate, setNewExpiryDate] = useState("");
  const { toast } = useToast();
  
  // Reset form when dialog opens with new delivery data
  useEffect(() => {
    if (open && delivery) {
      // Calcula um ano a partir da data atual para sugestão de renovação
      const suggestedDate = new Date();
      suggestedDate.setFullYear(suggestedDate.getFullYear() + 1);
      setNewExpiryDate(suggestedDate.toISOString().split('T')[0]);
    } else {
      setNewExpiryDate("");
    }
  }, [open, delivery]);
  
  if (!delivery) return null;
  
  // Função segura para fechar o diálogo
  const handleClose = () => {
    onOpenChange(false);
  };
  
  const handleRenewal = () => {
    if (!newExpiryDate) {
      toast({
        title: "Erro",
        description: "Por favor, selecione uma nova data de validade",
        variant: "destructive",
      });
      return;
    }
    
    // Aqui seria implementada a lógica para renovar o EPI no banco de dados
    
    toast({
      title: "EPI renovado",
      description: `O ${delivery.ppeName} de ${delivery.employeeName} foi renovado com sucesso até ${new Date(newExpiryDate).toLocaleDateString('pt-BR')}`,
    });
    
    handleClose();
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Renovar EPI</DialogTitle>
          <DialogDescription>
            Renovação do equipamento de proteção individual.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h3 className="text-base font-medium">Informações do EPI</h3>
            <p>
              <span className="text-sm text-gray-500">Nome do EPI:</span> <br />
              <span className="font-medium">{delivery.ppeName}</span>
            </p>
            <p>
              <span className="text-sm text-gray-500">Funcionário:</span> <br />
              <span className="font-medium">{delivery.employeeName}</span>
            </p>
            <p>
              <span className="text-sm text-gray-500">Data de validade atual:</span> <br />
              <span className="font-medium">{new Date(delivery.expiryDate).toLocaleDateString('pt-BR')}</span>
            </p>
          </div>
          
          <div className="border-t pt-4">
            <label className="block text-sm font-medium mb-2">
              Nova data de validade <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input 
                type="date" 
                className="pl-8" 
                value={newExpiryDate}
                onChange={(e) => setNewExpiryDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              O EPI precisa ser renovado antes da data de vencimento atual.
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Observações (opcional)
            </label>
            <Input placeholder="Motivo da renovação ou outras observações" />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button 
            className="bg-safety-blue hover:bg-safety-blue/90"
            onClick={handleRenewal}
          >
            Confirmar Renovação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
