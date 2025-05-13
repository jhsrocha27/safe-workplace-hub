
// Definição dos tipos base para o sistema

export interface Employee {
  id: number;
  name: string;
  position: string;
  department: string;
  status: string;
  created_at?: string;
}

export interface PPE {
  id: number;
  name: string;
  type: string;
  ca_number: string;
  validity_date: string;
  quantity: number;
  description?: string; // Added description property as optional
  created_at?: string;
}

export interface PPEItem {
  id: number;
  name: string;
  ca: string;
  type: string;
  validityPeriod: number;
  description: string;
  created_at: string;
}

export interface PPEDelivery {
  id: number;
  employee_id: number;
  ppe_id: number;
  employeeName: string;
  ppeName: string;
  department: string;
  position: string;
  delivery_date: string;
  expiryDate: string;
  quantity: number;
  status: 'valid' | 'expired' | 'expiring';
  signature: boolean;
  created_at?: string;
  
  // Additional properties needed for component compatibility
  employeeId?: number;
  ppeId?: number;
  issueDate?: string;
}

export interface Accident {
  id: number;
  date: string;
  description: string;
  location: string;
  severity: string;
  employee_id: number;
  measures_taken: string;
  created_at?: string;
}

export interface Training {
  id: number;
  title: string;
  description: string;
  date: string;
  instructor: string;
  duration: number;
  participants: number[];
  created_at?: string;
}

export interface Communication {
  id: number;
  title: string;
  content: string;
  date: string;
  author: string;
  recipients: string[];
  type: string;
  priority: string;
  created_at?: string;
}

export interface Document {
  id: number;
  name: string;
  type: string;
  company: string;
  sector: string;
  employee?: string;
  status: 'valid' | 'expiring' | 'expired';
  expiryDate: string;
  uploadDate: string;
  fileUrl?: string;
  created_at?: string;
  updated_at?: string;
  linkTo: 'company' | 'employee';
}
