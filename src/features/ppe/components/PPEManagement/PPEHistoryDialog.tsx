
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PPEItem, PPEDelivery } from '@/services/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface PPEHistoryDialogProps {
  selectedPPEItem: PPEItem | null;
  deliveries: PPEDelivery[];
  loading: boolean;
}

export const PPEHistoryDialog: React.FC<PPEHistoryDialogProps> = ({
  selectedPPEItem,
  deliveries,
  loading
}) => {
  const filteredDeliveries = 
    selectedPPEItem ? 
      deliveries.filter(d => d.ppe_id === selectedPPEItem.id) : 
      [];

  return (
    <DialogContent className="sm:max-w-[700px]">
      <DialogHeader>
        <DialogTitle>Histórico de Entregas - {selectedPPEItem?.name}</DialogTitle>
        <DialogDescription>
          Registro de todas as entregas deste EPI para funcionários.
        </DialogDescription>
      </DialogHeader>
      <ScrollArea className="h-[400px] mt-4">
        <div className="relative overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Funcionário</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Data Entrega</TableHead>
                <TableHead>Data Validade</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                // Mostrar skeleton loader durante o carregamento
                Array.from({ length: 3 }).map((_, index) => (
                  <TableRow key={`skeleton-history-${index}`}>
                    <TableCell><div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div></TableCell>
                  </TableRow>
                ))
              ) : filteredDeliveries.length > 0 ? (
                filteredDeliveries.map(delivery => (
                  <TableRow key={delivery.id}>
                    <TableCell className="font-medium">{delivery.employeeName}</TableCell>
                    <TableCell>{delivery.department}</TableCell>
                    <TableCell>{new Date(delivery.delivery_date).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{new Date(delivery.expiryDate).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      {delivery.status === 'valid' && <Badge className="bg-safety-green">Válido</Badge>}
                      {delivery.status === 'expiring' && <Badge className="bg-safety-orange">A vencer</Badge>}
                      {delivery.status === 'expired' && <Badge className="bg-safety-red">Vencido</Badge>}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Nenhuma entrega encontrada para este EPI
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
      <DialogFooter>
        <DialogClose asChild>
          <Button>Fechar</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
};
