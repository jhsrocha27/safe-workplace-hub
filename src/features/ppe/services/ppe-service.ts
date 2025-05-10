
import { ppesService, ppeDeliveriesService } from '@/services/supabase-service';
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
  description: ppe.description || '',
  quantity: 0
});

const convertToPPEDelivery = (delivery: any): PPEDelivery => ({
  id: delivery.id,
  employeeId: delivery.employee_id,
  employeeName: delivery.employeeName,
  position: delivery.position,
  department: delivery.department,
  ppeId: delivery.ppe_id,
  ppeName: delivery.ppeName,
  issueDate: delivery.delivery_date,
  expiryDate: delivery.expiryDate,
  status: delivery.status,
  signature: delivery.signature,
  created_at: delivery.created_at
});

const convertFromPPEDelivery = (delivery: Omit<PPEDelivery, 'id' | 'created_at'>) => ({
  employee_id: delivery.employeeId,
  ppe_id: delivery.ppeId,
  employeeName: delivery.employeeName,
  ppeName: delivery.ppeName,
  department: delivery.department,
  position: delivery.position,
  delivery_date: delivery.issueDate,
  expiryDate: delivery.expiryDate,
  quantity: 1,
  status: delivery.status,
  signature: delivery.signature || false
});

export const ppeItemService = {
  async getAll(): Promise<PPEItem[]> {
    try {
      const response = await ppesService.getAll();
      return response.map(convertToPPEItem);
    } catch (error) {
      console.error('Erro ao buscar EPIs:', error);
      throw error;
    }
  },

  async getById(id: number): Promise<PPEItem> {
    try {
      const response = await ppesService.getById(id);
      if (!response) throw new Error('EPI não encontrado');
      return convertToPPEItem(response);
    } catch (error) {
      console.error(`Erro ao buscar EPI com ID ${id}:`, error);
      throw error;
    }
  },

  async create(ppeItem: Omit<PPEItem, 'id' | 'created_at'>): Promise<PPEItem> {
    try {
      const ppeData = convertFromPPEItem(ppeItem);
      const response = await ppesService.create(ppeData);
      return convertToPPEItem(response);
    } catch (error) {
      console.error('Erro ao criar EPI:', error);
      throw error;
    }
  },

  async update(id: number, ppeItem: Partial<PPEItem>): Promise<PPEItem> {
    try {
      const updateData: any = {};
      if (ppeItem.name) updateData.name = ppeItem.name;
      if (ppeItem.ca) updateData.ca_number = ppeItem.ca;
      if (ppeItem.type) updateData.type = ppeItem.type;
      if (ppeItem.validityPeriod) updateData.validity_period_months = ppeItem.validityPeriod;
      if (ppeItem.description !== undefined) updateData.description = ppeItem.description;
      
      const response = await ppesService.update(id, updateData);
      return convertToPPEItem(response);
    } catch (error) {
      console.error(`Erro ao atualizar EPI com ID ${id}:`, error);
      throw error;
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await ppesService.delete(id);
    } catch (error) {
      console.error(`Erro ao excluir EPI com ID ${id}:`, error);
      throw error;
    }
  }
};

export const ppeDeliveryService = {
  async getAll(): Promise<PPEDelivery[]> {
    try {
      const response = await ppeDeliveriesService.getAll();
      return response.map(convertToPPEDelivery);
    } catch (error) {
      console.error('Erro ao buscar entregas de EPIs:', error);
      throw error;
    }
  },

  async getById(id: number): Promise<PPEDelivery> {
    try {
      const response = await ppeDeliveriesService.getById(id);
      if (!response) throw new Error('Entrega não encontrada');
      return convertToPPEDelivery(response);
    } catch (error) {
      console.error(`Erro ao buscar entrega com ID ${id}:`, error);
      throw error;
    }
  },

  async create(delivery: Omit<PPEDelivery, 'id' | 'created_at'>): Promise<PPEDelivery> {
    try {
      const deliveryData = convertFromPPEDelivery(delivery);
      const response = await ppeDeliveriesService.create(deliveryData);
      return convertToPPEDelivery(response);
    } catch (error) {
      console.error('Erro ao criar entrega de EPI:', error);
      throw error;
    }
  },

  async update(id: number, delivery: Partial<PPEDelivery>): Promise<PPEDelivery> {
    try {
      const updateData: any = {};
      if (delivery.employeeId) updateData.employee_id = delivery.employeeId;
      if (delivery.employeeName) updateData.employeeName = delivery.employeeName;
      if (delivery.position) updateData.position = delivery.position;
      if (delivery.department) updateData.department = delivery.department;
      if (delivery.ppeId) updateData.ppe_id = delivery.ppeId;
      if (delivery.ppeName) updateData.ppeName = delivery.ppeName;
      if (delivery.issueDate) updateData.delivery_date = delivery.issueDate;
      if (delivery.expiryDate) updateData.expiryDate = delivery.expiryDate;
      if (delivery.status) updateData.status = delivery.status;
      if (delivery.signature !== undefined) updateData.signature = delivery.signature;
      
      const response = await ppeDeliveriesService.update(id, updateData);
      return convertToPPEDelivery(response);
    } catch (error) {
      console.error(`Erro ao atualizar entrega com ID ${id}:`, error);
      throw error;
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await ppeDeliveriesService.delete(id);
    } catch (error) {
      console.error(`Erro ao excluir entrega com ID ${id}:`, error);
      throw error;
    }
  }
};
