
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet, ArrowUpDown, Calendar, Download, Info, RefreshCw, Trash2, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { PPEDelivery } from '@/services/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface PPEDeliveriesTabProps {
  filteredDeliveries: PPEDelivery[];
  loading: boolean;
  handleShowDetails: (delivery: PPEDelivery) => void;
  handleRenewPPE: (delivery: PPEDelivery) => void;
  handleDeleteDelivery: (delivery: PPEDelivery) => void;
  handleDownloadDeliveryTable: () => void;
}

export const PPEDeliveriesTab: React.FC<PPEDeliveriesTabProps> = ({
  filteredDeliveries,
  loading,
  handleShowDetails,
  handleRenewPPE,
  handleDeleteDelivery,
  handleDownloadDeliveryTable
}) => {
  const { toast } = useToast();

  const handleDownloadReceipt = (delivery: PPEDelivery) => {
    const content = `
      COMPROVANTE DE ENTREGA DE EPI
      
      Funcionário: ${delivery.employeeName}
      Cargo: ${delivery.position}
      Departamento: ${delivery.department}
      
      EPI: ${delivery.ppeName}
      Data de Entrega: ${new Date(delivery.delivery_date).toLocaleDateString()}
      Data de Validade: ${new Date(delivery.expiryDate).toLocaleDateString()}
      
      Status: ${delivery.status}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `comprovante_epi_${delivery.employeeName.replace(' ', '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Comprovante baixado",
      description: `O comprovante de ${delivery.ppeName} foi gerado com sucesso`
    });
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button 
          variant="outline"
          className="flex gap-2"
          onClick={handleDownloadDeliveryTable}
        >
          <FileSpreadsheet className="h-4 w-4" /> Baixar Planilha
        </Button>
      </div>
      
      <ScrollArea className="h-[500px]">
        <div className="relative overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <div className="flex items-center">
                    Funcionário
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center">
                    Departamento
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center">
                    EPI
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center">
                    Entrega
                    <Calendar className="ml-1 h-3 w-3" />
                  </div>
                </TableHead>

                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                // Mostrar skeleton loader durante o carregamento
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    <TableCell><div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div></TableCell>
                  </TableRow>
                ))
              ) : filteredDeliveries.length > 0 ? (
                filteredDeliveries.map(delivery => (
                  <TableRow key={delivery.id}>
                    <TableCell className="font-medium">
                      {delivery.employeeName}
                    </TableCell>
                    <TableCell>{delivery.department}</TableCell>
                    <TableCell>{delivery.ppeName}</TableCell>
                    <TableCell>
                      {new Date(delivery.delivery_date).toLocaleDateString('pt-BR')}
                    </TableCell>

                    <TableCell>
                      {delivery.status === 'valid' && (
                        <Badge className="bg-safety-green">Válido</Badge>
                      )}
                      {delivery.status === 'expiring' && (
                        <Badge className="bg-safety-orange">A vencer</Badge>
                      )}
                      {delivery.status === 'expired' && (
                        <Badge className="bg-safety-red">Vencido</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            Ações
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleShowDetails(delivery)}>
                            <Info className="mr-2 h-4 w-4" />
                            Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRenewPPE(delivery)}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Renovar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownloadReceipt(delivery)}>
                            <Download className="mr-2 h-4 w-4" />
                            Baixar Comprovante
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-500"
                            onClick={() => handleDeleteDelivery(delivery)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                    Nenhuma entrega encontrada
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
    </div>
  );
};
