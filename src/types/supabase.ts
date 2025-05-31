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
      resources: {
        Row: {
          id: string
          subject_id: string
          name: string
          file_path: string
          url: string
          type: string
          created_at: string
        }
        Insert: {
          id?: string
          subject_id: string
          name: string
          file_path: string
          url: string
          type: string
          created_at?: string
        }
      }
      textbook_content: {
        Row: {
          id: string
          subject: string
          chapter: string
          content: string
          board: 'NCERT' | 'Maharashtra'
          created_at: string
        }
        Insert: {
          id?: string
          subject: string
          chapter: string
          content: string
          board: 'NCERT' | 'Maharashtra'
          created_at?: string
        }
      }
      worksheets: {
        Row: {
          id: string
          title: string
          subject: string
          description: string
          questions: Json
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          subject: string
          description: string
          questions: Json
          created_at?: string
        }
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