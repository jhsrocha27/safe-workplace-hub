
import { supabase as supabaseClient, TABLES, type Tables } from '../config/supabase';
import type { Database } from '../config/database.types';

// Export the supabase client so it can be used directly
export const supabase = supabaseClient;

type TableName = keyof Database['public']['Tables'];
type Row<T extends TableName> = Database['public']['Tables'][T]['Row'];
type Insert<T extends TableName> = Database['public']['Tables'][T]['Insert'];
type Update<T extends TableName> = Database['public']['Tables'][T]['Update'];

export class SupabaseService<T extends TableName> {
  constructor(private table: T) {}

  async getAll(): Promise<Row<T>[]> {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getById(id: number): Promise<Row<T> | null> {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async create(item: Insert<T>): Promise<Row<T>> {
    const { data, error } = await supabase
      .from(this.table)
      .insert([item])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: number, updates: Update<T>): Promise<Row<T>> {
    const { data, error } = await supabase
      .from(this.table)
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from(this.table)
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async query() {
    return supabase.from(this.table);
  }
}

// Instâncias pré-configuradas para cada tabela
export const employeesService = new SupabaseService(TABLES.EMPLOYEES);
export const ppesService = new SupabaseService(TABLES.PPES);
export const ppeDeliveriesService = new SupabaseService(TABLES.PPE_DELIVERIES);
export const accidentsService = new SupabaseService(TABLES.ACCIDENTS);
export const trainingsService = new SupabaseService(TABLES.TRAININGS);
export const communicationsService = new SupabaseService(TABLES.COMMUNICATIONS);
export const documentsService = new SupabaseService(TABLES.DOCUMENTS);
