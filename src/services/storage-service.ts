import { v4 as uuidv4 } from 'uuid';
import { Employee, PPEItem, PPEDelivery } from './types';

type StorageData = {
  employees: Employee[];
  ppes: PPEItem[];
  ppe_deliveries: PPEDelivery[];
};

class LocalStorageService {
  private storage: StorageData = {
    employees: [],
    ppes: [],
    ppe_deliveries: []
  };

  private listeners: { [key: string]: ((data: any) => void)[] } = {};

  constructor() {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage() {
    try {
      const data = localStorage.getItem('app_data');
      if (data) {
        this.storage = JSON.parse(data);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do localStorage:', error);
    }
  }

  private saveToLocalStorage() {
    try {
      localStorage.setItem('app_data', JSON.stringify(this.storage));
    } catch (error) {
      console.error('Erro ao salvar dados no localStorage:', error);
    }
  }

  private notifyListeners(table: keyof StorageData, data: any) {
    if (this.listeners[table]) {
      this.listeners[table].forEach(listener => listener(data));
    }
  }

  subscribe(table: keyof StorageData, callback: (data: any) => void) {
    if (!this.listeners[table]) {
      this.listeners[table] = [];
    }
    this.listeners[table].push(callback);

    return () => {
      this.listeners[table] = this.listeners[table].filter(cb => cb !== callback);
    };
  }

  async getAll<T extends keyof StorageData>(table: T): Promise<StorageData[T]> {
    return this.storage[table];
  }

  async getById<T extends keyof StorageData>(table: T, id: number): Promise<StorageData[T][0] | null> {
    const item = this.storage[table].find(item => item.id === id);
    return item || null;
  }

  async create<T extends keyof StorageData>(table: T, data: Omit<StorageData[T][0], 'id' | 'created_at'>): Promise<StorageData[T][0]> {
    const newItem = {
      ...data,
      id: this.storage[table].length + 1,
      created_at: new Date().toISOString()
    } as StorageData[T][0];

    this.storage[table] = [...this.storage[table], newItem] as StorageData[T];
    this.saveToLocalStorage();
    this.notifyListeners(table, this.storage[table]);

    return newItem;
  }

  async update<T extends keyof StorageData>(table: T, id: number, updates: Partial<StorageData[T][0]>): Promise<StorageData[T][0]> {
    const index = this.storage[table].findIndex(item => item.id === id);
    if (index === -1) throw new Error('Item não encontrado');

    const updatedItem = {
      ...this.storage[table][index],
      ...updates
    };

    this.storage[table][index] = updatedItem;
    this.saveToLocalStorage();
    this.notifyListeners(table, this.storage[table]);

    return updatedItem;
  }

  async delete<T extends keyof StorageData>(table: T, id: number): Promise<void> {
    const filteredItems = this.storage[table].filter(item => item.id !== id) as StorageData[T];
    this.storage[table] = filteredItems;
    this.saveToLocalStorage();
    this.notifyListeners(table, this.storage[table]);
  }
}

export const storageService = new LocalStorageService();

// Serviços específicos para cada entidade
export const employeesService = {
  getAll: () => storageService.getAll('employees'),
  getById: (id: number) => storageService.getById('employees', id),
  create: (data: Omit<Employee, 'id' | 'created_at'>) => storageService.create('employees', data),
  update: (id: number, data: Partial<Employee>) => storageService.update('employees', id, data),
  delete: (id: number) => storageService.delete('employees', id),
  subscribe: (callback: (data: any) => void) => storageService.subscribe('employees', callback)
};

export const ppesService = {
  getAll: () => storageService.getAll('ppes'),
  getById: (id: number) => storageService.getById('ppes', id),
  create: (data: Omit<PPEItem, 'id' | 'created_at'>) => storageService.create('ppes', data),
  update: (id: number, data: Partial<PPEItem>) => storageService.update('ppes', id, data),
  delete: (id: number) => storageService.delete('ppes', id)
};

export const ppeDeliveriesService = {
  getAll: () => storageService.getAll('ppe_deliveries'),
  getById: (id: number) => storageService.getById('ppe_deliveries', id),
  create: (data: Omit<PPEDelivery, 'id' | 'created_at'>) => storageService.create('ppe_deliveries', data),
  update: (id: number, data: Partial<PPEDelivery>) => storageService.update('ppe_deliveries', id, data),
  delete: (id: number) => storageService.delete('ppe_deliveries', id)
};