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
      cv_file: {
        Row: {
          filename: string
          id: number
          inserted_at: string
          profile_id: number
        }
        Insert: {
          filename: string
          id?: number
          inserted_at?: string
          profile_id: number
        }
        Update: {
          filename?: string
          id?: number
          inserted_at?: string
          profile_id?: number
        }
        Relationships: []
      }
      cv_profile: {
        Row: {
          id: number
          inserted_at: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: number
          inserted_at?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: number
          inserted_at?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      education: {
        Row: {
          degree: string
          end_date: string
          id: number
          inserted_at: string
          institution: string
          profile_id: number
          start_date: string
          subject: string
          updated_at: string
        }
        Insert: {
          degree: string
          end_date: string
          id?: number
          inserted_at?: string
          institution: string
          profile_id: number
          start_date: string
          subject: string
          updated_at?: string
        }
        Update: {
          degree?: string
          end_date?: string
          id?: number
          inserted_at?: string
          institution?: string
          profile_id?: number
          start_date?: string
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_education_profile_id"
            columns: ["profile_id"]
            referencedRelation: "cv_profile"
            referencedColumns: ["id"]
          }
        ]
      }
      experience: {
        Row: {
          achievements: string
          company: string
          end_date: string | null
          id: number
          inserted_at: string
          is_current: boolean
          profile_id: number
          sector: string
          start_date: string
          title: string
          updated_at: string
        }
        Insert: {
          achievements: string
          company: string
          end_date?: string | null
          id?: number
          inserted_at?: string
          is_current: boolean
          profile_id: number
          sector: string
          start_date: string
          title: string
          updated_at?: string
        }
        Update: {
          achievements?: string
          company?: string
          end_date?: string | null
          id?: number
          inserted_at?: string
          is_current?: boolean
          profile_id?: number
          sector?: string
          start_date?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_experience_profile_id"
            columns: ["profile_id"]
            referencedRelation: "cv_profile"
            referencedColumns: ["id"]
          }
        ]
      }
      job_posting: {
        Row: {
          add_on: string | null
          company: string
          id: number
          inserted_at: string
          profile_id: number
          requirements: string
          sector: string
          title: string
          updated_at: string
        }
        Insert: {
          add_on?: string | null
          company: string
          id?: number
          inserted_at?: string
          profile_id: number
          requirements: string
          sector: string
          title: string
          updated_at?: string
        }
        Update: {
          add_on?: string | null
          company?: string
          id?: number
          inserted_at?: string
          profile_id?: number
          requirements?: string
          sector?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_job_posting_profile_id"
            columns: ["profile_id"]
            referencedRelation: "cv_profile"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      skillset: {
        Row: {
          id: number
          inserted_at: string
          profile_id: number
          skillsets: string
          updated_at: string
        }
        Insert: {
          id?: number
          inserted_at?: string
          profile_id: number
          skillsets: string
          updated_at?: string
        }
        Update: {
          id?: number
          inserted_at?: string
          profile_id?: number
          skillsets?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_skillset_profile_id"
            columns: ["profile_id"]
            referencedRelation: "cv_profile"
            referencedColumns: ["id"]
          }
        ]
      }
      user_bio: {
        Row: {
          address: string
          email: string
          first_name: string
          id: number
          inserted_at: string
          last_name: string
          phone: string
          profile_id: number
          updated_at: string
        }
        Insert: {
          address: string
          email: string
          first_name: string
          id?: number
          inserted_at?: string
          last_name: string
          phone: string
          profile_id: number
          updated_at?: string
        }
        Update: {
          address?: string
          email?: string
          first_name?: string
          id?: number
          inserted_at?: string
          last_name?: string
          phone?: string
          profile_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_bio_profile"
            columns: ["profile_id"]
            referencedRelation: "cv_profile"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_bio_posting: {
        Args: {
          user_id_input: string
          profile_id_input: number
        }
        Returns: {
          user_first_name: string
          user_last_name: string
          user_email: string
          user_phone: string
          user_address: string
          job_title: string
          job_company: string
          job_sector: string
          job_requirements: string
          job_add_on: string
        }[]
      }
      get_education: {
        Args: {
          user_id_input: string
          profile_id_input: number
        }
        Returns: {
          ed_subject: string
          ed_institution: string
          ed_degree: string
          ed_start_date: string
          ed_end_date: string
        }[]
      }
      get_experience: {
        Args: {
          user_id_input: string
          profile_id_input: number
        }
        Returns: {
          exp_title: string
          exp_company: string
          exp_sector: string
          exp_is_current: boolean
          exp_start_date: string
          exp_end_date: string
          exp_achievements: string
        }[]
      }
      get_file_list_of_user: {
        Args: {
          user_id_input: string
        }
        Returns: {
          filename: string
          job_title: string
          job_company: string
        }[]
      }
      get_profiles_of_user_time_name: {
        Args: {
          user_id_input: string
        }
        Returns: {
          profile_id: number
          profile_name: string
          job_title: string
          job_company: string
          inserted_at: string
        }[]
      }
      get_skillset: {
        Args: {
          user_id_input: string
          profile_id_input: number
        }
        Returns: {
          skillset: string
        }[]
      }
      insert_cv_file_of_profile: {
        Args: {
          user_id_input: string
          filename_input: string
        }
        Returns: undefined
      }
      insert_education_of_profile: {
        Args: {
          user_id_input: string
          ed_subject: string
          ed_institution: string
          ed_degree: string
          ed_start_date: string
          ed_end_date: string
        }
        Returns: undefined
      }
      insert_experience_of_profile: {
        Args: {
          user_id_input: string
          exp_title: string
          exp_company: string
          exp_sector: string
          exp_is_current: boolean
          exp_start_date: string
          exp_achievements: string
          exp_end_date?: string
        }
        Returns: undefined
      }
      insert_new_user_profile_job_posting: {
        Args: {
          profile_user_id: string
          user_first_name: string
          user_last_name: string
          user_email: string
          user_phone: string
          user_address: string
          job_title: string
          job_company: string
          job_sector: string
          job_requirements: string
          job_add_on?: string
        }
        Returns: undefined
      }
      insert_skillsets_of_profile: {
        Args: {
          user_id_input: string
          skillsets_input: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
