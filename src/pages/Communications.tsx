
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Bell, FileText, Search, Filter, Plus } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

// Interfaces para os dados
interface Communication {
  id: number;
  title: string;
  type: string;
  date: Date;
  status: 'novo' | 'lido' | 'respondido' | 'arquivado';
  priority: 'alta' | 'média' | 'baixa';
  message: string;
  sender: string;
  recipient?: string;
}

const Communications = () => {
  // Estado para armazenar comunicações
  const [communications, setCommunications] = useState<Communication[]>([
    {
      id: 1,
      title: "Reunião de Segurança Mensal",
      type: "anúncio",
      date: new Date(2024, 3, 5),
      status: "novo",
      priority: "alta",
      message: "Reunião obrigatória de segurança acontecerá na próxima sexta-feira às 14h no auditório principal.",
      sender: "Departamento de Segurança"
    },
    {
      id: 2,
      title: "Novo Protocolo de EPI",
      type: "notificação",
      date: new Date(2024, 3, 2),
      status: "lido",
      priority: "média",
      message: "A partir de 15/04, todos os trabalhadores devem utilizar o novo modelo de capacete de segurança.",
      sender: "Coordenação de EPIs"
    },
    {
      id: 3,
      title: "Relatório de Acidentes - Q1",
      type: "relatório",
      date: new Date(2024, 2, 28),
      status: "arquivado",
      priority: "média",
      message: "O relatório de acidentes do primeiro trimestre está disponível para consulta na intranet.",
      sender: "Comitê de Segurança"
    },
    {
      id: 4,
      title: "Alerta de Emergência - Setor B",
      type: "alerta",
      date: new Date(2024, 3, 10),
      status: "respondido",
      priority: "alta",
      message: "Foi detectado um risco potencial no setor B. Por favor, reforce os procedimentos de segurança até nova comunicação.",
      sender: "Engenharia de Segurança"
    },
  ]);

  // Estado para formulário de nova comunicação
  const [newComm, setNewComm] = useState({
    title: "",
    type: "",
    priority: "",
    recipient: "",
    message: ""
  });

  // Estado para filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Handler para adicionar nova comunicação
  const handleAddCommunication = () => {
    if (!newComm.title || !newComm.type || !newComm.priority || !newComm.message) {
      toast({
        title: "Campos incompletos",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const newCommunication: Communication = {
      id: communications.length + 1,
      title: newComm.title,
      type: newComm.type,
      date: new Date(),
      status: "novo",
      priority: newComm.priority as 'alta' | 'média' | 'baixa',
      message: newComm.message,
      sender: "Usuário Atual",
      recipient: newComm.recipient
    };

    setCommunications([newCommunication, ...communications]);
    setNewComm({
      title: "",
      type: "",
      priority: "",
      recipient: "",
      message: ""
    });

    toast({
      title: "Comunicação enviada",
      description: "Sua comunicação foi enviada com sucesso.",
    });
  };

  // Filtragem de comunicações
  const filteredCommunications = communications.filter(comm => {
    return (
      (searchTerm === "" || 
       comm.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       comm.message.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (typeFilter === "" || comm.type === typeFilter) &&
      (statusFilter === "" || comm.status === statusFilter)
    );
  });

  // Helper para cor do badge de status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "novo": return "bg-blue-500";
      case "lido": return "bg-green-500";
      case "respondido": return "bg-purple-500";
      case "arquivado": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  // Helper para cor do badge de prioridade
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "alta": return "bg-red-500";
      case "média": return "bg-orange-500";
      case "baixa": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-white">
          <Bell className="h-8 w-8" />
          Comunicações
        </h1>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-white hover:bg-white/90 text-black border border-gray-200">
              <Plus className="mr-2 h-4 w-4" /> Nova Comunicação
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Nova Comunicação</DialogTitle>
              <DialogDescription>
                Crie uma nova comunicação para ser enviada aos colaboradores.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">Título</Label>
                <Input 
                  id="title"
                  value={newComm.title}
                  onChange={e => setNewComm({...newComm, title: e.target.value})}
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">Tipo</Label>
                <Select 
                  onValueChange={value => setNewComm({...newComm, type: value})}
                  value={newComm.type}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="anúncio">Anúncio</SelectItem>
                    <SelectItem value="notificação">Notificação</SelectItem>
                    <SelectItem value="alerta">Alerta</SelectItem>
                    <SelectItem value="relatório">Relatório</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="priority" className="text-right">Prioridade</Label>
                <Select 
                  onValueChange={value => setNewComm({...newComm, priority: value})}
                  value={newComm.priority}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione a prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="média">Média</SelectItem>
                    <SelectItem value="baixa">Baixa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="recipient" className="text-right">Destinatário</Label>
                <Input 
                  id="recipient"
                  value={newComm.recipient}
                  onChange={e => setNewComm({...newComm, recipient: e.target.value})}
                  className="col-span-3" 
                  placeholder="Opcional (todos se vazio)"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="message" className="text-right">Mensagem</Label>
                <Textarea 
                  id="message"
                  value={newComm.message}
                  onChange={e => setNewComm({...newComm, message: e.target.value})}
                  className="col-span-3"
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddCommunication} className="bg-white hover:bg-white/90 text-black border border-gray-200">Enviar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Comunicações</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{communications.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Novas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{communications.filter(c => c.status === 'novo').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alta Prioridade</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{communications.filter(c => c.priority === 'alta').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Relatórios</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{communications.filter(c => c.type === 'relatório').length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Filtre as comunicações por diferentes critérios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Pesquisar por título ou conteúdo" 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select 
                onValueChange={setTypeFilter}
                value={typeFilter}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos-tipos">Todos os tipos</SelectItem>
                  <SelectItem value="anúncio">Anúncio</SelectItem>
                  <SelectItem value="notificação">Notificação</SelectItem>
                  <SelectItem value="alerta">Alerta</SelectItem>
                  <SelectItem value="relatório">Relatório</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select 
                onValueChange={setStatusFilter}
                value={statusFilter}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos-status">Todos os status</SelectItem>
                  <SelectItem value="novo">Novo</SelectItem>
                  <SelectItem value="lido">Lido</SelectItem>
                  <SelectItem value="respondido">Respondido</SelectItem>
                  <SelectItem value="arquivado">Arquivado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de comunicações */}
      <Card>
        <CardHeader>
          <CardTitle>Comunicações</CardTitle>
          <CardDescription>Lista de todas as comunicações de segurança</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCommunications.length > 0 ? (
                filteredCommunications.map((comm) => (
                  <TableRow key={comm.id}>
                    <TableCell className="font-medium">{comm.title}</TableCell>
                    <TableCell className="capitalize">{comm.type}</TableCell>
                    <TableCell>{format(comm.date, 'dd/MM/yyyy')}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(comm.status)}>
                        {comm.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(comm.priority)}>
                        {comm.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">Ver</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[550px]">
                          <DialogHeader>
                            <DialogTitle>{comm.title}</DialogTitle>
                            <DialogDescription>
                              Enviado por {comm.sender} em {format(comm.date, 'dd/MM/yyyy')}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="flex items-center gap-2">
                              <Badge className={getPriorityColor(comm.priority)}>
                                {comm.priority}
                              </Badge>
                              <Badge className={getStatusColor(comm.status)}>
                                {comm.status}
                              </Badge>
                            </div>
                            <div className="border p-4 rounded-lg bg-gray-50">
                              {comm.message}
                            </div>
                            {comm.recipient && (
                              <div className="text-sm text-gray-500">
                                Para: {comm.recipient}
                              </div>
                            )}
                          </div>
                          <DialogFooter>
                            <Button 
                              onClick={() => {
                                const updatedComms = communications.map(c => 
                                  c.id === comm.id ? {...c, status: 'lido' as const} : c
                                );
                                setCommunications(updatedComms);
                                toast({
                                  title: "Comunicação marcada como lida",
                                  description: "Status atualizado com sucesso."
                                });
                              }}
                              variant="outline"
                            >
                              Marcar como lido
                            </Button>
                            <Button 
                              onClick={() => {
                                const updatedComms = communications.map(c => 
                                  c.id === comm.id ? {...c, status: 'arquivado' as const} : c
                                );
                                setCommunications(updatedComms);
                                toast({
                                  title: "Comunicação arquivada",
                                  description: "Status atualizado com sucesso."
                                });
                              }}
                            >
                              Arquivar
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Nenhuma comunicação encontrada
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Communications;

