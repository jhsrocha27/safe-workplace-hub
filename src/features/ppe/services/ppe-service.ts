
import { storageService } from '@/services/storage-service';
import type { PPEItem, PPEDelivery } from '@/services/types';

// Funções auxiliares para converter entre formatos
const convertToPPEItem = (ppe: any): PPEItem => ({
  id: ppe.id,
  name: ppe.name,
  ca: ppe.ca_number,
  type: ppe.type,
  validityPeriod: ppe.validity_period_months,
  description: ppe.description || '',
  created_at: ppe.created_at
});

const convertFromPPEItem = (ppe: Omit<PPEItem, 'id' | 'created_at'>) => ({
  name: ppe.name,
  ca_number: ppe.ca,
  type: ppe.type,
  validity_period_months: ppe.validityPeriod,
  description: ppe.description,
  validity_date: new Date(Date.now() + ppe.validityPeriod * 30 * 24 * 60 * 60 * 1000).toISOString(),
  quantity: 0
});

const convertToPPEDelivery = (delivery: any): PPEDelivery => ({
  id: delivery.id,
  employee_id: delivery.employee_id,
  employeeName: delivery.employeeName,
  position: delivery.position,
  department: delivery.department,
  ppe_id: delivery.ppe_id,
  ppeName: delivery.ppeName,
  delivery_date: delivery.delivery_date,
  expiryDate: delivery.expiryDate,
  quantity: delivery.quantity || 1,
  status: delivery.status,
  signature: delivery.signature,
  created_at: delivery.created_at
});

const convertFromPPEDelivery = (delivery: Omit<PPEDelivery, 'id' | 'created_at'>) => ({
  employee_id: delivery.employee_id,
  ppe_id: delivery.ppe_id,
  employeeName: delivery.employeeName,
  ppeName: delivery.ppeName,
  department: delivery.department,
  position: delivery.position,
  delivery_date: delivery.delivery_date,
  expiryDate: delivery.expiryDate,
  quantity: delivery.quantity || 1,
  status: delivery.status,
  signature: delivery.signature || false
});

export const ppeItemService = {
  async getAll(): Promise<PPEItem[]> {
    try {
      const response = await storageService.getAll('ppes');
      return response;
    } catch (error) {
      console.error('Erro ao buscar EPIs:', error);
      throw error;
    }
  },

  async getById(id: number): Promise<PPEItem> {
    try {
      const response = await storageService.getById('ppes', id);
      if (!response) throw new Error('EPI não encontrado');
      return response;
    } catch (error) {
      console.error(`Erro ao buscar EPI com ID ${id}:`, error);
      throw error;
    }
  },

  async create(ppeItem: Omit<PPEItem, 'id' | 'created_at'>): Promise<PPEItem> {
    try {
      return await storageService.create('ppes', ppeItem);
    } catch (error) {
      console.error('Erro ao criar EPI:', error);
      throw error;
    }
  },

  async update(id: number, ppeItem: Partial<PPEItem>): Promise<PPEItem> {
    try {
      return await storageService.update('ppes', id, ppeItem);
    } catch (error) {
      console.error(`Erro ao atualizar EPI com ID ${id}:`, error);
      throw error;
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await storageService.delete('ppes', id);
    } catch (error) {
      console.error(`Erro ao excluir EPI com ID ${id}:`, error);
      throw error;
    }
  }
};

export const ppeDeliveryService = {
  async getAll(): Promise<PPEDelivery[]> {
    try {
      const response = await storageService.getAll('ppe_deliveries');
      return response;
    } catch (error) {
      console.error('Erro ao buscar entregas de EPIs:', error);
      throw error;
    }
  },

  async getById(id: number): Promise<PPEDelivery> {
    try {
      const response = await storageService.getById('ppe_deliveries', id);
      if (!response) throw new Error('Entrega não encontrada');
      return response;
    } catch (error) {
      console.error(`Erro ao buscar entrega com ID ${id}:`, error);
      throw error;
    }
  },

  async create(delivery: Omit<PPEDelivery, 'id' | 'created_at'>): Promise<PPEDelivery> {
    try {
      return await storageService.create('ppe_deliveries', delivery);
    } catch (error) {
      console.error('Erro ao criar entrega de EPI:', error);
      throw error;
    }
  },

  async update(id: number, delivery: Partial<PPEDelivery>): Promise<PPEDelivery> {
    try {
      return await storageService.update('ppe_deliveries', id, delivery);
    } catch (error) {
      console.error(`Erro ao atualizar entrega com ID ${id}:`, error);
      throw error;
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await storageService.delete('ppe_deliveries', id);
    } catch (error) {
      console.error(`Erro ao excluir entrega com ID ${id}:`, error);
      throw error;
    }
  }
};
