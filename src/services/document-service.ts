import { Document } from './types';
import { store } from './data-service';

export const documentService = {
  async getAll(): Promise<Document[]> {
    return store.documents;
  },

  async create(document: Omit<Document, 'id' | 'created_at'>): Promise<Document> {
    const newDocument = {
      ...document,
      id: store.documents.length > 0 ? Math.max(...store.documents.map(d => d.id)) + 1 : 1,
      created_at: new Date().toISOString(),
    } as Document;
    
    store.documents.push(newDocument);
    return newDocument;
  },

  async update(id: number, document: Partial<Document>): Promise<Document> {
    const index = store.documents.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Document not found');

    store.documents[index] = {
      ...store.documents[index],
      ...document,
      updated_at: new Date().toISOString()
    };

    return store.documents[index];
  },

  async delete(id: number): Promise<void> {
    const index = store.documents.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Document not found');

    store.documents.splice(index, 1);
  },

  async getByType(type: string): Promise<Document[]> {
    return store.documents.filter(d => d.type === type);
  }
};