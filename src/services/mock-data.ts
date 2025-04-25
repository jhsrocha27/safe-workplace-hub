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
  }
];

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
    expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
    quantity: 1,
    status: 'valid',
    signature: true,
    created_at: new Date().toISOString()
  }
];