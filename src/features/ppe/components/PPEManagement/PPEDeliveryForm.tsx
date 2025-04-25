import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form } from '@/components/ui/form';
import { PPEDelivery } from '@/services/types';

interface PPEDeliveryFormProps {
  onSubmit: (data: Partial<PPEDelivery>) => void;
  isLoading?: boolean;
}

export const PPEDeliveryForm: React.FC<PPEDeliveryFormProps> = ({ onSubmit, isLoading }) => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Implementar lógica do formulário
    onSubmit({
      employee_id: 0,
      ppe_id: 0,
      delivery_date: new Date().toISOString(),
      quantity: 1,
      status: 'valid'
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="employee" className="text-sm font-medium">Funcionário</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o funcionário" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">João Silva</SelectItem>
              <SelectItem value="2">Maria Santos</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="ppe" className="text-sm font-medium">EPI</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o EPI" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Capacete de Segurança</SelectItem>
              <SelectItem value="2">Luvas de Proteção</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="quantity" className="text-sm font-medium">Quantidade</label>
          <Input
            id="quantity"
            type="number"
            min="1"
            defaultValue="1"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="delivery-date" className="text-sm font-medium">Data de Entrega</label>
          <Input
            id="delivery-date"
            type="date"
            defaultValue={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Salvando...' : 'Salvar Entrega'}
      </Button>
    </form>
  );
};