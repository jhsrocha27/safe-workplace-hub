
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  Calendar as CalendarIcon, 
  FileText, 
  Clock, 
  User, 
  MapPin,
  Plus
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

interface TimelineEvent {
  date: string;
  time: string;
  description: string;
}

interface CAT {
  number: string;
  openingDate: string;
  status: 'Aberto' | 'Enviado' | 'Processado';
}

interface Accident {
  id: number;
  date: string;
  time: string;
  location: string;
  victim: string;
  type: string;
  severity: 'Leve' | 'Médio' | 'Grave';
  description: string;
  status: 'Em análise' | 'Concluído';
  isExpanded?: boolean;
  timeline?: TimelineEvent[];
  cat?: CAT;
}

interface EditAccidentData {
  timelineEvent: {
    date: Date;
    time: string;
    description: string;
  };
  cat: {
    number: string;
    status: 'Aberto' | 'Enviado' | 'Processado';
  };
}

interface NearMiss {
  id: number;
  date: string;
  time: string;
  location: string;
  reportedBy: string;
  type: string;
  description: string;
  status: 'Em análise' | 'Resolvido';
  isExpanded?: boolean;
}

interface NewRecord {
  type: 'accident' | 'near-miss';
  date: Date;
  time: string;
  location: string;
  victim: string;
  accidentType: string;
  severity: 'Leve' | 'Médio' | 'Grave';
  description: string;
  reportedBy: string;
  status: 'Em análise' | 'Concluído' | 'Resolvido';
}

