
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { usePPEForm } from '@/hooks/use-ppe-form';
import { usePPEManagement } from '@/hooks/use-ppe-management';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Shield,
  Search,
  Plus,
  Filter,
  UserCheck,
  Calendar,
  FileCheck,
  ArrowUpDown,
  Download,
  Info,
  RefreshCw,
  Trash2,
  FileSpreadsheet,
  Edit,
  History
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PPEDetailDialog } from '@/components/ppe/PPEDetailDialog';
import { PPERenewalDialog } from '@/components/ppe/PPERenewalDialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface PPEItem {
  id: number;
  name: string;
  ca: string;
  type: string;
  validityPeriod: number;
  description: string;
}

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

interface Employee {
  id: number;
  name: string;
  position: string;
  department: string;
  status: string;
}

const ppeData: PPEItem[] = [
  { id: 1, name: 'Capacete de Segurança', ca: 'CA-12345', type: 'Proteção para cabeça', validityPeriod: 12, description: 'Capacete classe B, tipo II' },
  { id: 2, name: 'Protetor Auricular', ca: 'CA-23456', type: 'Proteção auditiva', validityPeriod: 6, description: 'Tipo plug, atenuação 15 dB' },
  { id: 3, name: 'Óculos de Proteção', ca: 'CA-34567', type: 'Proteção visual', validityPeriod: 6, description: 'Lente incolor, anti-embaçante' },
  { id: 4, name: 'Luvas de Segurança', ca: 'CA-45678', type: 'Proteção para mãos', validityPeriod: 3, description: 'Resistente a cortes e abrasão' },
  { id: 5, name: 'Máscara PFF2', ca: 'CA-56789', type: 'Proteção respiratória', validityPeriod: 1, description: 'Filtragem de partículas' }
];

const ppeDeliveryData: PPEDelivery[] = [
  { id: 1, employeeId: 101, employeeName: 'Carlos Santos', position: 'Operador', department: 'Produção', ppeId: 1, ppeName: 'Capacete de Segurança', issueDate: '2025-01-15', expiryDate: '2026-01-15', status: 'valid', signature: false },
  { id: 2, employeeId: 101, employeeName: 'Carlos Santos', position: 'Operador', department: 'Produção', ppeId: 2, ppeName: 'Protetor Auricular', issueDate: '2025-01-15', expiryDate: '2025-07-15', status: 'expiring', signature: false },
  { id: 3, employeeId: 102, employeeName: 'Ana Ferreira', position: 'Técnica', department: 'Manutenção', ppeId: 3, ppeName: 'Óculos de Proteção', issueDate: '2024-12-10', expiryDate: '2025-06-10', status: 'valid', signature: true },
  { id: 4, employeeId: 103, employeeName: 'Marcos Lima', position: 'Auxiliar', department: 'Logística', ppeId: 4, ppeName: 'Luvas de Segurança', issueDate: '2025-02-05', expiryDate: '2025-05-05', status: 'expiring', signature: false },
  { id: 5, employeeId: 104, employeeName: 'Juliana Costa', position: 'Química', department: 'Laboratório', ppeId: 5, ppeName: 'Máscara PFF2', issueDate: '2025-03-01', expiryDate: '2025-04-01', status: 'expired', signature: true },
];

const employeeData: Employee[] = [
  { id: 1, name: "João Silva", position: "Engenheiro de Segurança", department: "Engenharia", status: "Ativo" },
  { id: 2, name: "Maria Oliveira", position: "Técnico de Segurança", department: "Operações", status: "Ativo" },
  { id: 3, name: "Carlos Pereira", position: "Técnico de Segurança", department: "Operações", status: "Ativo" },
  { id: 4, name: "Ana Ferreira", position: "Técnica", department: "Manutenção", status: "Ativo" },
  { id: 5, name: "Marcos Lima", position: "Auxiliar", department: "Logística", status: "Ativo" },
  { id: 6, name: "Juliana Costa", position: "Química", department: "Laboratório", status: "Ativo" }
];

