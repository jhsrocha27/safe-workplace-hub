
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ClipboardCheck, Search, Plus, AlertTriangle, CheckCircle, Filter, CalendarIcon, FileText } from "lucide-react";
import { InspectionReportDialog } from "@/components/inspections/InspectionReportDialog";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useNavigate } from 'react-router-dom';
import { EditInspectionDialog } from '@/components/inspections/EditInspectionDialog';

interface Inspection {
  id: string;
  title: string;
  type: 'safety' | 'environmental' | 'quality';
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  location: string;
  date: Date;
  inspector: string;
  findings: string[];
  hasReport?: boolean;
  reportPdfUrl?: string;
  report?: {
    generalObservations: string;
    nonConformities: string;
    correctiveActions: string;
    recommendations: string;
  };
}

// Mock data for inspections
const mockInspections: Inspection[] = [
  {
    id: '1',
    title: 'Inspeção de extintores de incêndio',
    type: 'safety',
    status: 'completed',
    priority: 'high',
    location: 'Bloco A - Andar 1',
    date: new Date('2025-04-05'),
    inspector: 'Carlos Silva',
    findings: ['Extintor 3 com pressão abaixo do recomendado', 'Sinalização adequada em todos os pontos'],
    hasReport: true,
    reportPdfUrl: 'https://example.com/reports/inspection-1.pdf'
  },
  {
    id: '2',
    title: 'Verificação de EPIs na área de produção',
    type: 'safety',
    status: 'pending',
    priority: 'high',
    location: 'Área de Produção',
    date: new Date('2025-04-15'),
    inspector: 'Ana Costa',
    findings: []
  },
  {
    id: '3',
    title: 'Inspeção de descarte de resíduos',
    type: 'environmental',
    status: 'in_progress',
    priority: 'medium',
    location: 'Depósito Central',
    date: new Date('2025-04-08'),
    inspector: 'Marcelo Alves',
    findings: ['Contaminação no sistema de captação', 'Recipientes sem identificação']
  },
  {
    id: '4',
    title: 'Avaliação de ergonomia nos escritórios',
    type: 'safety',
    status: 'completed',
    priority: 'medium',
    location: 'Setor Administrativo',
    date: new Date('2025-04-01'),
    inspector: 'Regina Santos',
    findings: ['3 cadeiras inadequadas identificadas', 'Ajuste de altura de monitores recomendado'],
    hasReport: true,
    reportPdfUrl: 'https://example.com/reports/inspection-4.pdf'
  },
  {
    id: '5',
    title: 'Inspeção de ruído na fábrica',
    type: 'safety',
    status: 'pending',
    priority: 'medium',
    location: 'Área de Máquinas',
    date: new Date('2025-04-20'),
    inspector: 'Fernando Lima',
    findings: []
  },
];

// Statistics data
const stats = [
  { title: "Total de Inspeções", value: "156", status: "Todos" },
  { title: "Concluídas", value: "112", status: "completed" },
  { title: "Pendentes", value: "28", status: "pending" },
  { title: "Em Progresso", value: "16", status: "in_progress" },
];

// Inspection areas for filter
const areas = [
  "Todos",
  "Área de Produção",
  "Setor Administrativo",
  "Depósito Central",
  "Refeitório",
  "Bloco A - Andar 1",
  "Área de Máquinas",
];

// Checklist items for new inspection form
const checklistItems = [
  { id: "fire", label: "Equipamentos de combate a incêndio" },
  { id: "exits", label: "Saídas de emergência" },
  { id: "ppe", label: "Uso de EPIs" },
  { id: "tools", label: "Condições de ferramentas" },
  { id: "electricity", label: "Instalações elétricas" },
  { id: "environment", label: "Gestão ambiental" },
];