const Accidents: React.FC = () => {
  const [activeTab, setActiveTab] = useState('registered');
  const [isNewRecordDialogOpen, setIsNewRecordDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAccident, setSelectedAccident] = useState<Accident | null>(null);
  const [editData, setEditData] = useState<EditAccidentData>({
    timelineEvent: {
      date: new Date(),
      time: '',
      description: ''
    },
    cat: {
      number: '',
      status: 'Aberto'
    }
  });

  const [registeredAccidents, setRegisteredAccidents] = useState<Accident[]>([
    {
      id: 1,
      date: '10/04/2025',
      time: '09:45',
      location: 'Setor de Produção',
      victim: 'Carlos Santos',
      type: 'Queda',
      severity: 'Médio',
      description: 'Queda de escada durante manutenção de equipamento.',
      status: 'Em análise',
      timeline: [
        { date: '10/04/2025', time: '09:45', description: 'Ocorrência do acidente' },
        { date: '10/04/2025', time: '09:50', description: 'Acionamento do serviço médico' },
        { date: '10/04/2025', time: '10:15', description: 'Atendimento médico inicial' },
        { date: '10/04/2025', time: '11:00', description: 'Início da investigação do acidente' }
      ],
      cat: {
        number: 'CAT-2025-001',
        openingDate: '10/04/2025',
        status: 'Aberto'
      }
    },
    {
      id: 2,
      date: '02/04/2025',
      time: '14:30',
      location: 'Estacionamento',
      victim: 'Maria Oliveira',
      type: 'Colisão',
      severity: 'Leve',
      description: 'Colisão entre veículos no estacionamento da empresa.',
      status: 'Concluído',
      timeline: [
        { date: '02/04/2025', time: '14:30', description: 'Ocorrência do acidente' },
        { date: '02/04/2025', time: '14:35', description: 'Avaliação inicial no local' },
        { date: '02/04/2025', time: '15:00', description: 'Registro do acidente' },
        { date: '03/04/2025', time: '09:00', description: 'Conclusão da investigação' }
      ],
      cat: {
        number: 'CAT-2025-002',
        openingDate: '02/04/2025',
        status: 'Processado'
      }
    },
    {
      id: 3,
      date: '25/03/2025',
      time: '11:20',
      location: 'Setor de Embalagem',
      victim: 'João Silva',
      type: 'Corte',
      severity: 'Leve',
      description: 'Corte na mão ao manusear material cortante.',
      status: 'Concluído',
      timeline: [
        { date: '25/03/2025', time: '11:20', description: 'Ocorrência do acidente' },
        { date: '25/03/2025', time: '11:25', description: 'Primeiros socorros' },
        { date: '25/03/2025', time: '11:40', description: 'Registro do acidente' },
        { date: '26/03/2025', time: '10:00', description: 'Conclusão da investigação' }
      ],
      cat: {
        number: 'CAT-2025-003',
        openingDate: '25/03/2025',
        status: 'Processado'
      }
    }
  ]);

  const [nearMisses, setNearMisses] = useState<NearMiss[]>([
    {
      id: 1,
      date: '08/04/2025',
      time: '10:15',
      location: 'Corredor Principal',
      reportedBy: 'Ana Ferreira',
      type: 'Obstáculo',
      description: 'Material deixado no corredor principal, causando risco de tropeço.',
      status: 'Resolvido',
      isExpanded: false
    },
    {
      id: 2,
      date: '05/04/2025',
      time: '16:40',
      location: 'Sala de Máquinas',
      reportedBy: 'Pedro Costa',
      type: 'Vazamento',
      description: 'Pequeno vazamento de óleo próximo à máquina de corte.',
      status: 'Em análise',
      isExpanded: false
    }
  ]);

  const [selectedNearMiss, setSelectedNearMiss] = useState<NearMiss | null>(null);
  const [isEditNearMissDialogOpen, setIsEditNearMissDialogOpen] = useState(false);

  const [newRecord, setNewRecord] = useState<NewRecord>({
    type: 'accident',
    date: new Date(),
    time: '',
    location: '',
    victim: '',
    accidentType: '',
    severity: 'Leve',
    description: '',
    reportedBy: '',
    status: 'Em análise'
  });

  const toggleAccidentDetails = (accidentId: number) => {
    setRegisteredAccidents(accidents => accidents.map(accident => {
      if (accident.id === accidentId) {
        return { ...accident, isExpanded: !accident.isExpanded };
      }
      return accident;
    }));
  };

  const toggleNearMissDetails = (nearMissId: number) => {
    setNearMisses(nearMisses => nearMisses.map(nearMiss => {
      if (nearMiss.id === nearMissId) {
        return { ...nearMiss, isExpanded: !nearMiss.isExpanded };
      }
      return nearMiss;
    }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setNewRecord({ ...newRecord, date });
    }
  };

  const handleSaveRecord = () => {
    if (newRecord.type === 'accident') {
      const newAccident: Accident = {
        id: registeredAccidents.length + 1,
        date: format(newRecord.date, 'dd/MM/yyyy'),
        time: newRecord.time,
        location: newRecord.location,
        victim: newRecord.victim,
        type: newRecord.accidentType,
        severity: newRecord.severity,
        description: newRecord.description,
        status: newRecord.status as 'Em análise' | 'Concluído'
      };
      setRegisteredAccidents([newAccident, ...registeredAccidents]);
    } else {
      const newNearMiss: NearMiss = {
        id: nearMisses.length + 1,
        date: format(newRecord.date, 'dd/MM/yyyy'),
        time: newRecord.time,
        location: newRecord.location,
        reportedBy: newRecord.reportedBy,
        type: newRecord.accidentType,
        description: newRecord.description,
        status: newRecord.status as 'Em análise' | 'Resolvido'
      };
      setNearMisses([newNearMiss, ...nearMisses]);
    }

    setIsNewRecordDialogOpen(false);
    setNewRecord({
      type: 'accident',
      date: new Date(),
      time: '',
      location: '',
      victim: '',
      accidentType: '',
      severity: 'Leve',
      description: '',
      reportedBy: '',
      status: 'Em análise'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Gestão de Acidentes e Quase-Acidentes</h1>
        <Dialog open={isNewRecordDialogOpen} onOpenChange={setIsNewRecordDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-white hover:bg-white/90 text-black border border-gray-200">
              <Plus className="mr-2 h-4 w-4" /> Novo Registro
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Novo Registro de Ocorrência</DialogTitle>
              <DialogDescription>
                Preencha os detalhes da ocorrência para registro.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-3">
                <Label>Tipo de Registro</Label>
                <Select
                  value={newRecord.type}
                  onValueChange={(value: 'accident' | 'near-miss') => 
                    setNewRecord({ ...newRecord, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="accident">Acidente</SelectItem>
                    <SelectItem value="near-miss">Quase-Acidente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Data</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !newRecord.date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newRecord.date ? (
                          format(newRecord.date, "dd/MM/yyyy", { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={newRecord.date}
                        onSelect={handleDateSelect}
                        initialFocus
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label>Hora</Label>
                  <Input
                    type="time"
                    value={newRecord.time}
                    onChange={(e) => setNewRecord({ ...newRecord, time: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <Label>Local</Label>
                <Input
                  placeholder="Local da ocorrência"
                  value={newRecord.location}
                  onChange={(e) => setNewRecord({ ...newRecord, location: e.target.value })}
                />
              </div>

              {newRecord.type === 'accident' ? (
                <>
                  <div className="grid grid-cols-1 gap-3">
                    <Label>Funcionário Envolvido</Label>
                    <Input
                      placeholder="Nome do funcionário"
                      value={newRecord.victim}
                      onChange={(e) => setNewRecord({ ...newRecord, victim: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <Label>Gravidade</Label>
                    <Select
                      value={newRecord.severity}
                      onValueChange={(value: 'Leve' | 'Médio' | 'Grave') =>
                        setNewRecord({ ...newRecord, severity: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a gravidade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Leve">Leve</SelectItem>
                        <SelectItem value="Médio">Médio</SelectItem>
                        <SelectItem value="Grave">Grave</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  <Label>Reportado Por</Label>
                  <Input
                    placeholder="Nome de quem reportou"
                    value={newRecord.reportedBy}
                    onChange={(e) => setNewRecord({ ...newRecord, reportedBy: e.target.value })}
                  />
                </div>
              )}

              <div className="grid grid-cols-1 gap-3">
                <Label>Tipo de {newRecord.type === 'accident' ? 'Acidente' : 'Ocorrência'}</Label>
                <Input
                  placeholder={`Tipo de ${newRecord.type === 'accident' ? 'acidente' : 'ocorrência'}`}
                  value={newRecord.accidentType}
                  onChange={(e) => setNewRecord({ ...newRecord, accidentType: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 gap-3">
                <Label>Descrição</Label>
                <Textarea
                  placeholder="Descreva detalhadamente o ocorrido"
                  value={newRecord.description}
                  onChange={(e) => setNewRecord({ ...newRecord, description: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSaveRecord}>Registrar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Editar Registro de Acidente</DialogTitle>
            <DialogDescription>
              Adicione eventos à linha do tempo e atualize informações do CAT.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-3">
              <Label>Novo Evento na Linha do Tempo</Label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Data</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !editData.timelineEvent.date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {editData.timelineEvent.date ? (
                          format(editData.timelineEvent.date, "dd/MM/yyyy", { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={editData.timelineEvent.date}
                        onSelect={(date) => date && setEditData({
                          ...editData,
                          timelineEvent: { ...editData.timelineEvent, date }
                        })}
                        initialFocus
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label>Hora</Label>
                  <Input
                    type="time"
                    value={editData.timelineEvent.time}
                    onChange={(e) => setEditData({
                      ...editData,
                      timelineEvent: { ...editData.timelineEvent, time: e.target.value }
                    })}
                  />
                </div>
              </div>
              <div>
                <Label>Descrição do Evento</Label>
                <Input
                  placeholder="Descreva o evento"
                  value={editData.timelineEvent.description}
                  onChange={(e) => setEditData({
                    ...editData,
                    timelineEvent: { ...editData.timelineEvent, description: e.target.value }
                  })}
                />
              </div>
              <Button
                onClick={() => {
                  if (selectedAccident && editData.timelineEvent.date && editData.timelineEvent.time && editData.timelineEvent.description) {
                    const newEvent = {
                      date: format(editData.timelineEvent.date, 'dd/MM/yyyy'),
                      time: editData.timelineEvent.time,
                      description: editData.timelineEvent.description
                    };
                    setRegisteredAccidents(accidents => accidents.map(acc => {
                      if (acc.id === selectedAccident.id) {
                        return {
                          ...acc,
                          timeline: [...(acc.timeline || []), newEvent]
                        };
                      }
                      return acc;
                    }));
                    setEditData({
                      ...editData,
                      timelineEvent: {
                        date: new Date(),
                        time: '',
                        description: ''
                      }
                    });
                  }
                }}
              >
                Adicionar Evento
              </Button>
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-1 gap-3">
              <Label>Informações do CAT</Label>
              <div>
                <Label>Número do CAT</Label>
                <Input
                  placeholder="Número do CAT"
                  value={editData.cat.number}
                  onChange={(e) => setEditData({
                    ...editData,
                    cat: { ...editData.cat, number: e.target.value }
                  })}
                />
              </div>
              <div>
                <Label>Status do CAT</Label>
                <Select
                  value={editData.cat.status}
                  onValueChange={(value: 'Aberto' | 'Enviado' | 'Processado') => setEditData({
                    ...editData,
                    cat: { ...editData.cat, status: value }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Aberto">Aberto</SelectItem>
                    <SelectItem value="Enviado">Enviado</SelectItem>
                    <SelectItem value="Processado">Processado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={() => {
                  if (selectedAccident && editData.cat.number) {
                    setRegisteredAccidents(accidents => accidents.map(acc => {
                      if (acc.id === selectedAccident.id) {
                        return {
                          ...acc,
                          cat: {
                            ...editData.cat,
                            openingDate: acc.cat?.openingDate || format(new Date(), 'dd/MM/yyyy')
                          }
                        };
                      }
                      return acc;
                    }));
                  }
                }}
              >
                Atualizar CAT
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsEditDialogOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Tabs defaultValue="registered" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger 
            value="registered" 
            onClick={() => setActiveTab('registered')}
          >
            Acidentes Registrados
          </TabsTrigger>
          <TabsTrigger 
            value="near-miss" 
            onClick={() => setActiveTab('near-miss')}
          >
            Quase-Acidentes
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="registered">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-safety-red" />
                Acidentes Registrados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3">Data</th>
                      <th scope="col" className="px-6 py-3">Local</th>
                      <th scope="col" className="px-6 py-3">Funcionário</th>
                      <th scope="col" className="px-6 py-3">Tipo</th>
                      <th scope="col" className="px-6 py-3">Gravidade</th>
                      <th scope="col" className="px-6 py-3">Status</th>
                      <th scope="col" className="px-6 py-3">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registeredAccidents.map((accident) => (
                      <React.Fragment key={accident.id}>
                        <tr className="bg-white border-b hover:bg-gray-50">
                          <td className="px-6 py-4">{accident.date}</td>
                          <td className="px-6 py-4">{accident.location}</td>
                          <td className="px-6 py-4">{accident.victim}</td>
                          <td className="px-6 py-4">{accident.type}</td>
                          <td className="px-6 py-4">
                            <Badge className={
                              accident.severity === 'Grave' ? 'bg-safety-red' : 
                              accident.severity === 'Médio' ? 'bg-safety-orange' : 
                              'bg-safety-green'
                            }>
                              {accident.severity}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <Select
                              value={accident.status}
                              onValueChange={(value: 'Em análise' | 'Concluído') => {
                                setRegisteredAccidents(accidents => accidents.map(acc => {
                                  if (acc.id === accident.id) {
                                    return { ...acc, status: value };
                                  }
                                  return acc;
                                }));
                              }}
                            >
                              <SelectTrigger className="w-[140px]">
                                <SelectValue>
                                  <Badge variant="outline" className={
                                    accident.status === 'Em análise' ? 'text-safety-blue' :
                                    'text-safety-green'
                                  }>
                                    {accident.status}
                                  </Badge>
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Em análise">Em análise</SelectItem>
                                <SelectItem value="Concluído">Concluído</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => toggleAccidentDetails(accident.id)}
                              >
                                {accident.isExpanded ? 'Ocultar' : 'Ver'}
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  setSelectedAccident(accident);
                                  setEditData({
                                    timelineEvent: {
                                      date: new Date(),
                                      time: '',
                                      description: ''
                                    },
                                    cat: {
                                      number: accident.cat?.number || '',
                                      status: accident.cat?.status || 'Aberto'
                                    }
                                  });
                                  setIsEditDialogOpen(true);
                                }}
                              >
                                Editar
                              </Button>
                            </div>
                          </td>
                        </tr>
                        {accident.isExpanded && (
                          <tr className="bg-gray-50">
                            <td colSpan={7} className="px-6 py-4">
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-semibold mb-2">Descrição do Acidente</h4>
                                  <p>{accident.description}</p>
                                </div>
                                {accident.timeline && (
                                  <div>
                                    <h4 className="font-semibold mb-2">Linha do Tempo</h4>
                                    <div className="space-y-2">
                                      {accident.timeline.map((event, index) => (
                                        <div key={index} className="flex items-start gap-2">
                                          <div className="min-w-[120px] text-sm text-gray-500">
                                            {event.date} {event.time}
                                          </div>
                                          <div>{event.description}</div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {accident.cat && (
                                  <div>
                                    <h4 className="font-semibold mb-2">CAT</h4>
                                    <div className="space-y-1">
                                      <div>Número: {accident.cat.number}</div>
                                      <div>Data de Abertura: {accident.cat.openingDate}</div>
                                      <div>Status: {accident.cat.status}</div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="near-miss">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-safety-orange" />
                Quase-Acidentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3">Data</th>
                      <th scope="col" className="px-6 py-3">Local</th>
                      <th scope="col" className="px-6 py-3">Reportado Por</th>
                      <th scope="col" className="px-6 py-3">Tipo</th>
                      <th scope="col" className="px-6 py-3">Status</th>
                      <th scope="col" className="px-6 py-3">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nearMisses.map((nearMiss) => (
                      <React.Fragment key={nearMiss.id}>
                        <tr className="bg-white border-b hover:bg-gray-50">
                          <td className="px-6 py-4">{nearMiss.date}</td>
                          <td className="px-6 py-4">{nearMiss.location}</td>
                          <td className="px-6 py-4">{nearMiss.reportedBy}</td>
                          <td className="px-6 py-4">{nearMiss.type}</td>
                          <td className="px-6 py-4">
                            <Select
                              value={nearMiss.status}
                              onValueChange={(value: 'Em análise' | 'Resolvido') => {
                                setNearMisses(nearMisses => nearMisses.map(nm => {
                                  if (nm.id === nearMiss.id) {
                                    return { ...nm, status: value };
                                  }
                                  return nm;
                                }));
                              }}
                            >
                              <SelectTrigger className="w-[140px]">
                                <SelectValue>
                                  <Badge variant="outline" className={
                                    nearMiss.status === 'Em análise' ? 'text-safety-blue' :
                                    'text-safety-green'
                                  }>
                                    {nearMiss.status}
                                  </Badge>
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Em análise">Em análise</SelectItem>
                                <SelectItem value="Resolvido">Resolvido</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => toggleNearMissDetails(nearMiss.id)}
                              >
                                {nearMiss.isExpanded ? 'Ocultar' : 'Ver'}
                              </Button>
                            </div>
                          </td>
                        </tr>
                        {nearMiss.isExpanded && (
                          <tr className="bg-gray-50">
                            <td colSpan={6} className="px-6 py-4">
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-semibold mb-2">Descrição da Ocorrência</h4>
                                  <p>{nearMiss.description}</p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Accidents;
