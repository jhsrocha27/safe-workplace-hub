
import { PPEItem, PPEDelivery } from './types';

export const ppeData: PPEItem[] = [
  {
    id: 1,
    name: 'Capacete de Segurança',
    ca: '123456',
    type: 'Proteção para cabeça',
    validityPeriod: 12,
    description: 'Capacete de segurança com carneira',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Luva de Proteção',
    ca: '789012',
    type: 'Proteção para mãos',
    validityPeriod: 6,
    description: 'Luva de proteção contra riscos mecânicos',
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    name: 'Óculos de Proteção',
    ca: '345678',
    type: 'Proteção visual',
    validityPeriod: 12,
    description: 'Óculos de proteção contra impactos',
    created_at: new Date().toISOString()
  }
];

// Calcular data de 3 meses atrás para item vencido
const expiredDate = new Date();
expiredDate.setMonth(expiredDate.getMonth() - 3);

// Calcular data de vencimento em 15 dias para itens a vencer
const expiringDateSoon = new Date();
expiringDateSoon.setDate(expiringDateSoon.getDate() + 15);

export const ppeDeliveryData: PPEDelivery[] = [
  {
    id: 1,
    employee_id: 1,
    ppe_id: 1,
    employeeName: 'João Silva',
    ppeName: 'Capacete de Segurança',
    position: 'Operador',
    department: 'Produção',
    delivery_date: new Date().toISOString(),
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    quantity: 1,
    status: 'valid',
    signature: true,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    employee_id: 2,
    ppe_id: 2,
    employeeName: 'Maria Santos',
    ppeName: 'Luva de Proteção',
    position: 'Técnica',
    department: 'Manutenção',
    delivery_date: new Date().toISOString(),
    expiryDate: expiringDateSoon.toISOString(),
    quantity: 1,
    status: 'expiring',
    signature: true,
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    employee_id: 3,
    ppe_id: 3,
    employeeName: 'Carlos Pereira',
    ppeName: 'Óculos de Proteção',
    position: 'Técnico',
    department: 'Laboratório',
    delivery_date: new Date(expiredDate).toISOString(),
    expiryDate: expiredDate.toISOString(),
    quantity: 1,
    status: 'expired',
    signature: false,
    created_at: expiredDate.toISOString()
  },
  {
    id: 4,
    employee_id: 4,
    ppe_id: 2,
    employeeName: 'Ana Ferreira',
    ppeName: 'Luva de Proteção',
    position: 'Operadora',
    department: 'Produção',
    delivery_date: new Date().toISOString(),
    expiryDate: expiringDateSoon.toISOString(),
    quantity: 1,
    status: 'expiring',
    signature: true,
    created_at: new Date().toISOString()
  }
];
