import { Training } from './types';
import { store } from './data-service';

interface TrainingParticipant {
  id: number;
  training_id: number;
  employee_id: number;
  status: string;
  created_at?: string;
}

export const trainingService = {
  async getAll(): Promise<Training[]> {
    return store.trainings;
  },

  async create(training: Omit<Training, 'id' | 'created_at'>): Promise<Training> {
    const newTraining = {
      ...training,
      id: store.trainings.length > 0 ? Math.max(...store.trainings.map(t => t.id)) + 1 : 1,
      created_at: new Date().toISOString()
    };
    store.trainings.push(newTraining);
    return newTraining;
  },

  async update(id: number, training: Partial<Training>): Promise<Training> {
    const index = store.trainings.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Training not found');
    
    store.trainings[index] = { ...store.trainings[index], ...training };
    return store.trainings[index];
  },

  async delete(id: number): Promise<void> {
    const index = store.trainings.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Training not found');
    
    store.trainings.splice(index, 1);
  },

  async getParticipants(trainingId: number): Promise<TrainingParticipant[]> {
    // Simular participantes do treinamento
    return [];
  },

  async addParticipant(participant: Omit<TrainingParticipant, 'id' | 'created_at'>): Promise<TrainingParticipant> {
    // Simular adição de participante
    return {
      id: 1,
      ...participant,
      created_at: new Date().toISOString()
    };
  },

  async updateParticipant(id: number, participant: Partial<TrainingParticipant>): Promise<TrainingParticipant> {
    // Simular atualização de participante
    return {
      id,
      training_id: participant.training_id || 0,
      employee_id: participant.employee_id || 0,
      status: participant.status || '',
      created_at: new Date().toISOString()
    };
  },

  async removeParticipant(id: number): Promise<void> {
    // Simular remoção de participante
  }
};