function PPEManagement(): JSX.Element {
  const { toast } = useToast();
  const { formData, setField, resetForm, validateForm, errors, isValid } = usePPEForm();
  const [searchTerm, setSearchTerm] = useState('');

  const [currentTab, setCurrentTab] = useState('deliveries');
  const [selectedDelivery, setSelectedDelivery] = useState<PPEDelivery | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [renewalDialogOpen, setRenewalDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isNewPPEDialogOpen, setIsNewPPEDialogOpen] = useState(false);
  const [isDeliveryDialogOpen, setIsDeliveryDialogOpen] = useState(false);
  const [deliveries, setDeliveries] = useState<PPEDelivery[]>(ppeDeliveryData);
  const [ppeItems, setPPEItems] = useState<PPEItem[]>(ppeData);
  
  // Novos estados para o catálogo de EPIs
  const [selectedPPEItem, setSelectedPPEItem] = useState<PPEItem | null>(null);
  const [isEditPPEDialogOpen, setIsEditPPEDialogOpen] = useState(false);
  const [isPPEHistoryDialogOpen, setIsPPEHistoryDialogOpen] = useState(false);
  const [isDeletePPEDialogOpen, setIsDeletePPEDialogOpen] = useState(false);

  const filteredDeliveries = deliveries.filter(delivery => {
    return delivery.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.ppeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.department.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const filteredItems = ppeItems.filter(item => {
    return item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ca.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleSavePPE = () => {
    const nameInput = document.querySelector('input[placeholder="Ex: Capacete de Segurança"]') as HTMLInputElement;
    const caInput = document.querySelector('input[placeholder="Ex: CA-12345"]') as HTMLInputElement;
    const typeInput = document.querySelector('input[placeholder="Ex: Proteção para cabeça"]') as HTMLInputElement;
    const validityInput = document.querySelector('input[placeholder="Ex: 12"]') as HTMLInputElement;
    const descriptionInput = document.querySelector('input[placeholder="Detalhes adicionais sobre o EPI"]') as HTMLInputElement;

    if (!nameInput?.value || !caInput?.value || !typeInput?.value || !validityInput?.value) {
      toast({
        title: "Erro ao salvar",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const newPPE: PPEItem = {
      id: ppeItems.length + 1,
      name: nameInput.value,
      ca: caInput.value,
      type: typeInput.value,
      validityPeriod: parseInt(validityInput.value),
      description: descriptionInput?.value || ''
    };

    const updatedPPEItems = [...ppeItems, newPPE];
    setPPEItems(updatedPPEItems);

    toast({
      title: "EPI cadastrado",
      description: `O EPI ${newPPE.name} foi cadastrado com sucesso no catálogo.`
    });

    setIsNewPPEDialogOpen(false);
  };

  const handleShowDetails = (delivery: PPEDelivery) => {
    setSelectedDelivery(delivery);
    setDetailDialogOpen(true);
  };

  const handleRenewPPE = (delivery: PPEDelivery) => {
    setSelectedDelivery(delivery);
    setRenewalDialogOpen(true);
  };

  const handleDeletePPE = (delivery: PPEDelivery) => {
    setSelectedDelivery(delivery);
    setDeleteDialogOpen(true);
  };

  // Funções para lidar com ações no catálogo de EPIs
  const handleEditPPE = (item: PPEItem) => {
    setSelectedPPEItem(item);
    setIsEditPPEDialogOpen(true);
  };

  const handleViewPPEHistory = (item: PPEItem) => {
    setSelectedPPEItem(item);
    setIsPPEHistoryDialogOpen(true);
  };

  const handleConfirmDeletePPE = (item: PPEItem) => {
    setSelectedPPEItem(item);
    setIsDeletePPEDialogOpen(true);
  };

  const confirmDeletePPEItem = () => {
    if (selectedPPEItem) {
      setPPEItems(prev => prev.filter(p => p.id !== selectedPPEItem.id));
      
      // Também remover entregas associadas a este EPI
      setDeliveries(prev => prev.filter(d => d.ppeId !== selectedPPEItem.id));
      
      toast({
        title: "EPI excluído",
        description: `O EPI ${selectedPPEItem.name} foi excluído com sucesso.`
      });
      
      setIsDeletePPEDialogOpen(false);
    }
  };

  const handleUpdatePPE = () => {
    if (!selectedPPEItem) return;
    
    const nameInput = document.querySelector('input[name="edit-ppe-name"]') as HTMLInputElement;
    const caInput = document.querySelector('input[name="edit-ppe-ca"]') as HTMLInputElement;
    const typeInput = document.querySelector('input[name="edit-ppe-type"]') as HTMLInputElement;
    const validityInput = document.querySelector('input[name="edit-ppe-validity"]') as HTMLInputElement;
    const descriptionInput = document.querySelector('input[name="edit-ppe-description"]') as HTMLInputElement;

    if (!nameInput?.value || !caInput?.value || !typeInput?.value || !validityInput?.value) {
      toast({
        title: "Erro ao atualizar",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const updatedPPEItem: PPEItem = {
      ...selectedPPEItem,
      name: nameInput.value,
      ca: caInput.value,
      type: typeInput.value,
      validityPeriod: parseInt(validityInput.value),
      description: descriptionInput?.value || ''
    };

    setPPEItems(prev => prev.map(item => 
      item.id === selectedPPEItem.id ? updatedPPEItem : item
    ));

    // Atualizar também o nome do EPI nas entregas
    if (updatedPPEItem.name !== selectedPPEItem.name) {
      setDeliveries(prev => prev.map(d => 
        d.ppeId === selectedPPEItem.id 
          ? { ...d, ppeName: updatedPPEItem.name }
          : d
      ));
    }

    toast({
      title: "EPI atualizado",
      description: `O EPI ${updatedPPEItem.name} foi atualizado com sucesso.`
    });

    setIsEditPPEDialogOpen(false);
  };

  const handleDownloadReceipt = (delivery: PPEDelivery) => {
    const content = `
      COMPROVANTE DE ENTREGA DE EPI
      
      Funcionário: ${delivery.employeeName}
      Cargo: ${delivery.position}
      Departamento: ${delivery.department}
      
      EPI: ${delivery.ppeName}
      Data de Entrega: ${delivery.issueDate}
      Data de Validade: ${delivery.expiryDate}
      
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

  const confirmDeletePPE = () => {
    if (selectedDelivery) {
      setDeliveries(prev => prev.filter(d => d.id !== selectedDelivery.id));
      toast({
        title: "EPI excluído",
        description: `O registro de entrega de ${selectedDelivery.ppeName} para ${selectedDelivery.employeeName} foi excluído`
      });
      setDeleteDialogOpen(false);
    }
  };

  const updateLocalStorage = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error(`Erro ao salvar no localStorage: ${error}`);
      return false;
    }
  };

  const handleSaveDelivery = () => {
    if (!formData.employeeName || !formData.ppeName || !formData.issueDate || !formData.expiryDate) {
      toast({
        title: "Erro ao salvar",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    if (new Date(formData.expiryDate) <= new Date(formData.issueDate)) {
      toast({
        title: "Erro ao salvar",
        description: "A data de validade deve ser posterior à data de entrega.",
        variant: "destructive"
      });
      return;
    }

    const newDelivery: PPEDelivery = {
      id: deliveries.length + 1,
      employeeId: employeeData.find(emp => emp.name === formData.employeeName)?.id || 0,
      employeeName: formData.employeeName,
      position: employeeData.find(emp => emp.name === formData.employeeName)?.position || '',
      department: employeeData.find(emp => emp.name === formData.employeeName)?.department || '',
      ppeId: ppeData.find(ppe => ppe.name === formData.ppeName)?.id || 0,
      ppeName: formData.ppeName,
      issueDate: formData.issueDate,
      expiryDate: formData.expiryDate,
      status: 'valid',
      signature: false
    };

    const updatedDeliveries = [...deliveries, newDelivery];
    setDeliveries(updatedDeliveries);

    updateLocalStorage('ppeDeliveries', updatedDeliveries);
    
    toast({
      title: "Entrega registrada",
      description: `A entrega de ${formData.ppeName} para ${formData.employeeName} foi registrada com sucesso.`
    });

    resetForm();
    setIsDeliveryDialogOpen(false);
  };

  const handleDownloadDeliveryTable = () => {
    const headers = ['Funcionário', 'Departamento', 'EPI', 'Data Entrega', 'Data Validade', 'Status'];
    
    const rows = filteredDeliveries.map(delivery => [
      delivery.employeeName,
      delivery.department,
      delivery.ppeName,
      new Date(delivery.issueDate).toLocaleDateString('pt-BR'),
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestão de EPIs</h1>

        <div className="flex gap-3">
          <Dialog open={isNewPPEDialogOpen} onOpenChange={setIsNewPPEDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Shield className="mr-2 h-4 w-4" /> Cadastrar EPI
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle>Cadastrar Novo EPI</DialogTitle>
                <DialogDescription>
                  Adicione um novo equipamento de proteção individual ao sistema.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Nome do EPI</label>
                    <Input placeholder="Ex: Capacete de Segurança" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Número do CA</label>
                    <Input placeholder="Ex: CA-12345" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Tipo de Proteção</label>
                    <Input placeholder="Ex: Proteção para cabeça" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Validade (meses)</label>
                    <Input type="number" placeholder="Ex: 12" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Descrição</label>
                    <Input placeholder="Detalhes adicionais sobre o EPI" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewPPEDialogOpen(false)}>Cancelar</Button>
                <Button 
                  className="bg-safety-blue hover:bg-safety-blue/90"
                  onClick={handleSavePPE}
                >
                  Salvar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isDeliveryDialogOpen} onOpenChange={setIsDeliveryDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-safety-blue hover:bg-safety-blue/90">
                <Plus className="mr-2 h-4 w-4" /> Nova Entrega
              </Button>
            </DialogTrigger>
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
                        {employeeData.map((employee) => (
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
                        {ppeData.map((ppe) => (
                          <SelectItem key={ppe.id} value={ppe.name}>
                            {ppe.name} - {ppe.ca}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Data de Entrega</label>
                    <Input 
                      type="date"
                      value={formData.issueDate}
                      onChange={(e) => setField('issueDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Validade</label>
                    <Input 
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setField('expiryDate', e.target.value)}
                    />
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
                <Button variant="outline" onClick={() => setIsDeliveryDialogOpen(false)}>Cancelar</Button>
                <Button 
                  className="bg-safety-blue hover:bg-safety-blue/90"
                  onClick={handleSaveDelivery}
                >
                  Salvar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Gestão de Equipamentos de Proteção Individual</CardTitle>
          <CardDescription>
            Gerencie todos os EPIs da empresa, controle entregas e vencimentos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Pesquisar EPIs ou funcionários..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" /> Filtros
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Departamento</DropdownMenuItem>
                <DropdownMenuItem>Tipo de EPI</DropdownMenuItem>
                <DropdownMenuItem>Status</DropdownMenuItem>
                <DropdownMenuItem>Data de Validade</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Tabs defaultValue="deliveries" onValueChange={setCurrentTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="deliveries" className="flex gap-2">
                <UserCheck className="h-4 w-4" /> Entregas
              </TabsTrigger>
              <TabsTrigger value="inventory" className="flex gap-2">
                <Shield className="h-4 w-4" /> Catálogo
              </TabsTrigger>
            </TabsList>

            <TabsContent value="deliveries" className="m-0">
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
                        <TableHead>
                          <div className="flex items-center">
                            Validade
                            <Calendar className="ml-1 h-3 w-3" />
                          </div>
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDeliveries.length > 0 ? (
                        filteredDeliveries.map(delivery => (
                          <TableRow key={delivery.id}>
                            <TableCell className="font-medium">
                              {delivery.employeeName}
                            </TableCell>
                            <TableCell>{delivery.department}</TableCell>
                            <TableCell>{delivery.ppeName}</TableCell>
                            <TableCell>
                              {new Date(delivery.issueDate).toLocaleDateString('pt-BR')}
                            </TableCell>
                            <TableCell>
                              {new Date(delivery.expiryDate).toLocaleDateString('pt-BR')}
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
                                    onClick={() => handleDeletePPE(delivery)}
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
            </TabsContent>

            <TabsContent value="inventory" className="m-0">
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
                    {filteredItems.length > 0 ? (
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
                                <DropdownMenuItem onClick={() => handleEditPPE(item)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleViewPPEHistory(item)}>
                                  <History className="mr-2 h-4 w-4" />
                                  Ver Histórico
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-red-500"
                                  onClick={() => handleConfirmDeletePPE(item)}
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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <PPEDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        delivery={selectedDelivery}
      />

      <PPERenewalDialog
        open={renewalDialogOpen}
        onOpenChange={setRenewalDialogOpen}
        delivery={selectedDelivery}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este registro de entrega de EPI?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700"
              onClick={confirmDeletePPE}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog para editar um EPI */}
      <Dialog open={isEditPPEDialogOpen} onOpenChange={setIsEditPPEDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Editar EPI</DialogTitle>
            <DialogDescription>
              Atualize as informações do equipamento de proteção individual.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Nome do EPI</label>
                <Input 
                  name="edit-ppe-name"
                  defaultValue={selectedPPEItem?.name || ''}
                  placeholder="Ex: Capacete de Segurança"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Número do CA</label>
                <Input 
                  name="edit-ppe-ca"
                  defaultValue={selectedPPEItem?.ca || ''}
                  placeholder="Ex: CA-12345"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tipo de Proteção</label>
                <Input 
                  name="edit-ppe-type"
                  defaultValue={selectedPPEItem?.type || ''}
                  placeholder="Ex: Proteção para cabeça"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Validade (meses)</label>
                <Input 
                  name="edit-ppe-validity"
                  type="number" 
                  defaultValue={selectedPPEItem?.validityPeriod.toString() || ''}
                  placeholder="Ex: 12"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Descrição</label>
                <Input 
                  name="edit-ppe-description"
                  defaultValue={selectedPPEItem?.description || ''}
                  placeholder="Detalhes adicionais sobre o EPI"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditPPEDialogOpen(false)}>Cancelar</Button>
            <Button 
              className="bg-safety-blue hover:bg-safety-blue/90"
              onClick={handleUpdatePPE}
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para ver histórico de entregas de um EPI */}
      <Dialog open={isPPEHistoryDialogOpen} onOpenChange={setIsPPEHistoryDialogOpen}>
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
                  {selectedPPEItem && deliveries.filter(d => d.ppeId === selectedPPEItem.id).length > 0 ? (
                    deliveries
                      .filter(d => d.ppeId === selectedPPEItem?.id)
                      .map(delivery => (
                        <TableRow key={delivery.id}>
                          <TableCell className="font-medium">{delivery.employeeName}</TableCell>
                          <TableCell>{delivery.department}</TableCell>
                          <TableCell>{new Date(delivery.issueDate).toLocaleDateString('pt-BR')}</TableCell>
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
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        Nenhuma entrega encontrada para este EPI
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button onClick={() => setIsPPEHistoryDialogOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para confirmar a exclusão de um EPI */}
      <AlertDialog open={isDeletePPEDialogOpen} onOpenChange={setIsDeletePPEDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o EPI "{selectedPPEItem?.name}"? Esta ação não pode ser desfeita.
              {deliveries.filter(d => d.ppeId === selectedPPEItem?.id).length > 0 && (
                <p className="mt-2 text-red-500">
                  <strong>Atenção:</strong> Existem entregas registradas para este EPI. 
                  Elas também serão excluídas.
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700"
              onClick={confirmDeletePPEItem}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default PPEManagement;