export default function Inspections() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [inspections, setInspections] = useState<Inspection[]>(mockInspections);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArea, setSelectedArea] = useState("Todos");
  const [selectedStatus, setSelectedStatus] = useState("Todos");
  const [isNewInspectionOpen, setIsNewInspectionOpen] = useState(false);
  const [newInspection, setNewInspection] = useState({
    title: "",
    type: "safety",
    location: "",
    date: new Date(),
    inspector: "",
    checklist: [] as string[],
    observations: "",
  });
  
  // Filter inspections based on search query, selected area and status
  const filteredInspections = inspections.filter(inspection => {
    const matchesSearch = inspection.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         inspection.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         inspection.inspector.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesArea = selectedArea === "Todos" || inspection.location === selectedArea;
    const matchesStatus = selectedStatus === "Todos" || inspection.status === selectedStatus.toLowerCase();
    
    return matchesSearch && matchesArea && matchesStatus;
  });

  // Get dynamic stats based on filtered data
  const getDynamicStats = () => [
    { title: "Total de Inspeções", value: inspections.length.toString(), status: "Todos" },
    { title: "Concluídas", value: inspections.filter(i => i.status === 'completed').length.toString(), status: "completed" },
    { title: "Pendentes", value: inspections.filter(i => i.status === 'pending').length.toString(), status: "pending" },
    { title: "Em Progresso", value: inspections.filter(i => i.status === 'in_progress').length.toString(), status: "in_progress" },
  ];

  // Stats calculation for the filtered inspections
  const filteredStats = {
    total: filteredInspections.length,
    completed: filteredInspections.filter(i => i.status === 'completed').length,
    pending: filteredInspections.filter(i => i.status === 'pending').length,
    inProgress: filteredInspections.filter(i => i.status === 'in_progress').length,
  };

  // Status mapping for display
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'completed': return 'Concluída';
      case 'pending': return 'Pendente';
      case 'in_progress': return 'Em Progresso';
      default: return status;
    }
  };

  // Handler for clicking on stats cards
  const handleStatClick = (status: string) => {
    setSelectedStatus(status);
  };

  // Handler for saving inspection report
  const handleSaveReport = (inspectionId: string, reportData: any) => {
    const updatedInspections = inspections.map(inspection =>
      inspection.id === inspectionId
        ? {
            ...inspection,
            hasReport: true,
            reportPdfUrl: reportData.pdfUrl,
            report: {
              generalObservations: reportData.generalObservations,
              nonConformities: reportData.nonConformities,
              correctiveActions: reportData.correctiveActions,
              recommendations: reportData.recommendations
            }
          }
        : inspection
    );
    setInspections(updatedInspections);
    toast({
      title: "Relatório salvo",
      description: "O relatório da inspeção foi salvo com sucesso."
    });
  };

  // Handler for updating inspection
  const handleUpdateInspection = (id: string, updates: { date?: Date; status?: 'pending' | 'in_progress' | 'completed' }) => {
    const updatedInspections = inspections.map(inspection =>
      inspection.id === id
        ? { ...inspection, ...updates }
        : inspection
    );
    setInspections(updatedInspections);
    toast({
      title: "Inspeção atualizada",
      description: "As alterações foram salvas com sucesso."
    });
  };

  // Handler for deleting inspection
  const handleDeleteInspection = (id: string) => {
    const updatedInspections = inspections.filter(inspection => inspection.id !== id);
    setInspections(updatedInspections);
    toast({
      title: "Inspeção removida",
      description: "A inspeção foi removida com sucesso."
    });
  };

  // Handler for creating a new inspection
  const handleCreateInspection = () => {
    if (!newInspection.title || !newInspection.location || !newInspection.inspector) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const newId = (inspections.length + 1).toString();
    const createdInspection: Inspection = {
      id: newId,
      title: newInspection.title,
      type: newInspection.type as 'safety' | 'environmental' | 'quality',
      status: 'pending',
      priority: 'medium',
      location: newInspection.location,
      date: newInspection.date,
      inspector: newInspection.inspector,
      findings: [],
    };

    setInspections([createdInspection, ...inspections]);
    setIsNewInspectionOpen(false);
    
    toast({
      title: "Inspeção criada",
      description: "A nova inspeção foi criada com sucesso.",
    });
    
    // Reset form
    setNewInspection({
      title: "",
      type: "safety",
      location: "",
      date: new Date(),
      inspector: "",
      checklist: [],
      observations: "",
    });
  };

  // Handler for checklist item change
  const handleChecklistChange = (id: string, checked: boolean) => {
    if (checked) {
      setNewInspection(prev => ({
        ...prev,
        checklist: [...prev.checklist, id]
      }));
    } else {
      setNewInspection(prev => ({
        ...prev,
        checklist: prev.checklist.filter(item => item !== id)
      }));
    }
  };

  // Função para obter o badge de status da inspeção
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-600 hover:bg-green-700 text-white">Concluída</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">Pendente</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-500 hover:bg-blue-600 text-white">Em Progresso</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  // Function to get type badge for inspection
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'safety':
        return <Badge className="bg-blue-500">Segurança</Badge>;
      case 'environmental':
        return <Badge className="bg-green-500">Ambiental</Badge>;
      case 'quality':
        return <Badge className="bg-purple-500">Qualidade</Badge>;
      default:
        return <Badge>Outro</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inspeções</h1>
          <p className="text-muted-foreground">Gerencie e acompanhe as inspeções de segurança.</p>
        </div>
        
        <Dialog open={isNewInspectionOpen} onOpenChange={setIsNewInspectionOpen}>
          <DialogTrigger asChild>
            <Button className="w-full md:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Nova Inspeção
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Criar nova inspeção</DialogTitle>
              <DialogDescription>
                Preencha os detalhes da nova inspeção a ser realizada.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-3">
                <Label htmlFor="title">Título da Inspeção*</Label>
                <Input
                  id="title"
                  placeholder="Ex: Inspeção de Extintores"
                  value={newInspection.title}
                  onChange={(e) => setNewInspection({ ...newInspection, title: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-1 gap-3">
                <Label htmlFor="type">Tipo de Inspeção*</Label>
                <Select
                  value={newInspection.type}
                  onValueChange={(value) => setNewInspection({ ...newInspection, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="safety">Segurança</SelectItem>
                    <SelectItem value="environmental">Ambiental</SelectItem>
                    <SelectItem value="quality">Qualidade</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <Label htmlFor="location">Local*</Label>
                <Select
                  value={newInspection.location}
                  onValueChange={(value) => setNewInspection({ ...newInspection, location: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o local" />
                  </SelectTrigger>
                  <SelectContent>
                    {areas.filter(area => area !== "Todos").map(area => (
                      <SelectItem key={area} value={area}>{area}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <Label>Data Programada*</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !newInspection.date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newInspection.date ? format(newInspection.date, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newInspection.date}
                      onSelect={(date) => setNewInspection({ ...newInspection, date: date || new Date() })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <Label htmlFor="inspector">Inspetor Responsável*</Label>
                <Input
                  id="inspector"
                  placeholder="Nome do inspetor"
                  value={newInspection.inspector}
                  onChange={(e) => setNewInspection({ ...newInspection, inspector: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-1 gap-3">
                <Label>Itens de Verificação</Label>
                <div className="space-y-2">
                  {checklistItems.map((item) => (
                    <div className="flex items-center space-x-2" key={item.id}>
                      <Checkbox 
                        id={item.id} 
                        checked={newInspection.checklist.includes(item.id)}
                        onCheckedChange={(checked) => 
                          handleChecklistChange(item.id, checked === true)
                        }
                      />
                      <label
                        htmlFor={item.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {item.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <Label htmlFor="observations">Observações</Label>
                <Textarea
                  id="observations"
                  placeholder="Insira detalhes adicionais sobre a inspeção..."
                  value={newInspection.observations}
                  onChange={(e) => setNewInspection({ ...newInspection, observations: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreateInspection}>Criar Inspeção</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Todas as Inspeções</TabsTrigger>
          <TabsTrigger value="statistics">Estatísticas</TabsTrigger>
          <TabsTrigger value="upcoming">Inspeções Programadas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar inspeções..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    <span>Status</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos</SelectItem>
                  <SelectItem value="completed">Concluídas</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="in_progress">Em Progresso</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Select value={selectedArea} onValueChange={setSelectedArea}>
              <SelectTrigger>
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  <span>Local</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                {areas.map(area => (
                  <SelectItem key={area} value={area}>{area}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {filteredInspections.length === 0 ? (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Nenhuma inspeção encontrada</AlertTitle>
                <AlertDescription>
                  Não foram encontradas inspeções com os filtros selecionados.
                </AlertDescription>
              </Alert>
            ) : (
              filteredInspections.map((inspection) => (
                <div 
                  key={inspection.id}
                  className={cn(
                    "p-4 border rounded-lg bg-card",
                    inspection.status === 'completed' && "cursor-pointer hover:bg-accent transition-colors"
                  )}
                  onClick={() => {
                    if (inspection.status === 'completed') {
                      navigate(`/inspecoes/${inspection.id}`, { state: { inspection } });
                    }
                  }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{inspection.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {format(inspection.date, "PPP", { locale: ptBR })}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {getTypeBadge(inspection.type)}
                      {getStatusBadge(inspection.status)}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Local:</span>
                      <span className="ml-1">{inspection.location}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Inspetor:</span>
                      <span className="ml-1">{inspection.inspector}</span>
                    </div>
                  </div>
                  {inspection.findings.length > 0 && (
                    <div className="mt-2">
                      <span className="text-sm text-muted-foreground">Constatações:</span>
                      <ul className="list-disc list-inside text-sm mt-1">
                        {inspection.findings.map((finding, index) => (
                          <li key={index}>{finding}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="flex justify-end items-center mt-4">
                    {inspection.status !== 'completed' && (
                      <EditInspectionDialog
                        inspection={inspection}
                        onUpdate={handleUpdateInspection}
                        onDelete={handleDeleteInspection}
                      />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {getDynamicStats().map((stat) => (
              <Card 
                key={stat.status} 
                className={cn(
                  "cursor-pointer hover:bg-accent/50",
                  selectedStatus === stat.status && "border-2 border-primary"
                )}
                onClick={() => handleStatClick(stat.status)}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  {stat.status === "completed" && <CheckCircle className="h-4 w-4 text-muted-foreground" />}
                  {stat.status === "pending" && <AlertTriangle className="h-4 w-4 text-muted-foreground" />}
                  {stat.status === "in_progress" && <ClipboardCheck className="h-4 w-4 text-muted-foreground" />}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Inspeções {selectedStatus !== "Todos" ? getStatusDisplay(selectedStatus) : ""}</h3>
            {filteredInspections.length === 0 ? (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Nenhuma inspeção encontrada</AlertTitle>
                <AlertDescription>
                  Não foram encontradas inspeções com os filtros selecionados.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="grid gap-4">
                {filteredInspections.map((inspection) => (
                  <Card key={inspection.id} className="hover:bg-accent/50">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{inspection.title}</CardTitle>
                        <div className="flex items-center gap-2">
                          {getTypeBadge(inspection.type)}
                          {getStatusBadge(inspection.status)}
                        </div>
                      </div>
                      <CardDescription>
                        {format(inspection.date, "PPP", { locale: ptBR })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Local:</span>
                          <span>{inspection.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Inspetor:</span>
                          <span>{inspection.inspector}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>Inspeções Programadas</CardTitle>
              <CardDescription>Próximas inspeções agendadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredInspections
                  .filter(inspection => inspection.status === 'pending')
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .map(inspection => (
                    <div key={inspection.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{inspection.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {format(inspection.date, "PPP", { locale: ptBR })}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-muted-foreground">
                          {inspection.inspector}
                        </div>
                        {getStatusBadge(inspection.status)}
                      </div>
                    </div>
                  ))
                }
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

{/* Statistics Cards */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
  {stats.map((stat) => (
    <Card
      key={stat.status}
      className={cn(
        "cursor-pointer transition-colors hover:bg-accent",
        stat.status === "Todos" && "bg-accent"
      )}
      onClick={() => handleStatClick(stat.status)}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
        {stat.status === "completed" && <CheckCircle className="h-4 w-4 text-green-500" />}
        {stat.status === "pending" && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
        {stat.status === "in_progress" && <ClipboardCheck className="h-4 w-4 text-blue-500" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stat.value}</div>
      </CardContent>
    </Card>
  ))}
</div>
function handleStatClick(status: string): void {
  throw new Error('Function not implemented.');
}

