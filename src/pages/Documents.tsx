
import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Plus, 
  Search, 
  Upload,
  FileArchive,
  Trash2,
  X
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Document {
  id: number;
  name: string;
  type: 'ASO' | 'PPRA' | 'PCMSO' | 'LTCAT' | string;
  company: string;
  sector: string;
  employee?: string;
  status: 'valid' | 'expiring' | 'expired';
  expiryDate: string;
  uploadDate: string;
  fileUrl?: string;
  linkTo: 'company' | 'employee';
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
    uploadDate: '2025-01-15',
    fileUrl: 'https://example.com/docs/aso_joao_silva.pdf',
    linkTo: 'employee'
  },
  {
    id: 2,
    name: 'PPRA - Setor Produção',
    type: 'PPRA',
    company: 'Indústria ABC',
    sector: 'Produção',
    status: 'expiring',
    expiryDate: '2025-05-20',
    uploadDate: '2024-05-20',
    fileUrl: 'https://example.com/docs/ppra_producao.pdf',
    linkTo: 'company'
  },
  {
    id: 3,
    name: 'LTCAT - Geral',
    type: 'LTCAT',
    company: 'Indústria ABC',
    sector: 'Todos',
    status: 'expired',
    expiryDate: '2025-03-10',
    uploadDate: '2024-03-10',
    fileUrl: 'https://example.com/docs/ltcat_geral.pdf',
    linkTo: 'company'
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
    uploadDate: '2024-12-05',
    fileUrl: 'https://example.com/docs/aso_maria_oliveira.pdf',
    linkTo: 'employee'
  },
  {
    id: 5,
    name: 'PCMSO - Geral',
    type: 'PCMSO',
    company: 'Indústria ABC',
    sector: 'Todos',
    status: 'valid',
    expiryDate: '2025-09-15',
    uploadDate: '2024-09-15',
    fileUrl: 'https://example.com/docs/pcmso_geral.pdf',
    linkTo: 'company'
  }
];

