
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
  { title: "Total de Inspeções", value: "156" },
  { title: "Concluídas", value: "112" },
  { title: "Pendentes", value: "28" },
  { title: "Em Progresso", value: "16" },
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

  // Function to get status badge for inspection
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Concluída</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pendente</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-500">Em Progresso</Badge>;
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Inspeções</h1>
          <p className="text-muted-foreground">
            Gerencie inspeções de segurança, ambientais e de qualidade.
          </p>
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
                <Card key={inspection.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between">
                      <div>
                        <CardTitle>{inspection.title}</CardTitle>
                        <CardDescription className="mt-1">
                          Local: {inspection.location}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2 mt-2 sm:mt-0">
                        {getTypeBadge(inspection.type)}
                        {getStatusBadge(inspection.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">Data:</span>{" "}
                        {format(inspection.date, "dd/MM/yyyy")}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Inspetor:</span>{" "}
                        {inspection.inspector}
                      </div>
                      {inspection.findings.length > 0 && (
                        <>
                          <div className="text-sm font-medium mt-2">Descobertas:</div>
                          <ul className="list-disc list-inside text-sm space-y-1">
                            {inspection.findings.map((finding, index) => (
                              <li key={index}>{finding}</li>
                            ))}
                          </ul>
                        </>
                      )}
                      <div className="flex justify-end gap-2 mt-3">
                        {inspection.status === 'pending' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              const updatedInspections = inspections.map(i => 
                                i.id === inspection.id 
                                  ? { ...i, status: 'completed' as const, findings: ['Inspeção concluída sem ocorrências.'] } 
                                  : i
                              );
                              setInspections(updatedInspections);
                              toast({
                                title: "Inspeção atualizada",
                                description: "A inspeção foi marcada como concluída.",
                              });
                            }}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Concluir
                          </Button>
                        )}
                        {inspection.status === 'completed' && (
                          <InspectionReportDialog
                            inspection={inspection}
                            onSaveReport={(report) => {
                              const updatedInspections = inspections.map(i =>
                                i.id === inspection.id
                                  ? { ...i, report }
                                  : i
                              );
                              setInspections(updatedInspections);
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="statistics">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Inspeções
                </CardTitle>
                <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{filteredStats.total}</div>
                <p className="text-xs text-muted-foreground">
                  {filteredStats.total === 1 ? 'Inspeção' : 'Inspeções'} registrada(s)
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{filteredStats.completed}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((filteredStats.completed / (filteredStats.total || 1)) * 100)}% do total
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
                <ClipboardCheck className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{filteredStats.pending}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((filteredStats.pending / (filteredStats.total || 1)) * 100)}% do total
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Falhas</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{filteredStats.inProgress}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((filteredStats.inProgress / (filteredStats.total || 1)) * 100)}% do total
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Inspeções Por Tipo</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Inspeções de Segurança</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {filteredInspections.filter(i => i.type === 'safety').length}
                  </div>
                  <Separator className="my-2" />
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span>Concluídas:</span>
                      <span>{filteredInspections.filter(i => i.type === 'safety' && i.status === 'completed').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pendentes:</span>
                      <span>{filteredInspections.filter(i => i.type === 'safety' && i.status === 'pending').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Em Progresso:</span>
                      <span>{filteredInspections.filter(i => i.type === 'safety' && i.status === 'in_progress').length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Inspeções Ambientais</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {filteredInspections.filter(i => i.type === 'environmental').length}
                  </div>
                  <Separator className="my-2" />
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span>Concluídas:</span>
                      <span>{filteredInspections.filter(i => i.type === 'environmental' && i.status === 'completed').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pendentes:</span>
                      <span>{filteredInspections.filter(i => i.type === 'environmental' && i.status === 'pending').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Em Progresso:</span>
                      <span>{filteredInspections.filter(i => i.type === 'environmental' && i.status === 'in_progress').length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Inspeções de Qualidade</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {filteredInspections.filter(i => i.type === 'quality').length}
                  </div>
                  <Separator className="my-2" />
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span>Concluídas:</span>
                      <span>{filteredInspections.filter(i => i.type === 'quality' && i.status === 'completed').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pendentes:</span>
                      <span>{filteredInspections.filter(i => i.type === 'quality' && i.status === 'pending').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Em Progresso:</span>
                      <span>{filteredInspections.filter(i => i.type === 'quality' && i.status === 'in_progress').length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="upcoming">
          <div className="space-y-4">
            <Alert>
              <ClipboardCheck className="h-4 w-4" />
              <AlertTitle>Inspeções Programadas</AlertTitle>
              <AlertDescription>
                Inspeções pendentes ordenadas por data.
              </AlertDescription>
            </Alert>
            
            {filteredInspections
              .filter(i => i.status === 'pending')
              .sort((a, b) => a.date.getTime() - b.date.getTime())
              .length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">Não há inspeções programadas para este período.</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                filteredInspections
                  .filter(i => i.status === 'pending')
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .map(inspection => (
                    <Card key={inspection.id}>
                      <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div>
                            <h3 className="font-semibold">{inspection.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {inspection.location}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {format(inspection.date, "dd 'de' MMMM", { locale: ptBR })}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-start md:items-end gap-2">
                            {getTypeBadge(inspection.type)}
                            <span className="text-sm">{inspection.inspector}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                ))
              )
            }
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
