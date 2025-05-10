
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

export const supabaseUrl = 'https://zepmctimalfglwvuiceq.supabase.co';
export const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplcG1jdGltYWxmZ2x3dnVpY2VxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2MjM1MjUsImV4cCI6MjA2MjE5OTUyNX0.YHPMGl27w_GwuPnrBlV2scTACUgt-mvSX9l13up8Q8M';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Definição das tabelas
export const TABLES = {
  EMPLOYEES: 'employees',
  PPES: 'ppes',
  PPE_DELIVERIES: 'ppe_deliveries',
  ACCIDENTS: 'accidents',
  TRAININGS: 'trainings',
  COMMUNICATIONS: 'communications',
  DOCUMENTS: 'documents'
} as const;

// Tipos de retorno das tabelas
export type Tables = typeof TABLES[keyof typeof TABLES];
