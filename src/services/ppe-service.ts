import { Employee, PPEItem, PPEDelivery } from './types';
import { store } from './data-service';
import { ppeData, ppeDeliveryData } from './mock-data';

// Função para converter PPE para PPEItem
const convertPPEtoPPEItem = (ppe: any): PPEItem => ({
  id: ppe.id,
  name: ppe.name,
  ca: ppe.ca_number,
  type: ppe.type,
  validityPeriod: new Date(ppe.validity_date).getTime() - new Date().getTime(),
  description: ppe.description || '',
  created_at: ppe.created_at || new Date().toISOString()
});

// Função auxiliar para gerar IDs únicos
const generateId = (array: any[]): number => {
  return array.length > 0 ? Math.max(...array.map(item => item.id)) + 1 : 1;
};

// Serviços para Funcionários
export const employeeService = {
  async getAll(): Promise<Employee[]> {
    return store.employees;
  },

  async create(employee: Omit<Employee, 'id' | 'created_at'>): Promise<Employee> {
    const newEmployee = {
      ...employee,
      id: generateId(store.employees),
      created_at: new Date().toISOString()
    };
    store.employees.push(newEmployee);
    return newEmployee;
  },

  async update(id: number, employee: Partial<Employee>): Promise<Employee> {
    const index = store.employees.findIndex(emp => emp.id === id);
    if (index === -1) throw new Error('Employee not found');
    store.employees[index] = { ...store.employees[index], ...employee };
    return store.employees[index];
  },

  async delete(id: number): Promise<void> {
    const index = store.employees.findIndex(emp => emp.id === id);
    if (index === -1) throw new Error('Employee not found');
    store.employees.splice(index, 1);
  }
};

// Serviços para EPIs
export const ppeItemService = {
  async getAll(): Promise<PPEItem[]> {
    return store.ppes.map(convertPPEtoPPEItem);
  },

  async create(ppeItem: Omit<PPEItem, 'id' | 'created_at'>): Promise<PPEItem> {
    const newPPE = {
      id: generateId(store.ppes),
      name: ppeItem.name,
      type: ppeItem.type,
      ca_number: ppeItem.ca,
      validity_date: new Date(Date.now() + ppeItem.validityPeriod).toISOString(),
      quantity: 0,
      description: ppeItem.description || '',
      created_at: new Date().toISOString()
    };
    store.ppes.push(newPPE);
    return convertPPEtoPPEItem(newPPE);
  },

  async update(id: number, ppeItem: Partial<PPEItem>): Promise<PPEItem> {
    const index = store.ppes.findIndex(ppe => ppe.id === id);
    if (index === -1) throw new Error('PPE item not found');
    
    const currentPPE = store.ppes[index];
    const updatedPPE = {
      ...currentPPE,
      name: ppeItem.name ?? currentPPE.name,
      type: ppeItem.type ?? currentPPE.type,
      ca_number: ppeItem.ca ?? currentPPE.ca_number,
      description: ppeItem.description ?? (currentPPE.description || ''),
      validity_date: ppeItem.validityPeriod
        ? new Date(Date.now() + ppeItem.validityPeriod).toISOString()
        : currentPPE.validity_date
    };
    
    store.ppes[index] = updatedPPE;
    return convertPPEtoPPEItem(updatedPPE);
  },

  async delete(id: number): Promise<void> {
    const index = store.ppes.findIndex(ppe => ppe.id === id);
    if (index === -1) throw new Error('PPE item not found');
    store.ppes.splice(index, 1);
  }
};

// Serviços para Entregas de EPIs
export const ppeDeliveryService = {
  async getAll(): Promise<PPEDelivery[]> {
    // Usando os dados fictícios para testes
    if (ppeDeliveryData && ppeDeliveryData.length > 0) {
      return ppeDeliveryData;
    }
    
    // Fallback para dados do store se ppeDeliveryData não estiver disponível
    return store.ppeDeliveries.map(delivery => ({
      ...delivery,
      employee: store.employees.find(emp => emp.id === delivery.employee_id),
      ppe: convertPPEtoPPEItem(store.ppes.find(ppe => ppe.id === delivery.ppe_id)),
      employeeId: delivery.employee_id,
      ppeId: delivery.ppe_id,
      issueDate: delivery.delivery_date
    }));
  },

  async create(delivery: Omit<PPEDelivery, 'id' | 'created_at'>): Promise<PPEDelivery> {
    const newDelivery = {
      ...delivery,
      id: generateId(store.ppeDeliveries),
      created_at: new Date().toISOString()
    };
    store.ppeDeliveries.push(newDelivery);
    return {
      ...newDelivery,
      employeeId: newDelivery.employee_id,
      ppeId: newDelivery.ppe_id,
      issueDate: newDelivery.delivery_date
    };
  },

  async update(id: number, delivery: Partial<PPEDelivery>): Promise<PPEDelivery> {
    const index = store.ppeDeliveries.findIndex(del => del.id === id);
    if (index === -1) throw new Error('Delivery not found');
    store.ppeDeliveries[index] = { ...store.ppeDeliveries[index], ...delivery };
    return {
      ...store.ppeDeliveries[index],
      employeeId: store.ppeDeliveries[index].employee_id,
      ppeId: store.ppeDeliveries[index].ppe_id,
      issueDate: store.ppeDeliveries[index].delivery_date
    };
  },

  async delete(id: number): Promise<void> {
    const index = store.ppeDeliveries.findIndex(del => del.id === id);
    if (index === -1) throw new Error('Delivery not found');
    store.ppeDeliveries.splice(index, 1);
  },

  async getByEmployee(employeeId: number): Promise<PPEDelivery[]> {
    return store.ppeDeliveries
      .filter(delivery => delivery.employee_id === employeeId)
      .map(delivery => ({
        ...delivery,
        ppe: convertPPEtoPPEItem(store.ppes.find(ppe => ppe.id === delivery.ppe_id)),
        employeeId: delivery.employee_id,
        ppeId: delivery.ppe_id,
        issueDate: delivery.delivery_date
      }));
  }
};
