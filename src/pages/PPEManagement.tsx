import { useState } from 'react';
import { calculatePPEStatus, formatExpiryDate } from '@/utils/ppe-status';
import { useToast } from "@/hooks/use-toast";
import { usePPEForm } from '@/hooks/use-ppe-form';
import { useEmployees } from '@/hooks/use-employees';
import { usePPEManagement } from '@/features/ppe/hooks/use-ppe-management';
import { PPEItem } from '@/services/types'; // Keep this import for PPEItem type
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
  History,
  Loader2
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
  DialogClose
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
import { useQuery } from '@tanstack/react-query';
import { ppeItemService } from '@/features/ppe/services/ppe-service';

function PPEManagement(): JSX.Element {
  // Usando o hook customizado para gestão de EPIs
  const ppeManagement = usePPEManagement();
  const { employees } = useEmployees();
  const { toast } = useToast();

  const handleDownloadReceipt = (delivery: any) => {
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Gestão de EPIs</h1>

        <div className="flex gap-3">
          <Dialog open={ppeManagement.isNewPPEDialogOpen} onOpenChange={ppeManagement.setIsNewPPEDialogOpen}>
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
                    <Input 
                      placeholder="Ex: Capacete de Segurança" 
                      value={ppeManagement.formData.name}
                      onChange={(e) => ppeManagement.setField('name', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Número do CA</label>
                    <Input 
                      placeholder="Ex: CA-12345" 
                      value={ppeManagement.formData.ca}
                      onChange={(e) => ppeManagement.setField('ca', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Tipo de Proteção</label>
                    <Input 
                      placeholder="Ex: Proteção para cabeça" 
                      value={ppeManagement.formData.type}
                      onChange={(e) => ppeManagement.setField('type', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Validade (meses)</label>
                    <Input 
                      type="number" 
                      placeholder="Ex: 12" 
                      value={ppeManagement.formData.validity_period?.toString() || ''}
                      onChange={(e) => ppeManagement.setField('validity_period', e.target.value)}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Descrição</label>
                    <Input 
                      placeholder="Detalhes adicionais sobre o EPI" 
                      value={ppeManagement.formData.description}
                      onChange={(e) => ppeManagement.setField('description', e.target.value)}
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
                  onClick={ppeManagement.handleSavePPE}
                  disabled={ppeManagement.loading}
                >
                  {ppeManagement.loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando
                    </>
                  ) : 'Salvar'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={ppeManagement.isDeliveryDialogOpen} onOpenChange={ppeManagement.setIsDeliveryDialogOpen}>
            <DialogTrigger asChild>
              <Button>
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
                      value={ppeManagement.formData.employeeName}
                      onValueChange={(value) => ppeManagement.setField('employeeName', value)}
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
                      value={ppeManagement.formData.ppeName}
                      onValueChange={(value) => ppeManagement.setField('ppeName', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o EPI" />
                      </SelectTrigger>
                      <SelectContent>
                        {ppeManagement.ppeItems.map((ppe) => (
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
                      value={ppeManagement.formData.delivery_date}
                      onChange={(e) => ppeManagement.setField('delivery_date', e.target.value)}
                    />
                    {ppeManagement.formData.ppeName && ppeManagement.formData.delivery_date && (
                      <p className="text-sm text-gray-500 mt-1">
                        Data de vencimento calculada: {formatExpiryDate(
                          ppeManagement.formData.delivery_date, 
                          ppeManagement.ppeItems.find(ppe => ppe.name === ppeManagement.formData.ppeName)?.validityPeriod || 0
                        )}
                      </p>
                    )}
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Observações</label>
                    <Input 
                      placeholder="Informações adicionais"
                      value={ppeManagement.formData.observations}
                      onChange={(e) => ppeManagement.setField('observations', e.target.value)}
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
                  onClick={() => {
                    // Encontre o funcionário selecionado
                    const selectedEmployee = employees.find(emp => emp.name === ppeManagement.formData.employeeName);
                    // Encontre o EPI selecionado
                    const selectedPPE = ppeManagement.ppeItems.find(ppe => ppe.name === ppeManagement.formData.ppeName);
                    
                    if (!selectedEmployee || !selectedPPE || !ppeManagement.formData.delivery_date) {
                      toast({
                        title: "Erro ao salvar",
                        description: "Por favor, preencha todos os campos obrigatórios.",
                        variant: "destructive"
                      });
                      return;
                    }

                    // Calcule a data de vencimento baseada no período de validade do EPI
                    const issueDate = new Date(ppeManagement.formData.delivery_date);
                    const expiryDate = new Date(issueDate);
                    expiryDate.setMonth(expiryDate.getMonth() + selectedPPE.validityPeriod);
                    const expiryDateStr = expiryDate.toISOString().split('T')[0];

                    // Calcule o status
                    const status = calculatePPEStatus(
                      ppeManagement.formData.delivery_date, 
                      selectedPPE.validityPeriod
                    ).status;

                    // Prepare os dados da entrega
                    const deliveryData = {
                      employee_id: selectedEmployee.id,
                      employeeName: selectedEmployee.name,
                      position: selectedEmployee.position,
                      department: selectedEmployee.department,
                      ppe_id: selectedPPE.id,
                      ppeName: selectedPPE.name,
                      delivery_date: ppeManagement.formData.delivery_date,
                      expiryDate: expiryDateStr,
                      quantity: 1,
                      status,
                      signature: false
                    };

                    ppeManagement.handleSaveDelivery(deliveryData);
                  }}
                  disabled={ppeManagement.loading}
                >
                  {ppeManagement.loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando
                    </>
                  ) : 'Salvar'}
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
                value={ppeManagement.searchTerm}
                onChange={(e) => ppeManagement.setSearchTerm(e.target.value)}
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
                      {ppeManagement.loading ? (
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
                      ) : ppeManagement.filteredDeliveries.length > 0 ? (
                        ppeManagement.filteredDeliveries.map(delivery => (
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
                                  <DropdownMenuItem onClick={() => ppeManagement.handleShowDetails(delivery)}>
                                    <Info className="mr-2 h-4 w-4" />
                                    Detalhes
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => ppeManagement.handleRenewPPE(delivery)}>
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Renovar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleDownloadReceipt(delivery)}>
                                    <Download className="mr-2 h-4 w-4" />
                                    Baixar Comprovante
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="text-red-500"
                                    onClick={() => ppeManagement.handleDeleteDelivery(delivery)}
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
                    {ppeManagement.loading ? (
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
                    ) : ppeManagement.filteredItems.length > 0 ? (
                      ppeManagement.filteredItems.map(item => (
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
                                  ppeManagement.setSelectedPPEItem(item);
                                  ppeManagement.setIsEditPPEDialogOpen(true);
                                }}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  ppeManagement.setSelectedPPEItem(item);
                                  ppeManagement.setIsPPEHistoryDialogOpen(true);
                                }}>
                                  <History className="mr-2 h-4 w-4" />
                                  Ver Histórico
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-red-500"
                                  onClick={() => {
                                    ppeManagement.setSelectedPPEItem(item);
                                    ppeManagement.setIsDeletePPEDialogOpen(true);
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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Diálogos de detalhes e ações */}
      <PPEDetailDialog
        open={ppeManagement.detailDialogOpen}
        onOpenChange={ppeManagement.setDetailDialogOpen}
        delivery={ppeManagement.selectedDelivery}
      />

      <PPERenewalDialog
        open={ppeManagement.renewalDialogOpen}
        onOpenChange={ppeManagement.setRenewalDialogOpen}
        delivery={ppeManagement.selectedDelivery}
      />

      <AlertDialog open={ppeManagement.deleteDialogOpen} onOpenChange={ppeManagement.setDeleteDialogOpen}>
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
              onClick={ppeManagement.handleConfirmDeleteDelivery}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={ppeManagement.isEditPPEDialogOpen} onOpenChange={ppeManagement.setIsEditPPEDialogOpen}>
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
                  defaultValue={ppeManagement.selectedPPEItem?.name || ''}
                  placeholder="Ex: Capacete de Segurança"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Número do CA</label>
                <Input 
                  name="edit-ppe-ca"
                  defaultValue={ppeManagement.selectedPPEItem?.ca || ''}
                  placeholder="Ex: CA-12345"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tipo de Proteção</label>
                <Input 
                  name="edit-ppe-type"
                  defaultValue={ppeManagement.selectedPPEItem?.type || ''}
                  placeholder="Ex: Proteção para cabeça"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Validade (meses)</label>
                <Input 
                  name="edit-ppe-validity"
                  type="number" 
                  defaultValue={ppeManagement.selectedPPEItem?.validityPeriod.toString() || ''}
                  placeholder="Ex: 12"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Descrição</label>
                <Input 
                  name="edit-ppe-description"
                  defaultValue={ppeManagement.selectedPPEItem?.description || ''}
                  placeholder="Detalhes adicionais sobre o EPI"
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
              onClick={() => {
                if (!ppeManagement.selectedPPEItem) return;

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

                const updatedData: Partial<PPEItem> = {
                  name: nameInput.value,
                  ca: caInput.value,
                  type: typeInput.value,
                  validityPeriod: parseInt(validityInput.value),
                  description: descriptionInput?.value || ''
                };

                ppeManagement.handleUpdatePPE(ppeManagement.selectedPPEItem.id, updatedData);
              }}
              disabled={ppeManagement.loading}
            >
              {ppeManagement.loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando
                </>
              ) : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={ppeManagement.isPPEHistoryDialogOpen} onOpenChange={ppeManagement.setIsPPEHistoryDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Histórico de Entregas - {ppeManagement.selectedPPEItem?.name}</DialogTitle>
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
                  {ppeManagement.loading ? (
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
                  ) : ppeManagement.selectedPPEItem && ppeManagement.deliveries.filter(d => d.ppe_id === ppeManagement.selectedPPEItem?.id).length > 0 ? (
                    ppeManagement.deliveries
                      .filter(d => d.ppe_id === ppeManagement.selectedPPEItem?.id)
                      .map(delivery => (
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
            <DialogClose asChild>
              <Button>Fechar</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={ppeManagement.isDeletePPEDialogOpen} onOpenChange={ppeManagement.setIsDeletePPEDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o EPI "{ppeManagement.selectedPPEItem?.name}"? Esta ação não pode ser desfeita.
              {ppeManagement.deliveries.filter(d => d.ppe_id === ppeManagement.selectedPPEItem?.id).length > 0 && (
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
              onClick={() => {
                if (ppeManagement.selectedPPEItem) {
                  ppeManagement.handleDeletePPE(ppeManagement.selectedPPEItem.id);
                }
              }}
              disabled={ppeManagement.loading}
            >
              {ppeManagement.loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Excluindo
                </>
              ) : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default PPEManagement;
