import React, { useState } from 'react';
import { 
  BookOpen, 
  Users, 
  Calendar, 
  CheckCircle, 
  Clock, 
  FileText, 
  AlertTriangle,
  Plus,
  Search,
  FileCheck,
  CalendarCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format, addDays, isBefore, isAfter } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { NewTrainingDialog } from '@/components/trainings/NewTrainingDialog';
import { ScheduleTrainingRecycleDialog } from '@/components/trainings/ScheduleTrainingRecycleDialog';
import { ScheduleTrainingDialog } from '@/components/trainings/ScheduleTrainingDialog';

// Tipos de dados
interface Training {
  id: string;
  title: string;
  description: string;
  regulation: string;
  duration: string;
  targetRoles: string[];
  expirationInDays: number;
}

interface EmployeeTraining {
  id: string;
  employeeId: string;
  employeeName: string;
  role: string;
  trainingId: string;
  trainingTitle: string;
  completionDate: Date;
  expirationDate: Date;
  certificate: string;
  status: 'active' | 'expired' | 'expiring';
  scheduledRecyclingDate?: Date;
}

const Trainings = () => {
  // Estado para dados de exemplo
  const [trainings] = useState<Training[]>([
    {
      id: '1',
      title: 'NR-35: Trabalho em Altura',
      description: 'Treinamento para capacitação em trabalho em altura',
      regulation: 'NR-35',
      duration: '8 horas',
      targetRoles: ['Operador de Manutenção', 'Eletricista', 'Montador'],
      expirationInDays: 730, // 2 anos
    },
    {
      id: '2',
      title: 'NR-10: Segurança em Instalações Elétricas',
      description: 'Treinamento para trabalho com instalações elétricas',
      regulation: 'NR-10',
      duration: '40 horas',
      targetRoles: ['Eletricista', 'Técnico de Manutenção'],
      expirationInDays: 730, // 2 anos
    },
    {
      id: '3',
      title: 'NR-33: Espaços Confinados',
      description: 'Capacitação para trabalho em espaços confinados',
      regulation: 'NR-33',
      duration: '16 horas',
      targetRoles: ['Operador de Produção', 'Técnico de Manutenção'],
      expirationInDays: 365, // 1 ano
    },
    {
      id: '4',
      title: 'CIPA - Comissão Interna de Prevenção de Acidentes',
      description: 'Capacitação para membros da CIPA',
      regulation: 'NR-05',
      duration: '20 horas',
      targetRoles: ['Membros da CIPA', 'Suplentes'],
      expirationInDays: 365, // 1 ano
    },
    {
      id: '5',
      title: 'Primeiro Socorros',
      description: 'Treinamento básico de primeiros socorros',
      regulation: 'NR-07',
      duration: '4 horas',
      targetRoles: ['Brigadistas', 'Todos os colaboradores'],
      expirationInDays: 730, // 2 anos
    },
  ]);

  // Gerar dados de treinamento dos funcionários
  const today = new Date();
  
  const [employeeTrainings, setEmployeeTrainings] = useState<EmployeeTraining[]>([
    {
      id: '1',
      employeeId: 'E001',
      employeeName: 'João Silva',
      role: 'Eletricista',
      trainingId: '2',
      trainingTitle: 'NR-10: Segurança em Instalações Elétricas',
      completionDate: addDays(today, -600),
      expirationDate: addDays(today, 130),
      certificate: 'CERT-2023-001',
      status: 'active',
    },
    {
      id: '2',
      employeeId: 'E001',
      employeeName: 'João Silva',
      role: 'Eletricista',
      trainingId: '1',
      trainingTitle: 'NR-35: Trabalho em Altura',
      completionDate: addDays(today, -700),
      expirationDate: addDays(today, 30),
      certificate: 'CERT-2023-002',
      status: 'expiring',
    },
    {
      id: '3',
      employeeId: 'E002',
      employeeName: 'Maria Souza',
      role: 'Técnico de Manutenção',
      trainingId: '3',
      trainingTitle: 'NR-33: Espaços Confinados',
      completionDate: addDays(today, -380),
      expirationDate: addDays(today, -15),
      certificate: 'CERT-2023-003',
      status: 'expired',
    },
    {
      id: '4',
      employeeId: 'E003',
      employeeName: 'Carlos Ferreira',
      role: 'Operador de Produção',
      trainingId: '3',
      trainingTitle: 'NR-33: Espaços Confinados',
      completionDate: addDays(today, -100),
      expirationDate: addDays(today, 265),
      certificate: 'CERT-2023-004',
      status: 'active',
    },
    {
      id: '5',
      employeeId: 'E004',
      employeeName: 'Ana Oliveira',
      role: 'Brigadista',
      trainingId: '5',
      trainingTitle: 'Primeiro Socorros',
      completionDate: addDays(today, -720),
      expirationDate: addDays(today, 10),
      certificate: 'CERT-2022-005',
      status: 'expiring',
    },
    {
      id: '6',
      employeeId: 'E005',
      employeeName: 'Pedro Santos',
      role: 'Membro da CIPA',
      trainingId: '4',
      trainingTitle: 'CIPA - Comissão Interna de Prevenção de Acidentes',
      completionDate: addDays(today, -370),
      expirationDate: addDays(today, -5),
      certificate: 'CERT-2023-006',
      status: 'expired',
    },
  ]);

  // Estatísticas dos treinamentos
  const totalTrainings = employeeTrainings.length;
  const expiredTrainings = employeeTrainings.filter(t => t.status === 'expired').length;
  const expiringTrainings = employeeTrainings.filter(t => t.status === 'expiring').length;
  const activeTrainings = employeeTrainings.filter(t => t.status === 'active').length;

  // Função para formatar data em português
  const formatDate = (date: Date) => {
    return format(date, 'dd/MM/yyyy', { locale: ptBR });
  };

  // Função para determinar a cor do status do treinamento
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'expired':
        return <Badge variant="destructive">Vencido</Badge>;
      case 'expiring':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Expirando</Badge>;
      case 'active':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200">Válido</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Gestão de Treinamentos</h1>
        <div className="flex space-x-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Search className="h-4 w-4" /> Buscar
          </Button>
          <NewTrainingDialog />
        </div>
      </div>

      {/* Dashboard de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Treinamentos</CardTitle>
            <BookOpen className="h-4 w-4 text-safety-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTrainings}</div>
            <p className="text-xs text-muted-foreground">Treinamentos registrados</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Treinamentos Válidos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTrainings}</div>
            <p className="text-xs text-muted-foreground">Em conformidade</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expirando em 30 dias</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expiringTrainings}</div>
            <p className="text-xs text-muted-foreground">Necessitam reciclagem</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Treinamentos Vencidos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expiredTrainings}</div>
            <p className="text-xs text-muted-foreground">Em não-conformidade</p>
          </CardContent>
        </Card>
      </div>

      {/* Treinamentos próximos do vencimento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-safety-blue" />
            Treinamentos Próximos do Vencimento
          </CardTitle>
          <CardDescription>
            Reciclagens necessárias nos próximos 30 dias
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Colaborador</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Treinamento</TableHead>
                <TableHead>Data de Conclusão</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data da Reciclagem</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employeeTrainings
                .filter(training => 
                  training.status === 'expiring' || 
                  training.status === 'expired')
                .map(training => (
                  <TableRow key={training.id}>
                    <TableCell className="font-medium">{training.employeeName}</TableCell>
                    <TableCell>{training.role}</TableCell>
                    <TableCell>{training.trainingTitle}</TableCell>
                    <TableCell>{formatDate(training.completionDate)}</TableCell>
                    <TableCell>{formatDate(training.expirationDate)}</TableCell>
                    <TableCell>{getStatusBadge(training.status)}</TableCell>
                    <TableCell>
                      {training.scheduledRecyclingDate ? (
                        formatDate(training.scheduledRecyclingDate)
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      <ScheduleTrainingRecycleDialog 
                        employeeName={training.employeeName}
                        trainingTitle={training.trainingTitle}
                        currentRecyclingDate={training.scheduledRecyclingDate}
                        expirationDate={training.expirationDate}
                        onSchedule={(date) => {
                          setEmployeeTrainings(prevTrainings =>
                            prevTrainings.map(t =>
                              t.id === training.id
                                ? { ...t, scheduledRecyclingDate: date }
                                : t
                            )
                          );
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Catálogo de Treinamentos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-safety-blue" />
            Catálogo de Treinamentos
          </CardTitle>
          <CardDescription>
            Treinamentos obrigatórios disponíveis para agendamento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trainings.map(training => (
              <Card key={training.id} className="relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2">
                  <Badge className="bg-[#1A4235] hover:bg-[#1A4235]/90">
                    {training.regulation}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle>{training.title}</CardTitle>
                  <CardDescription>{training.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-semibold flex items-center gap-1">
                        <Clock className="h-4 w-4" /> Duração:
                      </span>
                      <span>{training.duration}</span>
                    </div>
                    <div>
                      <span className="font-semibold flex items-center gap-1">
                        <CalendarCheck className="h-4 w-4" /> Validade:
                      </span>
                      <span>{training.expirationInDays / 365} {training.expirationInDays / 365 === 1 ? 'ano' : 'anos'}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="font-semibold flex items-center gap-1">
                      <Users className="h-4 w-4" /> Funções Alvo:
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {training.targetRoles.map((role, index) => (
                        <Badge key={index} variant="outline">{role}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <FileCheck className="h-4 w-4" /> Certificados
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Todos os Treinamentos de Funcionários */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-safety-blue" />
            Registro de Treinamentos
          </CardTitle>
          <CardDescription>
            Histórico completo de treinamentos por colaborador
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Colaborador</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Treinamento</TableHead>
                <TableHead>Data de Conclusão</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Certificado</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employeeTrainings.map(training => (
                <TableRow key={training.id}>
                  <TableCell className="font-medium">{training.employeeName}</TableCell>
                  <TableCell>{training.role}</TableCell>
                  <TableCell>{training.trainingTitle}</TableCell>
                  <TableCell>{formatDate(training.completionDate)}</TableCell>
                  <TableCell>{formatDate(training.expirationDate)}</TableCell>
                  <TableCell>{training.certificate}</TableCell>
                  <TableCell>{getStatusBadge(training.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Trainings;
