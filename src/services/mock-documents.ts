import { Document } from './types';

// Calcular datas para diferentes status
const today = new Date();
const expiredDate = new Date(today);
expiredDate.setMonth(today.getMonth() - 1);

const expiringDate = new Date(today);
expiringDate.setDate(today.getDate() + 15);

const validDate = new Date(today);
validDate.setFullYear(today.getFullYear() + 1);

export const mockDocuments: Document[] = [
  {
    id: 1,
    name: 'PPRA',
    type: 'Programa',
    company: 'TecSafe',
    sector: 'Geral',
    status: 'expired',
    expiryDate: expiredDate.toISOString(),
    linkTo: 'company',
    uploadDate: new Date(expiredDate.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(expiredDate.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 2,
    name: 'PCMSO',
    type: 'Programa',
    company: 'TecSafe',
    sector: 'Geral',
    status: 'expiring',
    expiryDate: expiringDate.toISOString(),
    linkTo: 'company',
    uploadDate: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 3,
    name: 'ASO',
    type: 'Atestado',
    company: 'TecSafe',
    sector: 'Produção',
    employee: 'João Silva',
    status: 'valid',
    expiryDate: validDate.toISOString(),
    linkTo: 'employee',
    uploadDate: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 4,
    name: 'Ficha de EPI',
    type: 'Controle',
    company: 'TecSafe',
    sector: 'Manutenção',
    employee: 'Maria Santos',
    status: 'valid',
    expiryDate: validDate.toISOString(),
    linkTo: 'employee',
    uploadDate: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 5,
    name: 'Certificado NR10',
    type: 'Certificado',
    company: 'TecSafe',
    sector: 'Manutenção',
    employee: 'Carlos Pereira',
    status: 'valid',
    expiryDate: validDate.toISOString(),
    linkTo: 'employee',
    uploadDate: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString()
  }
];