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
      policies: {
        Row: {
          id: string
          title: string
          category: string
          description: string
          icon: string
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          category: string
          description: string
          icon?: string
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          category?: string
          description?: string
          icon?: string
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          id: string
          title: string
          description: string
          location: string
          event_date: string
          image_url: string | null
          rsvp_enabled: boolean
          max_attendees: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          location: string
          event_date: string
          image_url?: string | null
          rsvp_enabled?: boolean
          max_attendees?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          location?: string
          event_date?: string
          image_url?: string | null
          rsvp_enabled?: boolean
          max_attendees?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          id: string
          title: string
          slug: string
          excerpt: string
          content: string
          image_url: string | null
          category: string
          published: boolean
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          excerpt: string
          content: string
          image_url?: string | null
          category?: string
          published?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          excerpt?: string
          content?: string
          image_url?: string | null
          category?: string
          published?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      event_rsvps: {
        Row: {
          id: string
          event_id: string
          name: string
          email: string
          phone: string | null
          guests: number
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          name: string
          email: string
          phone?: string | null
          guests?: number
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          name?: string
          email?: string
          phone?: string | null
          guests?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'event_rsvps_event_id_fkey'
            columns: ['event_id']
            referencedRelation: 'events'
            referencedColumns: ['id']
          }
        ]
      }
      newsletter_signups: {
        Row: {
          id: string
          email: string
          name: string
          subscribed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          subscribed?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          subscribed?: boolean
          created_at?: string
        }
        Relationships: []
      }
      volunteer_signups: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          interests: string | null
          availability: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          interests?: string | null
          availability?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          interests?: string | null
          availability?: string | null
          created_at?: string
        }
        Relationships: []
      }
      issues: {
        Row: {
          id: number
          category: string
          subcategory: string | null
          description: string
          location: string | null
          priority: string
          photo_url: string | null
          name: string | null
          phone: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: never
          category: string
          subcategory?: string | null
          description: string
          location?: string | null
          priority?: string
          photo_url?: string | null
          name?: string | null
          phone?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          category?: string
          subcategory?: string | null
          description?: string
          location?: string | null
          priority?: string
          photo_url?: string | null
          name?: string | null
          phone?: string | null
          status?: string
          created_at?: string
        }
        Relationships: []
      }
      poll_votes: {
        Row: {
          id: string
          session_id: string
          poll_id: string
          allocations: Json
          total_credits_used: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          session_id: string
          poll_id?: string
          allocations: Json
          total_credits_used?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          poll_id?: string
          allocations?: Json
          total_credits_used?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          id: string
          name: string
          email: string
          subject: string
          message: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          subject: string
          message: string
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          subject?: string
          message?: string
          read?: boolean
          created_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          id: string
          title: string
          slug: string
          description: string
          category: string
          image_url: string | null
          target_units: number
          unit_label: string
          unit_price_ghs: number
          is_active: boolean
          is_featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description?: string
          category?: string
          image_url?: string | null
          target_units?: number
          unit_label?: string
          unit_price_ghs?: number
          is_active?: boolean
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string
          category?: string
          image_url?: string | null
          target_units?: number
          unit_label?: string
          unit_price_ghs?: number
          is_active?: boolean
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      contributions: {
        Row: {
          id: string
          project_id: string
          donor_first_name: string
          donor_last_name: string
          donor_contact: string
          amount_ghs: number
          units_contributed: number
          payment_reference: string
          payment_method: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          donor_first_name: string
          donor_last_name: string
          donor_contact: string
          amount_ghs?: number
          units_contributed?: number
          payment_reference: string
          payment_method?: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          donor_first_name?: string
          donor_last_name?: string
          donor_contact?: string
          amount_ghs?: number
          units_contributed?: number
          payment_reference?: string
          payment_method?: string
          status?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'contributions_project_id_fkey'
            columns: ['project_id']
            referencedRelation: 'projects'
            referencedColumns: ['id']
          }
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
