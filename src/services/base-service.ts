import { generateId } from '@/utils/id-generator';

export interface BaseEntity {
  id?: number;
  created_at?: string;
}

export class BaseService<T extends BaseEntity> {
  protected items: T[] = [];

  constructor(initialItems: T[] = []) {
    this.items = initialItems;
  }

  create(item: Omit<T, 'id' | 'created_at'>): T {
    const newItem = {
      ...item,
      id: generateId(this.items),
      created_at: new Date().toISOString(),
    } as T;
    this.items.push(newItem);
    return newItem;
  }

  getAll(): T[] {
    return [...this.items];
  }

  getById(id: number): T | null {
    return this.items.find(item => item.id === id) || null;
  }

  update(id: number, updates: Partial<T>): T | null {
    const index = this.items.findIndex(item => item.id === id);
    if (index === -1) return null;
    
    this.items[index] = { ...this.items[index], ...updates };
    return this.items[index];
  }

  delete(id: number): boolean {
    const index = this.items.findIndex(item => item.id === id);
    if (index === -1) return false;
    
    this.items.splice(index, 1);
    return true;
  }

  protected filterItems(predicate: (item: T) => boolean): T[] {
    return this.items.filter(predicate);
  }

  protected findItem(predicate: (item: T) => boolean): T | undefined {
    return this.items.find(predicate);
  }
}