
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileCheck } from "lucide-react";

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
  signature: boolean; // Ensure this is included
}


interface PPEDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  delivery: PPEDelivery | null;
}

export function PPEDetailDialog({ open, onOpenChange, delivery }: PPEDetailDialogProps) {
  if (!delivery) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Detalhes do EPI</DialogTitle>
          <DialogDescription>
            Informações detalhadas sobre a entrega do EPI.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">EPI</h3>
              <p className="text-base font-semibold">{delivery.ppeName}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <div className="mt-1">
                {delivery.status === 'valid' && (
                  <Badge className="bg-safety-green">Válido</Badge>
                )}
                {delivery.status === 'expiring' && (
                  <Badge className="bg-safety-orange">A vencer</Badge>
                )}
                {delivery.status === 'expired' && (
                  <Badge className="bg-safety-red">Vencido</Badge>
                )}
              </div>
            </div>

            <div className="col-span-2 border-t pt-3">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Informações do Funcionário</h3>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Nome</h3>
              <p className="text-base">{delivery.employeeName}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">ID</h3>
              <p className="text-base">{delivery.employeeId}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Cargo</h3>
              <p className="text-base">{delivery.position}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Departamento</h3>
              <p className="text-base">{delivery.department}</p>
            </div>

            <div className="col-span-2 border-t pt-3">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Informações de Entrega</h3>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Data de Entrega</h3>
              <p className="text-base">{new Date(delivery.issueDate).toLocaleDateString('pt-BR')}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Data de Validade</h3>
              <p className="text-base">{new Date(delivery.expiryDate).toLocaleDateString('pt-BR')}</p>
            </div>


          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
