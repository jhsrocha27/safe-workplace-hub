
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PPEDelivery } from '@/services/types';
import { useQuery } from '@tanstack/react-query';
import { ppeDeliveryService } from '@/features/ppe/services/ppe-service';
import { Skeleton } from '@/components/ui/skeleton';

interface PPEDeliveryListProps {
  onSelectDelivery?: (delivery: PPEDelivery) => void;
}

export const PPEDeliveryList: React.FC<PPEDeliveryListProps> = ({ onSelectDelivery }) => {
  const { data: deliveries = [], isLoading } = useQuery({
    queryKey: ['ppeDeliveries'],
    queryFn: ppeDeliveryService.getAll
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid':
        return 'bg-green-500';
      case 'expired':
        return 'bg-red-500';
      case 'expiring':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="w-full h-12" />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Funcionário</TableHead>
            <TableHead>EPI</TableHead>
            <TableHead>Departamento</TableHead>
            <TableHead>Data de Entrega</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deliveries.length > 0 ? (
            deliveries.map((delivery) => (
              <TableRow
                key={delivery.id}
                onClick={() => onSelectDelivery?.(delivery)}
                className="cursor-pointer hover:bg-gray-50"
              >
                <TableCell>{delivery.employeeName}</TableCell>
                <TableCell>{delivery.ppeName}</TableCell>
                <TableCell>{delivery.department}</TableCell>
                <TableCell>{new Date(delivery.delivery_date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(delivery.status)}>
                    {delivery.status.toUpperCase()}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6">
                Nenhuma entrega de EPI encontrada
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
