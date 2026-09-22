export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      clinics: {
        Row: {
          address: string | null
          created_at: string | null
          id: string
          is_affordable: boolean | null
          location_lat: number | null
          location_lng: number | null
          name: string
          phone: string | null
          specialty_types: string[] | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          id?: string
          is_affordable?: boolean | null
          location_lat?: number | null
          location_lng?: number | null
          name: string
          phone?: string | null
          specialty_types?: string[] | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          id?: string
          is_affordable?: boolean | null
          location_lat?: number | null
          location_lng?: number | null
          name?: string
          phone?: string | null
          specialty_types?: string[] | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          location_lat: number | null
          location_lng: number | null
          phone: string | null
          preferred_language: string | null
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id: string
          location_lat?: number | null
          location_lng?: number | null
          phone?: string | null
          preferred_language?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          location_lat?: number | null
          location_lng?: number | null
          phone?: string | null
          preferred_language?: string | null
        }
        Relationships: []
      }
      symptom_checks: {
        Row: {
          ai_reasoning: string | null
          created_at: string | null
          detected_symptoms: Json | null
          duration: string | null
          id: string
          language: string
          recommended_specialist: string | null
          red_flag_triggered: boolean | null
          transcript: string
          urgency_level: string
          user_id: string | null
        }
        Insert: {
          ai_reasoning?: string | null
          created_at?: string | null
          detected_symptoms?: Json | null
          duration?: string | null
          id?: string
          language: string
          recommended_specialist?: string | null
          red_flag_triggered?: boolean | null
          transcript: string
          urgency_level: string
          user_id?: string | null
        }
        Update: {
          ai_reasoning?: string | null
          created_at?: string | null
          detected_symptoms?: Json | null
          duration?: string | null
          id?: string
          language?: string
          recommended_specialist?: string | null
          red_flag_triggered?: boolean | null
          transcript?: string
          urgency_level?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "symptom_checks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