export default function Documents() {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>(documentsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('employees');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [searchEmployeeTerm, setSearchEmployeeTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentTab, setCurrentTab] = useState('all');
  const [selectedType, setSelectedType] = useState('');
  const [formData, setFormData] = useState<Partial<Document>>({  
    name: '',
    type: '',
    company: '',
    sector: '',
    employee: '',
    expiryDate: '',
    uploadDate: new Date().toISOString().split('T')[0],
    status: 'valid' as const,
    linkTo: 'company' as const,
    fileUrl: undefined
  });
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSaveDocument = () => {
    const missingFields = [];
    
    if (!formData.type || formData.type === 'Selecione o tipo') missingFields.push('Tipo de documento');
    if (!formData.company?.trim()) missingFields.push('Empresa');
    if (!formData.sector?.trim()) missingFields.push('Setor');
    if (!formData.expiryDate) missingFields.push('Data de validade');
    if (!selectedFile) missingFields.push('Arquivo do documento');
    if (formData.name?.trim() === '') missingFields.push('Nome do documento');

    if (missingFields.length > 0) {
      toast({
        title: "Campos obrigatórios",
        description: `Por favor, preencha os seguintes campos:\n- ${missingFields.join('\n- ')}`,
        variant: "destructive"
      });
      return;
    }

    const newDocument: Document = {
      id: documentsData.length + 1,
      name: `${formData.type} - ${formData.company}`,
      type: formData.type!,
      company: formData.company!,
      sector: formData.sector!,
      employee: formData.employee || undefined,
      status: 'valid',
      expiryDate: formData.expiryDate!,
      uploadDate: new Date().toISOString().split('T')[0],
      fileUrl: URL.createObjectURL(selectedFile),
      linkTo: formData.linkTo || 'company'
    };

    documentsData.push(newDocument);
    setDocuments([...documentsData]);

    setFormData({
      type: '',
      company: '',
      sector: '',
      employee: '',
      expiryDate: '',
      linkTo: 'company'
    });
    setSelectedFile(null);

    const closeButton = document.querySelector('[aria-label="Close"]');
    if (closeButton instanceof HTMLButtonElement) {
      closeButton.click();
    }

    toast({
      title: "Sucesso",
      description: "Documento salvo com sucesso!"
    });
  };

  const handleDeleteDocument = (docId: number) => {
    if (confirm('Tem certeza que deseja excluir este documento?')) {
      const updatedDocuments = documentsData.filter(d => d.id !== docId);
      documentsData.length = 0;
      documentsData.push(...updatedDocuments);
      setDocuments([...documentsData]);
      
      toast({
        title: "Documento excluído",
        description: "O documento foi excluído com sucesso."
      });
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (doc.employee && doc.employee.toLowerCase().includes(searchTerm.toLowerCase()));
                         
    const matchesTab = 
      currentTab === 'all' ||
      (currentTab === 'valid' && doc.status === 'valid') ||
      (currentTab === 'expiring' && doc.status === 'expiring') ||
      (currentTab === 'expired' && doc.status === 'expired');

    const matchesType = !selectedType || doc.type === selectedType;
      
    return matchesSearch && matchesTab && matchesType;
  });

  const renderStatusBadge = (status: Document['status']) => {
    const statusConfig = {
      valid: { text: 'Válido', className: 'bg-green-500' },
      expiring: { text: 'A vencer', className: 'bg-yellow-500' },
      expired: { text: 'Vencido', className: 'bg-red-500' }
    };

    return (
      <Badge className={statusConfig[status].className}>
        {statusConfig[status].text}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>{selectedDocument?.name}</DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewDialogOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-auto p-4">
            {selectedDocument?.fileUrl ? (
              <iframe
                src={selectedDocument.fileUrl}
                className="w-full h-[70vh]"
                title={selectedDocument.name}
              />
            ) : (
              <div className="flex items-center justify-center h-[70vh] text-gray-500">
                Não foi possível carregar o documento
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Documentos Legais</h1>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Novo Documento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Documento</DialogTitle>
              <DialogDescription>
                Preencha as informações do documento e faça o upload do arquivo PDF.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right font-medium">Nome do Documento</Label>
                <Input
                  id="name"
                  placeholder="Ex: ASO - João Silva"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right font-medium">Tipo de Documento</Label>
                <select
                  id="type"
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="">Selecione o tipo</option>
                  <option value="ASO">ASO</option>
                  <option value="PPRA">PPRA</option>
                  <option value="PCMSO">PCMSO</option>
                  <option value="LTCAT">LTCAT</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="employee" className="text-right font-medium">Funcionário</Label>
                <select
                  id="employee"
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={formData.employee}
                  onChange={(e) => setFormData({ ...formData, employee: e.target.value })}
                >
                  <option value="">Selecione o funcionário</option>
                  <option value="João Silva">João Silva</option>
                  <option value="Maria Oliveira">Maria Oliveira</option>
                  <option value="Carlos Ferreira">Carlos Ferreira</option>
                  <option value="Ana Oliveira">Ana Oliveira</option>
                  <option value="Pedro Santos">Pedro Santos</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="company" className="text-right font-medium">Empresa</Label>
                <Input
                  id="company"
                  placeholder="Nome da empresa"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sector" className="text-right font-medium">Setor</Label>
                <Input
                  id="sector"
                  placeholder="Ex: Produção, Administrativo"
                  value={formData.sector}
                  onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="expiryDate" className="text-right font-medium">Data de Validade</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Arquivo</Label>
                <div className="col-span-3 border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">Arraste e solte um arquivo ou clique para selecionar</p>
                  <p className="mt-1 text-xs text-gray-500">PDF, JPEG ou PNG (Máx. 5MB)</p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".pdf,.jpeg,.jpg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 5 * 1024 * 1024) {
                          toast({
                            title: "Erro",
                            description: "O arquivo deve ter no máximo 5MB",
                            variant: "destructive"
                          });
                          return;
                        }
                        setSelectedFile(file);
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {selectedFile ? selectedFile.name : 'Selecionar Arquivo'}
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <DialogTrigger asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogTrigger>
              <Button
                className="bg-safety-blue hover:bg-safety-blue/90"
                onClick={handleSaveDocument}
              >
                Salvar
              </Button>
            </DialogFooter>
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
          <div className="flex gap-4 items-center mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input 
                type="search"
                placeholder="Pesquisar documentos..." 
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="employees" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Funcionários
              </TabsTrigger>
              <TabsTrigger value="company" className="flex items-center gap-2">
                <FileArchive className="h-4 w-4" />
                Empresa
              </TabsTrigger>
            </TabsList>

            <TabsContent value="employees" className="mt-6">
              <div className="grid grid-cols-4 gap-6">
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle className="text-lg">Funcionários</CardTitle>
                    <CardDescription>Selecione um funcionário para ver seus documentos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                        <Input 
                          type="search"
                          placeholder="Buscar funcionário..." 
                          className="pl-8"
                          value={searchEmployeeTerm}
                          onChange={(e) => setSearchEmployeeTerm(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2 max-h-[400px] overflow-y-auto">
                        {documentsData
                          .filter(doc => doc.employee)
                          .map(doc => doc.employee)
                          .filter((employee, index, self) => 
                            employee && 
                            self.indexOf(employee) === index &&
                            employee.toLowerCase().includes(searchEmployeeTerm.toLowerCase())
                          )
                          .map(employee => (
                            <Button
                              key={employee}
                              variant={selectedEmployee === employee ? "default" : "outline"}
                              className="w-full justify-start"
                              onClick={() => setSelectedEmployee(employee)}
                            >
                              {employee}
                            </Button>
                          ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {selectedEmployee ? `Documentos de ${selectedEmployee}` : "Selecione um funcionário"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedEmployee && (
                      <div className="space-y-4">
                        {documentsData
                          .filter(doc => doc.employee === selectedEmployee)
                          .map(doc => (
                            <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                              <div className="flex-1">
                                <h3 className="font-medium">{doc.name}</h3>
                                <p className="text-sm text-gray-500">Validade: {doc.expiryDate}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                {renderStatusBadge(doc.status)}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedDocument(doc);
                                    setViewDialogOpen(true);
                                  }}
                                >
                                  <FileText className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-500 hover:text-red-700"
                                  onClick={() => handleDeleteDocument(doc.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="company" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Documentos da Empresa</CardTitle>
                  <CardDescription>Documentos gerais e por setor</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {documentsData
                      .filter(doc => !doc.employee)
                      .map(doc => (
                        <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <h3 className="font-medium">{doc.name}</h3>
                            <p className="text-sm text-gray-500">
                              Setor: {doc.sector} | Validade: {doc.expiryDate}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {renderStatusBadge(doc.status)}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedDocument(doc);
                                setViewDialogOpen(true);
                              }}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleDeleteDocument(doc.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
