
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { calculatePPEStatus, formatExpiryDate } from '@/utils/ppe-status';
import { Employee, PPEItem, PPEDelivery } from '@/services/types';
import { useToast } from '@/hooks/use-toast';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { usePPEForm } from '@/hooks/use-ppe-form';

interface PPEDeliveryDialogProps {
  formData: ReturnType<typeof usePPEForm>['formData'];
  setField: ReturnType<typeof usePPEForm>['setField'];
  employees: Employee[];
  ppeItems: PPEItem[];
  handleSaveDelivery: (delivery: Omit<PPEDelivery, 'id' | 'created_at'>) => void;
  loading: boolean;
}

export const PPEDeliveryDialog: React.FC<PPEDeliveryDialogProps> = ({
  formData,
  setField,
  employees,
  ppeItems,
  handleSaveDelivery,
  loading
}) => {
  const { toast } = useToast();

  const handleSubmitDelivery = () => {
    // Encontre o funcionário selecionado
    const selectedEmployee = employees.find(emp => emp.name === formData.employeeName);
    // Encontre o EPI selecionado
    const selectedPPE = ppeItems.find(ppe => ppe.name === formData.ppeName);
    
    if (!selectedEmployee || !selectedPPE || !formData.delivery_date) {
      toast({
        title: "Erro ao salvar",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    // Calcule a data de vencimento baseada no período de validade do EPI
    const issueDate = new Date(formData.delivery_date);
    const expiryDate = new Date(issueDate);
    expiryDate.setMonth(expiryDate.getMonth() + selectedPPE.validityPeriod);
    const expiryDateStr = expiryDate.toISOString().split('T')[0];

    // Calcule o status
    const status = calculatePPEStatus(
      formData.delivery_date, 
      selectedPPE.validityPeriod
    ).status;

    console.log("Preparando dados para salvar entrega de EPI:", {
      employee: selectedEmployee,
      ppe: selectedPPE,
      delivery_date: formData.delivery_date,
      expiryDate: expiryDateStr,
      status
    });

    // Prepare os dados da entrega
    const deliveryData = {
      employee_id: selectedEmployee.id,
      employeeName: selectedEmployee.name,
      position: selectedEmployee.position,
      department: selectedEmployee.department,
      ppe_id: selectedPPE.id,
      ppeName: selectedPPE.name,
      delivery_date: formData.delivery_date,
      expiryDate: expiryDateStr,
      quantity: 1,
      status,
      signature: false,
      // Adicionando campos para compatibilidade
      employeeId: selectedEmployee.id,
      ppeId: selectedPPE.id,
      issueDate: formData.delivery_date
    };

    console.log("Enviando dados de entrega:", deliveryData);
    handleSaveDelivery(deliveryData);
  };

  return (
    <DialogContent className="sm:max-w-[625px]">
      <DialogHeader>
        <DialogTitle>Registrar Entrega de EPI</DialogTitle>
        <DialogDescription>
          Registre a entrega de um equipamento de proteção individual para um funcionário.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Funcionário</label>
            <Select
              value={formData.employeeName}
              onValueChange={(value) => setField('employeeName', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o funcionário" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.name}>
                    {employee.name} - {employee.position}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">EPI</label>
            <Select
              value={formData.ppeName}
              onValueChange={(value) => setField('ppeName', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o EPI" />
              </SelectTrigger>
              <SelectContent>
                {ppeItems.map((ppe) => (
                  <SelectItem key={ppe.id} value={ppe.name}>
                    {ppe.name} - {ppe.ca} (Validade: {ppe.validityPeriod} meses)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Data de Entrega</label>
            <Input 
              type="date"
              value={formData.delivery_date}
              onChange={(e) => setField('delivery_date', e.target.value)}
            />
            {formData.ppeName && formData.delivery_date && (
              <p className="text-sm text-gray-500 mt-1">
                Data de vencimento calculada: {formatExpiryDate(
                  formData.delivery_date, 
                  ppeItems.find(ppe => ppe.name === formData.ppeName)?.validityPeriod || 0
                )}
              </p>
            )}
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Observações</label>
            <Input 
              placeholder="Informações adicionais"
              value={formData.observations}
              onChange={(e) => setField('observations', e.target.value)}
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
          onClick={handleSubmitDelivery}
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
