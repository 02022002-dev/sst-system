export type UserRole = 'admin' | 'tecnico' | 'leitura'

export type InspectionStatus = 'aberta' | 'concluida'
export type InspectionRiskLevel = 'baixo' | 'medio' | 'alto'
export type PendenciaStatus = 'pendente' | 'em_andamento' | 'resolvida'
export type PendenciaOrigin = 'manual' | 'inspecao'

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
      companies: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          company_id: string
          full_name: string | null
          role: UserRole
          created_at: string
        }
        Insert: {
          id: string
          company_id: string
          full_name?: string | null
          role?: UserRole
          created_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          full_name?: string | null
          role?: UserRole
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'profiles_company_id_fkey'
            columns: ['company_id']
            isOneToOne: false
            referencedRelation: 'companies'
            referencedColumns: ['id']
          },
        ]
      }
      inspections: {
        Row: {
          id: string
          company_id: string
          title: string
          description: string | null
          responsible: string
          status: InspectionStatus
          risk_level: InspectionRiskLevel
          archived_at: string | null
          scheduled_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          title: string
          description?: string | null
          responsible: string
          status?: InspectionStatus
          risk_level?: InspectionRiskLevel
          archived_at?: string | null
          scheduled_at: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          title?: string
          description?: string | null
          responsible?: string
          status?: InspectionStatus
          risk_level?: InspectionRiskLevel
          archived_at?: string | null
          scheduled_at?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'inspections_company_id_fkey'
            columns: ['company_id']
            isOneToOne: false
            referencedRelation: 'companies'
            referencedColumns: ['id']
          },
        ]
      }
      inspection_photos: {
        Row: {
          id: string
          inspection_id: string
          company_id: string
          storage_path: string
          created_at: string
        }
        Insert: {
          id?: string
          inspection_id: string
          company_id: string
          storage_path: string
          created_at?: string
        }
        Update: {
          id?: string
          inspection_id?: string
          company_id?: string
          storage_path?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'inspection_photos_company_id_fkey'
            columns: ['company_id']
            isOneToOne: false
            referencedRelation: 'companies'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'inspection_photos_inspection_id_fkey'
            columns: ['inspection_id']
            isOneToOne: false
            referencedRelation: 'inspections'
            referencedColumns: ['id']
          },
        ]
      }
      pendencias: {
        Row: {
          id: string
          company_id: string
          inspection_id: string | null
          problem_description: string
          sector: string
          risk_level: InspectionRiskLevel
          responsible: string
          due_date: string
          status: PendenciaStatus
          origin: PendenciaOrigin
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          inspection_id?: string | null
          problem_description: string
          sector: string
          risk_level?: InspectionRiskLevel
          responsible: string
          due_date: string
          status?: PendenciaStatus
          origin?: PendenciaOrigin
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          inspection_id?: string | null
          problem_description?: string
          sector?: string
          risk_level?: InspectionRiskLevel
          responsible?: string
          due_date?: string
          status?: PendenciaStatus
          origin?: PendenciaOrigin
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'pendencias_company_id_fkey'
            columns: ['company_id']
            isOneToOne: false
            referencedRelation: 'companies'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'pendencias_inspection_id_fkey'
            columns: ['inspection_id']
            isOneToOne: false
            referencedRelation: 'inspections'
            referencedColumns: ['id']
          },
        ]
      }
      trainings: {
        Row: {
          id: string
          company_id: string
          employee_name: string
          required_course_name: string
          completion_date: string
          expiration_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          employee_name: string
          required_course_name: string
          completion_date: string
          expiration_date: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          employee_name?: string
          required_course_name?: string
          completion_date?: string
          expiration_date?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'trainings_company_id_fkey'
            columns: ['company_id']
            isOneToOne: false
            referencedRelation: 'companies'
            referencedColumns: ['id']
          },
        ]
      }
      epis: {
        Row: {
          id: string
          company_id: string
          employee_name: string
          epi_type: string
          ca: string
          delivered_at: string
          expires_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          employee_name: string
          epi_type: string
          ca: string
          delivered_at: string
          expires_at: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          employee_name?: string
          epi_type?: string
          ca?: string
          delivered_at?: string
          expires_at?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'epis_company_id_fkey'
            columns: ['company_id']
            isOneToOne: false
            referencedRelation: 'companies'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}