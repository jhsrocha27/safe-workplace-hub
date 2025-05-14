
import { calculatePPEStatus, formatExpiryDate } from '@/utils/ppe-status';
import { useToast } from "@/hooks/use-toast";
import { useEmployees } from '@/hooks/use-employees';
import { usePPEManagement } from '@/features/ppe/hooks/use-ppe-management';
import { PPEItem } from '@/services/types'; 
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Shield, UserCheck, Plus, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { PPEDetailDialog } from '@/components/ppe/PPEDetailDialog';
import { PPERenewalDialog } from '@/components/ppe/PPERenewalDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Import our refactored components
import {
  PPEHeader,
  PPENewDialog,
  PPEDeliveryDialog,
  PPESearchBar,
  PPEDeliveriesTab,
  PPEInventoryTab,
  PPEEditDialog,
  PPEHistoryDialog,
  PPEDeleteDialog
} from '@/features/ppe/components/PPEManagement';

function PPEManagement(): JSX.Element {
  // Hook para gestão de EPIs
  const ppeManagement = usePPEManagement();
  const { employees } = useEmployees();
  const { toast } = useToast();

  // Função para baixar tabela de entregas
  const handleDownloadDeliveryTable = () => {
    const headers = ['Funcionário', 'Departamento', 'EPI', 'Data Entrega', 'Data Validade', 'Status'];
    
    const rows = ppeManagement.filteredDeliveries.map(delivery => [
      delivery.employeeName,
      delivery.department,
      delivery.ppeName,
      new Date(delivery.delivery_date).toLocaleDateString('pt-BR'),
      new Date(delivery.expiryDate).toLocaleDateString('pt-BR'),
      delivery.status === 'valid' ? 'Válido' : 
        delivery.status === 'expiring' ? 'A vencer' : 'Vencido'
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `entregas_epi_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Planilha baixada",
      description: "A planilha de entregas de EPI foi baixada com sucesso."
    });
  };

  return (
    <div className="space-y-6 p-6">
      <PPEHeader 
        isNewPPEDialogOpen={ppeManagement.isNewPPEDialogOpen}
        setIsNewPPEDialogOpen={ppeManagement.setIsNewPPEDialogOpen}
        isDeliveryDialogOpen={ppeManagement.isDeliveryDialogOpen}
        setIsDeliveryDialogOpen={ppeManagement.setIsDeliveryDialogOpen}
        loading={ppeManagement.loading}
      />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Gestão de Equipamentos de Proteção Individual</CardTitle>
          <CardDescription>
            Gerencie todos os EPIs da empresa, controle entregas e vencimentos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PPESearchBar 
            searchTerm={ppeManagement.searchTerm}
            setSearchTerm={ppeManagement.setSearchTerm}
          />

          <Tabs defaultValue="deliveries" onValueChange={ppeManagement.setCurrentTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="deliveries" className="flex gap-2">
                <UserCheck className="h-4 w-4" /> Entregas
              </TabsTrigger>
              <TabsTrigger value="inventory" className="flex gap-2">
                <Shield className="h-4 w-4" /> Catálogo
              </TabsTrigger>
            </TabsList>

            <TabsContent value="deliveries" className="m-0">
              <PPEDeliveriesTab 
                filteredDeliveries={ppeManagement.filteredDeliveries}
                loading={ppeManagement.loading}
                handleShowDetails={ppeManagement.handleShowDetails}
                handleRenewPPE={ppeManagement.handleRenewPPE}
                handleDeleteDelivery={ppeManagement.handleDeleteDelivery}
                handleDownloadDeliveryTable={handleDownloadDeliveryTable}
              />
            </TabsContent>

            <TabsContent value="inventory" className="m-0">
              <PPEInventoryTab 
                filteredItems={ppeManagement.filteredItems}
                loading={ppeManagement.loading}
                setSelectedPPEItem={ppeManagement.setSelectedPPEItem}
                setIsEditPPEDialogOpen={ppeManagement.setIsEditPPEDialogOpen}
                setIsPPEHistoryDialogOpen={ppeManagement.setIsPPEHistoryDialogOpen}
                setIsDeletePPEDialogOpen={ppeManagement.setIsDeletePPEDialogOpen}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Diálogos de detalhes e ações */}
      <Dialog open={ppeManagement.isNewPPEDialogOpen} onOpenChange={ppeManagement.setIsNewPPEDialogOpen}>
        <PPENewDialog 
          formData={ppeManagement.formData}
          setField={ppeManagement.setField}
          handleSavePPE={ppeManagement.handleSavePPE}
          loading={ppeManagement.loading}
        />
      </Dialog>

      <Dialog open={ppeManagement.isDeliveryDialogOpen} onOpenChange={ppeManagement.setIsDeliveryDialogOpen}>
        <PPEDeliveryDialog 
          formData={ppeManagement.formData}
          setField={ppeManagement.setField}
          employees={employees}
          ppeItems={ppeManagement.ppeItems}
          handleSaveDelivery={ppeManagement.handleSaveDelivery}
          loading={ppeManagement.loading}
        />
      </Dialog>

      <PPEDetailDialog
        open={ppeManagement.detailDialogOpen}
        onOpenChange={ppeManagement.setDetailDialogOpen}
        delivery={{
          ...ppeManagement.selectedDelivery,
          employeeId: ppeManagement.selectedDelivery?.employee_id,
          ppeId: ppeManagement.selectedDelivery?.ppe_id,
          issueDate: ppeManagement.selectedDelivery?.delivery_date
        }}
      />

      <PPERenewalDialog
        open={ppeManagement.renewalDialogOpen}
        onOpenChange={ppeManagement.setRenewalDialogOpen}
        delivery={{
          ...ppeManagement.selectedDelivery,
          employeeId: ppeManagement.selectedDelivery?.employee_id,
          ppeId: ppeManagement.selectedDelivery?.ppe_id,
          issueDate: ppeManagement.selectedDelivery?.delivery_date
        }}
      />

      <AlertDialog open={ppeManagement.deleteDialogOpen} onOpenChange={ppeManagement.setDeleteDialogOpen}>
        <PPEDeleteDialog 
          selectedPPEItem={null}
          deliveries={ppeManagement.deliveries}
          handleDeletePPE={ppeManagement.handleConfirmDeleteDelivery}
          loading={ppeManagement.loading}
        />
      </AlertDialog>

      <Dialog open={ppeManagement.isEditPPEDialogOpen} onOpenChange={ppeManagement.setIsEditPPEDialogOpen}>
        <PPEEditDialog 
          selectedPPEItem={ppeManagement.selectedPPEItem}
          handleUpdatePPE={ppeManagement.handleUpdatePPE}
          loading={ppeManagement.loading}
        />
      </Dialog>

      <Dialog open={ppeManagement.isPPEHistoryDialogOpen} onOpenChange={ppeManagement.setIsPPEHistoryDialogOpen}>
        <PPEHistoryDialog 
          selectedPPEItem={ppeManagement.selectedPPEItem}
          deliveries={ppeManagement.deliveries}
          loading={ppeManagement.loading}
        />
      </Dialog>

      <AlertDialog open={ppeManagement.isDeletePPEDialogOpen} onOpenChange={ppeManagement.setIsDeletePPEDialogOpen}>
        <PPEDeleteDialog 
          selectedPPEItem={ppeManagement.selectedPPEItem}
          deliveries={ppeManagement.deliveries}
          handleDeletePPE={ppeManagement.handleDeletePPE}
          loading={ppeManagement.loading}
        />
      </AlertDialog>
    </div>
  );
}

export default PPEManagement;
