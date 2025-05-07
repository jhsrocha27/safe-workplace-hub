export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      employees: {
        Row: {
          id: number
          name: string
          position: string
          department: string
          status: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['employees']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['employees']['Insert']>
      }
      ppes: {
        Row: {
          id: number
          name: string
          type: string
          ca_number: string
          validity_date: string
          quantity: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['ppes']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['ppes']['Insert']>
      }
      ppe_deliveries: {
        Row: {
          id: number
          employee_id: number
          ppe_id: number
          employeeName: string
          ppeName: string
          department: string
          position: string
          delivery_date: string
          expiryDate: string
          quantity: number
          status: 'valid' | 'expired' | 'expiring'
          signature: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['ppe_deliveries']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['ppe_deliveries']['Insert']>
      }
      accidents: {
        Row: {
          id: number
          date: string
          description: string
          location: string
          severity: string
          employee_id: number
          measures_taken: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['accidents']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['accidents']['Insert']>
      }
      trainings: {
        Row: {
          id: number
          title: string
          description: string
          date: string
          instructor: string
          duration: number
          participants: number[]
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['trainings']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['trainings']['Insert']>
      }
      communications: {
        Row: {
          id: number
          title: string
          content: string
          date: string
          author: string
          recipients: string[]
          type: string
          priority: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['communications']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['communications']['Insert']>
      }
      documents: {
        Row: {
          id: number
          name: string
          type: string
          company: string
          sector: string
          employee?: string
          status: 'valid' | 'expiring' | 'expired'
          expiryDate: string
          uploadDate: string
          fileUrl?: string
          created_at: string
          updated_at?: string
          linkTo: 'company' | 'employee'
        }
        Insert: Omit<Database['public']['Tables']['documents']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['documents']['Insert']>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}