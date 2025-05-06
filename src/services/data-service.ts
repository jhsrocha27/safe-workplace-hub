import { Employee, PPE, PPEDelivery, Accident, Training, Communication, Document } from './types';

import { mockDocuments } from './mock-documents';

// Armazenamento temporário em memória
export const store = {
  employees: [] as Employee[],
  ppes: [] as PPE[],
  ppeDeliveries: [] as PPEDelivery[],
  accidents: [] as Accident[],
  trainings: [] as Training[],
  communications: [] as Communication[],
  documents: [...mockDocuments] as Document[],
};

// Função auxiliar para gerar IDs únicos
const generateId = (array: any[]): number => {
  return array.length > 0 ? Math.max(...array.map(item => item.id)) + 1 : 1;
};

// Funções genéricas CRUD
const createItem = <T extends { id?: number }>(collection: T[], item: Omit<T, 'id'>): T => {
  const newItem = {
    ...item,
    id: generateId(collection),
    created_at: new Date().toISOString(),
  } as unknown as T;
  collection.push(newItem);
  return newItem;
};

const getItems = <T>(collection: T[]): T[] => {
  return [...collection];
};

const getItemById = <T extends { id: number }>(collection: T[], id: number): T | null => {
  return collection.find(item => item.id === id) || null;
};

const updateItem = <T extends { id: number }>(collection: T[], id: number, updates: Partial<T>): T | null => {
  const index = collection.findIndex(item => item.id === id);
  if (index === -1) return null;
  collection[index] = { ...collection[index], ...updates };
  return collection[index];
};

const deleteItem = <T extends { id: number }>(collection: T[], id: number): boolean => {
  const index = collection.findIndex(item => item.id === id);
  if (index === -1) return false;
  collection.splice(index, 1);
  return true;
};

// Exportar funções específicas para cada entidade
export const employeeService = {
  create: (employee: Omit<Employee, 'id'>) => createItem(store.employees, employee),
  getAll: () => getItems(store.employees),
  getById: (id: number) => getItemById(store.employees, id),
  update: (id: number, updates: Partial<Employee>) => updateItem(store.employees, id, updates),
  delete: (id: number) => deleteItem(store.employees, id),
};

export const ppeService = {
  create: (ppe: Omit<PPE, 'id'>) => createItem(store.ppes, ppe),
  getAll: () => getItems(store.ppes),
  getById: (id: number) => getItemById(store.ppes, id),
  update: (id: number, updates: Partial<PPE>) => updateItem(store.ppes, id, updates),
  delete: (id: number) => deleteItem(store.ppes, id),
};

export const ppeDeliveryService = {
  create: (delivery: Omit<PPEDelivery, 'id'>) => createItem(store.ppeDeliveries, delivery),
  getAll: () => getItems(store.ppeDeliveries),
  getById: (id: number) => getItemById(store.ppeDeliveries, id),
  update: (id: number, updates: Partial<PPEDelivery>) => updateItem(store.ppeDeliveries, id, updates),
  delete: (id: number) => deleteItem(store.ppeDeliveries, id),
};

export const accidentService = {
  create: (accident: Omit<Accident, 'id'>) => createItem(store.accidents, accident),
  getAll: () => getItems(store.accidents),
  getById: (id: number) => getItemById(store.accidents, id),
  update: (id: number, updates: Partial<Accident>) => updateItem(store.accidents, id, updates),
  delete: (id: number) => deleteItem(store.accidents, id),
};

export const trainingService = {
  create: (training: Omit<Training, 'id'>) => createItem(store.trainings, training),
  getAll: () => getItems(store.trainings),
  getById: (id: number) => getItemById(store.trainings, id),
  update: (id: number, updates: Partial<Training>) => updateItem(store.trainings, id, updates),
  delete: (id: number) => deleteItem(store.trainings, id),
};

export const communicationService = {
  create: (communication: Omit<Communication, 'id'>) => createItem(store.communications, communication),
  getAll: () => getItems(store.communications),
  getById: (id: number) => getItemById(store.communications, id),
  update: (id: number, updates: Partial<Communication>) => updateItem(store.communications, id, updates),
  delete: (id: number) => deleteItem(store.communications, id),
};

export const documentService = {
  create: (document: Omit<Document, 'id'>) => createItem(store.documents, document),
  getAll: () => getItems(store.documents),
  getById: (id: number) => getItemById(store.documents, id),
  update: (id: number, updates: Partial<Document>) => updateItem(store.documents, id, updates),
  delete: (id: number) => deleteItem(store.documents, id),
};