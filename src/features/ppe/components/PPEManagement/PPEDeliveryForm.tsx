
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PPEDelivery, PPEItem } from '@/services/types';
import { useToast } from '@/hooks/use-toast';
import { ppeItemService } from '@/features/ppe/services/ppe-service';
import { employeeService } from '@/services/employee-service';

interface PPEDeliveryFormProps {
  onSubmit: (data: Omit<PPEDelivery, 'id' | 'created_at'>) => void;
  isLoading?: boolean;
}

export const PPEDeliveryForm: React.FC<PPEDeliveryFormProps> = ({ onSubmit, isLoading }) => {
  const { toast } = useToast();
  const [employees, setEmployees] = useState<any[]>([]);
  const [ppeItems, setPpeItems] = useState<PPEItem[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [selectedPPEId, setSelectedPPEId] = useState<number | null>(null);
  const [deliveryDate, setDeliveryDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [loadingData, setLoadingData] = useState(true);
  
  // Dados calculados
  const selectedEmployee = employees.find(emp => emp.id === selectedEmployeeId);
  const selectedPPE = ppeItems.find(ppe => ppe.id === selectedPPEId);
  
  // Carrega funcionários e EPIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        const [empData, ppeData] = await Promise.all([
          employeeService.getAll(),
          ppeItemService.getAll()
        ]);
        setEmployees(empData);
        setPpeItems(ppeData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os dados necessários',
          variant: 'destructive'
        });
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [toast]);

  // Calcula a data de expiração
  const calculateExpiryDate = (): string => {
    if (!selectedPPE || !deliveryDate) return '';
    
    const date = new Date(deliveryDate);
    date.setMonth(date.getMonth() + selectedPPE.validityPeriod);
    return date.toISOString().split('T')[0];
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!selectedEmployeeId || !selectedPPEId || !deliveryDate) {
      toast({
        title: "Erro no formulário",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const expiryDate = calculateExpiryDate();
    const currentDate = new Date();
    const expiryDateObj = new Date(expiryDate);
    let status: 'valid' | 'expired' | 'expiring' = 'valid';
    
    // Calcula o status baseado na data de expiração
    if (expiryDateObj <= currentDate) {
      status = 'expired';
    } else {
      const daysUntilExpiry = Math.ceil((expiryDateObj.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysUntilExpiry <= 30) {
        status = 'expiring';
      }
    }

    const deliveryData: Omit<PPEDelivery, 'id' | 'created_at'> = {
      employee_id: selectedEmployeeId,
      employeeName: selectedEmployee?.name || '',
      position: selectedEmployee?.position || '',
      department: selectedEmployee?.department || '',
      ppe_id: selectedPPEId,
      ppeName: selectedPPE?.name || '',
      delivery_date: deliveryDate,
      expiryDate: expiryDate,
      quantity: 1,
      status: status,
      signature: false
    };

    onSubmit(deliveryData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="employee" className="text-sm font-medium">Funcionário</label>
          <Select
            disabled={loadingData || isLoading}
            value={selectedEmployeeId?.toString() || ""}
            onValueChange={(value) => setSelectedEmployeeId(parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o funcionário" />
            </SelectTrigger>
            <SelectContent>
              {employees.map(emp => (
                <SelectItem key={emp.id} value={emp.id.toString()}>
                  {emp.name} - {emp.position}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="ppe" className="text-sm font-medium">EPI</label>
          <Select
            disabled={loadingData || isLoading}
            value={selectedPPEId?.toString() || ""}
            onValueChange={(value) => setSelectedPPEId(parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o EPI" />
            </SelectTrigger>
            <SelectContent>
              {ppeItems.map(ppe => (
                <SelectItem key={ppe.id} value={ppe.id.toString()}>
                  {ppe.name} - CA: {ppe.ca} ({ppe.validityPeriod} meses)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="delivery-date" className="text-sm font-medium">Data de Entrega</label>
          <Input
            id="delivery-date"
            type="date"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            disabled={loadingData || isLoading}
          />
        </div>

        {selectedPPE && deliveryDate && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Data de Validade (calculada)</label>
            <Input
              type="date"
              value={calculateExpiryDate()}
              disabled={true}
              className="bg-gray-50"
            />
            <p className="text-xs text-gray-500">
              Baseada no período de {selectedPPE.validityPeriod} meses do EPI selecionado
            </p>
          </div>
        )}
      </div>

      <Button type="submit" disabled={isLoading || loadingData || !selectedEmployeeId || !selectedPPEId}>
        {isLoading ? 'Salvando...' : 'Registrar Entrega'}
      </Button>
    </form>
  );
};
