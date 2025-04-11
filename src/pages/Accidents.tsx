
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  Calendar, 
  FileText, 
  Clock, 
  User, 
  MapPin,
  Plus
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Accidents = () => {
  const [activeTab, setActiveTab] = useState('registered');
  
  // Dados de exemplo para acidentes registrados
  const registeredAccidents = [
    {
      id: 1,
      date: '10/04/2025',
      time: '09:45',
      location: 'Setor de Produção',
      victim: 'Carlos Santos',
      type: 'Queda',
      severity: 'Médio',
      description: 'Queda de escada durante manutenção de equipamento.',
      status: 'Em análise'
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
      status: 'Concluído'
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
      status: 'Concluído'
    }
  ];
  
  // Dados de exemplo para quase-acidentes
  const nearMisses = [
    {
      id: 1,
      date: '08/04/2025',
      time: '10:15',
      location: 'Corredor Principal',
      reportedBy: 'Ana Ferreira',
      type: 'Obstáculo',
      description: 'Material deixado no corredor principal, causando risco de tropeço.',
      status: 'Resolvido'
    },
    {
      id: 2,
      date: '05/04/2025',
      time: '16:40',
      location: 'Sala de Máquinas',
      reportedBy: 'Pedro Costa',
      type: 'Vazamento',
      description: 'Pequeno vazamento de óleo próximo à máquina de corte.',
      status: 'Em análise'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestão de Acidentes e Quase-Acidentes</h1>
        <Button className="bg-safety-blue hover:bg-safety-blue/90">
          <Plus className="mr-2 h-4 w-4" /> Novo Registro
        </Button>
      </div>

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
                      <tr key={accident.id} className="bg-white border-b hover:bg-gray-50">
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
                          <Badge variant="outline" className={
                            accident.status === 'Em análise' ? 'text-safety-blue' :
                            'text-safety-green'
                          }>
                            {accident.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Ver</Button>
                            <Button variant="outline" size="sm">Editar</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Detalhes do Acidente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Data e Hora</h3>
                      <div className="flex items-center mt-1">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        <span>10/04/2025 - 09:45</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Local</h3>
                      <div className="flex items-center mt-1">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        <span>Setor de Produção - Linha 2</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Funcionário</h3>
                      <div className="flex items-center mt-1">
                        <User className="h-4 w-4 mr-2 text-gray-400" />
                        <span>Carlos Santos - Técnico de Manutenção</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Tipo de Acidente</h3>
                      <div className="flex items-center mt-1">
                        <AlertTriangle className="h-4 w-4 mr-2 text-safety-orange" />
                        <span>Queda</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Descrição</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      Queda de escada durante manutenção de equipamento. O funcionário estava realizando a manutenção de um equipamento
                      quando perdeu o equilíbrio na escada e caiu de uma altura aproximada de 1,5 metros.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Medidas tomadas</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      Funcionário foi encaminhado ao pronto socorro para avaliação médica. Foi realizado o registro da CAT.
                      A área foi isolada e a escada foi removida para análise.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Linha do Tempo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative border-l border-gray-200 pl-4 pb-4">
                    <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-safety-blue"></div>
                    <h3 className="text-sm font-semibold">Registro do acidente</h3>
                    <p className="text-xs text-gray-500">10/04/2025 - 10:15</p>
                    <p className="text-xs text-gray-600 mt-1">Técnico de segurança registrou o acidente</p>
                  </div>
                  
                  <div className="relative border-l border-gray-200 pl-4 pb-4">
                    <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-safety-blue"></div>
                    <h3 className="text-sm font-semibold">Atendimento médico</h3>
                    <p className="text-xs text-gray-500">10/04/2025 - 10:30</p>
                    <p className="text-xs text-gray-600 mt-1">Funcionário encaminhado para atendimento</p>
                  </div>
                  
                  <div className="relative border-l border-gray-200 pl-4">
                    <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-safety-blue"></div>
                    <h3 className="text-sm font-semibold">Emissão da CAT</h3>
                    <p className="text-xs text-gray-500">10/04/2025 - 14:45</p>
                    <p className="text-xs text-gray-600 mt-1">Comunicação de Acidente de Trabalho emitida</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="near-miss">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-safety-orange" />
                Quase-Acidentes Reportados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3">Data</th>
                      <th scope="col" className="px-6 py-3">Local</th>
                      <th scope="col" className="px-6 py-3">Reportado por</th>
                      <th scope="col" className="px-6 py-3">Tipo</th>
                      <th scope="col" className="px-6 py-3">Status</th>
                      <th scope="col" className="px-6 py-3">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nearMisses.map((incident) => (
                      <tr key={incident.id} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4">{incident.date}</td>
                        <td className="px-6 py-4">{incident.location}</td>
                        <td className="px-6 py-4">{incident.reportedBy}</td>
                        <td className="px-6 py-4">{incident.type}</td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className={
                            incident.status === 'Em análise' ? 'text-safety-blue' :
                            'text-safety-green'
                          }>
                            {incident.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Ver</Button>
                            <Button variant="outline" size="sm">Editar</Button>
                          </div>
                        </td>
                      </tr>
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
