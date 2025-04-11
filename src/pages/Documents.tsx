
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Plus, 
  Search, 
  Upload,
  AlertCircle,
  CheckCircle,
  Clock,
  Filter,
  FileArchive,
  FilePlus2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Document {
  id: number;
  name: string;
  type: string;
  company: string;
  sector: string;
  employee?: string;
  status: 'valid' | 'expiring' | 'expired';
  expiryDate: string;
  uploadDate: string;
}

const documentsData: Document[] = [
  {
    id: 1,
    name: 'ASO - João Silva',
    type: 'ASO',
    company: 'Indústria ABC',
    sector: 'Produção',
    employee: 'João Silva',
    status: 'valid',
    expiryDate: '2026-01-15',
    uploadDate: '2025-01-15'
  },
  {
    id: 2,
    name: 'PPRA - Setor Produção',
    type: 'PPRA',
    company: 'Indústria ABC',
    sector: 'Produção',
    status: 'expiring',
    expiryDate: '2025-05-20',
    uploadDate: '2024-05-20'
  },
  {
    id: 3,
    name: 'LTCAT - Geral',
    type: 'LTCAT',
    company: 'Indústria ABC',
    sector: 'Todos',
    status: 'expired',
    expiryDate: '2025-03-10',
    uploadDate: '2024-03-10'
  },
  {
    id: 4,
    name: 'ASO - Maria Oliveira',
    type: 'ASO',
    company: 'Indústria ABC',
    sector: 'Administrativo',
    employee: 'Maria Oliveira',
    status: 'valid',
    expiryDate: '2025-12-05',
    uploadDate: '2024-12-05'
  },
  {
    id: 5,
    name: 'PCMSO - Geral',
    type: 'PCMSO',
    company: 'Indústria ABC',
    sector: 'Todos',
    status: 'valid',
    expiryDate: '2025-09-15',
    uploadDate: '2024-09-15'
  }
];

const Documents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState('all');
  
  const filteredDocuments = documentsData.filter(doc => {
    // Apply search filter
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (doc.employee && doc.employee.toLowerCase().includes(searchTerm.toLowerCase()));
                         
    // Apply tab filter
    const matchesTab = 
      currentTab === 'all' ||
      (currentTab === 'valid' && doc.status === 'valid') ||
      (currentTab === 'expiring' && doc.status === 'expiring') ||
      (currentTab === 'expired' && doc.status === 'expired');
      
    return matchesSearch && matchesTab;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Documentos Legais</h1>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-safety-blue hover:bg-safety-blue/90">
              <Plus className="mr-2 h-4 w-4" /> Novo Documento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Documento</DialogTitle>
              <DialogDescription>
                Preencha as informações e faça o upload do arquivo.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Tipo de Documento</label>
                  <Select>
                    <option value="">Selecione o tipo</option>
                    <option value="ASO">ASO</option>
                    <option value="PPRA">PPRA</option>
                    <option value="PCMSO">PCMSO</option>
                    <option value="LTCAT">LTCAT</option>
                    <option value="PPP">PPP</option>
                    <option value="CAT">CAT</option>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Empresa</label>
                  <Input placeholder="Nome da empresa" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Setor</label>
                  <Input placeholder="Nome do setor" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Funcionário (opcional)</label>
                  <Input placeholder="Nome do funcionário" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Data de Validade</label>
                  <Input type="date" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Arquivo</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">Arraste e solte um arquivo ou clique para selecionar</p>
                    <p className="mt-1 text-xs text-gray-500">PDF, JPEG ou PNG (Máx. 5MB)</p>
                    <Button variant="outline" size="sm" className="mt-4">
                      Selecionar Arquivo
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <DialogTrigger asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogTrigger>
              <Button className="bg-safety-blue hover:bg-safety-blue/90">Salvar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Gerenciamento de Documentos</CardTitle>
          <CardDescription>
            Gerencie todos os documentos legais de SST, controle vencimentos e mantenha-se em conformidade.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input 
                type="search"
                placeholder="Pesquisar documentos..." 
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
                <DropdownMenuItem>Tipo de Documento</DropdownMenuItem>
                <DropdownMenuItem>Empresa</DropdownMenuItem>
                <DropdownMenuItem>Setor</DropdownMenuItem>
                <DropdownMenuItem>Data de Validade</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <Tabs defaultValue="all" onValueChange={setCurrentTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all" className="flex gap-2">
                <FileText className="h-4 w-4" /> Todos
              </TabsTrigger>
              <TabsTrigger value="valid" className="flex gap-2">
                <CheckCircle className="h-4 w-4" /> Válidos
              </TabsTrigger>
              <TabsTrigger value="expiring" className="flex gap-2">
                <Clock className="h-4 w-4" /> A Vencer
              </TabsTrigger>
              <TabsTrigger value="expired" className="flex gap-2">
                <AlertCircle className="h-4 w-4" /> Vencidos
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="m-0">
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3">Documento</th>
                      <th scope="col" className="px-6 py-3">Empresa</th>
                      <th scope="col" className="px-6 py-3">Setor</th>
                      <th scope="col" className="px-6 py-3">Validade</th>
                      <th scope="col" className="px-6 py-3">Status</th>
                      <th scope="col" className="px-6 py-3">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDocuments.length > 0 ? (
                      filteredDocuments.map(doc => (
                        <tr key={doc.id} className="bg-white border-b hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-900">
                            <div className="flex items-center gap-2">
                              {doc.type === 'ASO' ? (
                                <FileText className="h-4 w-4 text-blue-500" />
                              ) : doc.type === 'PPRA' || doc.type === 'PCMSO' ? (
                                <FileArchive className="h-4 w-4 text-green-500" />
                              ) : (
                                <FilePlus2 className="h-4 w-4 text-purple-500" />
                              )}
                              {doc.name}
                            </div>
                          </td>
                          <td className="px-6 py-4">{doc.company}</td>
                          <td className="px-6 py-4">{doc.sector}</td>
                          <td className="px-6 py-4">
                            {new Date(doc.expiryDate).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="px-6 py-4">
                            {doc.status === 'valid' && (
                              <Badge className="bg-safety-green">Válido</Badge>
                            )}
                            {doc.status === 'expiring' && (
                              <Badge className="bg-safety-orange">A vencer</Badge>
                            )}
                            {doc.status === 'expired' && (
                              <Badge className="bg-safety-red">Vencido</Badge>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  Ações
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Visualizar</DropdownMenuItem>
                                <DropdownMenuItem>Editar</DropdownMenuItem>
                                <DropdownMenuItem>Renovar</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-500">Excluir</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                          Nenhum documento encontrado
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            
            <TabsContent value="valid" className="m-0">
              {/* Content for valid documents tab - will be filtered automatically */}
            </TabsContent>
            
            <TabsContent value="expiring" className="m-0">
              {/* Content for expiring documents tab - will be filtered automatically */}
            </TabsContent>
            
            <TabsContent value="expired" className="m-0">
              {/* Content for expired documents tab - will be filtered automatically */}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Documents;
