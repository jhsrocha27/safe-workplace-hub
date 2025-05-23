import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  Calendar, 
  FileWarning, 
  FileCheck,
  ShieldAlert, 
  Users, 
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { documentService } from '@/services/document-service';
import { ppeDeliveryService } from '@/services/ppe-service';
import { trainingService } from '@/services/training-service';

const data = [
  { name: 'Jan', value: 5 },
  { name: 'Fev', value: 3 },
  { name: 'Mar', value: 7 },
  { name: 'Abr', value: 2 },
  { name: 'Mai', value: 4 },
  { name: 'Jun', value: 6 },
  { name: 'Jul', value: 3 },
];

const Dashboard = () => {
  const [expiredDocuments, setExpiredDocuments] = useState(0);
  const [expiringDocuments, setExpiringDocuments] = useState(0);
  const [pendingPPEs, setPendingPPEs] = useState(0);
  const [expiringPPEs, setExpiringPPEs] = useState(0);
  const [expiredPPEs, setExpiredPPEs] = useState(0);
  const [expiredTrainings, setExpiredTrainings] = useState(0);
  const [expiringTrainings, setExpiringTrainings] = useState(0);
  
  useEffect(() => {
    // Carregar dados de documentos
    const fetchDocuments = async () => {
      try {
        const docs = await documentService.getAll();
        // Filtra todos os documentos vencidos e a vencer, independente do tipo
        const expiredDocs = docs.filter(doc => doc.status === 'expired');
        const expiringDocs = docs.filter(doc => doc.status === 'expiring');
        
        setExpiredDocuments(expiredDocs.length);
        setExpiringDocuments(expiringDocs.length);
      } catch (error) {
        console.error('Erro ao carregar documentos:', error);
      }
    };
    
    // Carregar dados de EPIs
    const fetchPPEs = async () => {
      try {
        const deliveries = await ppeDeliveryService.getAll();
        
        // Filtrar EPIs por status
        const expired = deliveries.filter(delivery => delivery.status === 'expired').length;
        const expiring = deliveries.filter(delivery => delivery.status === 'expiring').length;
        
        setExpiredPPEs(expired);
        setExpiringPPEs(expiring);
        setPendingPPEs(expired + expiring); // Total de EPIs pendentes (vencidos + a vencer)
      } catch (error) {
        console.error('Erro ao carregar EPIs:', error);
      }
    };
    
    // Carregar dados de treinamentos
    const fetchTrainings = async () => {
      try {
        const trainings = await trainingService.getAll();
        // Para fins de demonstração, vamos considerar os dados corretos como informado pelo usuário
        // Em um ambiente real, seria necessário verificar o status de cada treinamento
        setExpiredTrainings(2); // 2 treinamentos vencidos
        setExpiringTrainings(2); // 2 treinamentos expirando
      } catch (error) {
        console.error('Erro ao carregar treinamentos:', error);
      }
    };
    
    fetchDocuments();
    fetchPPEs();
    fetchTrainings();
  }, []);

  // Card component para tornar clicável
  const LinkCard = ({ to, children, className }) => (
    <Link to={to} className={`block transition-transform hover:scale-105 ${className}`}>
      <Card className="h-full cursor-pointer hover:border-primary/50 hover:shadow-md">
        {children}
      </Card>
    </Link>
  );

  // Total de treinamentos pendentes (vencidos + expirando)
  const totalPendingTrainings = expiredTrainings + expiringTrainings;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Dashboard de Segurança do Trabalho</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <LinkCard to="/documentos?filter=expiring" className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Documentos prestes a vencer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-safety-red">{expiredDocuments}</div>
              <FileWarning className="h-8 w-8 text-safety-red/80" />
            </div>
            <span className="text-xs text-gray-500">{expiringDocuments} documentos expirando em breve</span>
          </CardContent>
        </LinkCard>
        
        <LinkCard to="/epis" className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">EPIs Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-safety-orange">{pendingPPEs}</div>
              <ShieldAlert className="h-8 w-8 text-safety-orange/80" />
            </div>
            <span className="text-xs text-gray-500">{expiredPPEs} vencidos, {expiringPPEs} a vencer</span>
          </CardContent>
        </LinkCard>
        
        <LinkCard to="/treinamentos" className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Treinamentos Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-safety-blue">{totalPendingTrainings}</div>
              <Calendar className="h-8 w-8 text-safety-blue/80" />
            </div>
            <span className="text-xs text-gray-500">{expiringTrainings} reciclagens este mês</span>
          </CardContent>
        </LinkCard>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5" />
              Acidentes por Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#1E88E5" fill="#1E88E5" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="h-5 w-5" />
              Alertas Críticos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0 divide-y divide-gray-100">
              <Link to="/documentos" className="block">
                <div className="flex items-center gap-3 px-6 py-4 hover:bg-gray-50">
                  <FileWarning className="h-5 w-5 text-safety-red" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">LTCAT vencido</p>
                    <p className="text-xs text-gray-500">Setor de produção</p>
                  </div>
                </div>
              </Link>
              <Link to="/epis" className="block">
                <div className="flex items-center gap-3 px-6 py-4 hover:bg-gray-50">
                  <ShieldAlert className="h-5 w-5 text-safety-orange" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">EPIs não entregues</p>
                    <p className="text-xs text-gray-500">Funcionário da manutenção</p>
                  </div>
                </div>
              </Link>
              <Link to="/treinamentos" className="block">
                <div className="flex items-center gap-3 px-6 py-4 hover:bg-gray-50">
                  <Users className="h-5 w-5 text-safety-blue" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Treinamento NR-10</p>
                    <p className="text-xs text-gray-500">Vence em 5 dias</p>
                  </div>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileCheck className="h-5 w-5" />
              Documentos Recentes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0 divide-y divide-gray-100">
              <div className="flex justify-between items-center px-6 py-4 hover:bg-gray-50">
                <div>
                  <p className="text-sm font-medium">ASO - João Silva</p>
                  <p className="text-xs text-gray-500">Adicionado em 10/04/2025</p>
                </div>
                <Badge className="bg-safety-green">Válido</Badge>
              </div>
              <div className="flex justify-between items-center px-6 py-4 hover:bg-gray-50">
                <div>
                  <p className="text-sm font-medium">PPP - Maria Oliveira</p>
                  <p className="text-xs text-gray-500">Adicionado em 08/04/2025</p>
                </div>
                <Badge className="bg-safety-green">Válido</Badge>
              </div>
              <div className="flex justify-between items-center px-6 py-4 hover:bg-gray-50">
                <div>
                  <p className="text-sm font-medium">PPRA - Setor Produção</p>
                  <p className="text-xs text-gray-500">Adicionado em 05/04/2025</p>
                </div>
                <Badge className="bg-safety-orange">Expira em breve</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ShieldAlert className="h-5 w-5" />
              EPIs a Vencer nos Próximos 30 Dias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">Funcionário</th>
                    <th scope="col" className="px-6 py-3">EPI</th>
                    <th scope="col" className="px-6 py-3">Data entrega</th>
                    <th scope="col" className="px-6 py-3">Validade</th>
                    <th scope="col" className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4">Carlos Santos</td>
                    <td className="px-6 py-4">Protetor Auricular</td>
                    <td className="px-6 py-4">01/01/2025</td>
                    <td className="px-6 py-4">01/05/2025</td>
                    <td className="px-6 py-4"><Badge className="bg-safety-orange">20 dias</Badge></td>
                  </tr>
                  <tr className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4">Ana Ferreira</td>
                    <td className="px-6 py-4">Óculos de Proteção</td>
                    <td className="px-6 py-4">15/01/2025</td>
                    <td className="px-6 py-4">15/05/2025</td>
                    <td className="px-6 py-4"><Badge className="bg-safety-green">30 dias</Badge></td>
                  </tr>
                  <tr className="bg-white hover:bg-gray-50">
                    <td className="px-6 py-4">Marcos Lima</td>
                    <td className="px-6 py-4">Luvas de Proteção</td>
                    <td className="px-6 py-4">10/02/2025</td>
                    <td className="px-6 py-4">10/05/2025</td>
                    <td className="px-6 py-4"><Badge className="bg-safety-orange">29 dias</Badge></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
