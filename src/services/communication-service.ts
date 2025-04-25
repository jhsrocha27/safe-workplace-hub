import { Communication } from './types';
import { communicationService as dataService } from './data-service';

export const communicationService = {
  async getAll(): Promise<Communication[]> {
    return dataService.getAll();
  },

  async create(communication: Omit<Communication, 'id' | 'created_at'>): Promise<Communication> {
    return dataService.create(communication);
  },

  async update(id: number, communication: Partial<Communication>): Promise<Communication | null> {
    return dataService.update(id, communication);
  },

  async delete(id: number): Promise<void> {
    dataService.delete(id);
  },

  async getByType(type: string): Promise<Communication[]> {
    const communications = await dataService.getAll();
    return communications.filter(comm => comm.type === type);
  },

  async getByPriority(priority: string): Promise<Communication[]> {
    const communications = await dataService.getAll();
    return communications.filter(comm => comm.priority === priority);
  }
};

export const settingService = {
  async getAll(): Promise<any[]> {
    return [];
  },

  async get(key: string): Promise<any | null> {
    return null;
  },

  async set(key: string, value: string, description?: string): Promise<any> {
    return { key, value, description };
  },

  async delete(key: string): Promise<void> {
    return;
  }
};