
import React from 'react';
import { Edit, History, Trash2 } from 'lucide-react';
import { PPEItem } from '@/services/types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PPEInventoryTabProps {
  filteredItems: PPEItem[];
  loading: boolean;
  setSelectedPPEItem: (item: PPEItem) => void;
  setIsEditPPEDialogOpen: (open: boolean) => void;
  setIsPPEHistoryDialogOpen: (open: boolean) => void;
  setIsDeletePPEDialogOpen: (open: boolean) => void;
}

export const PPEInventoryTab: React.FC<PPEInventoryTabProps> = ({
  filteredItems,
  loading,
  setSelectedPPEItem,
  setIsEditPPEDialogOpen,
  setIsPPEHistoryDialogOpen,
  setIsDeletePPEDialogOpen
}) => {
  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">Nome do EPI</th>
            <th scope="col" className="px-6 py-3">Número CA</th>
            <th scope="col" className="px-6 py-3">Tipo</th>
            <th scope="col" className="px-6 py-3">Validade (meses)</th>
            <th scope="col" className="px-6 py-3">Ações</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            // Mostrar skeleton loader durante o carregamento
            Array.from({ length: 5 }).map((_, index) => (
              <tr key={`skeleton-${index}`} className="bg-white border-b">
                <td className="px-6 py-4"><div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div></td>
                <td className="px-6 py-4"><div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div></td>
                <td className="px-6 py-4"><div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div></td>
                <td className="px-6 py-4"><div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div></td>
                <td className="px-6 py-4"><div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div></td>
              </tr>
            ))
          ) : filteredItems.length > 0 ? (
            filteredItems.map(item => (
              <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {item.name}
                </td>
                <td className="px-6 py-4">{item.ca}</td>
                <td className="px-6 py-4">{item.type}</td>
                <td className="px-6 py-4">{item.validityPeriod} meses</td>
                <td className="px-6 py-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        Ações
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => {
                        setSelectedPPEItem(item);
                        setIsEditPPEDialogOpen(true);
                      }}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        setSelectedPPEItem(item);
                        setIsPPEHistoryDialogOpen(true);
                      }}>
                        <History className="mr-2 h-4 w-4" />
                        Ver Histórico
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-500"
                        onClick={() => {
                          setSelectedPPEItem(item);
                          setIsDeletePPEDialogOpen(true);
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                Nenhum EPI encontrado
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
