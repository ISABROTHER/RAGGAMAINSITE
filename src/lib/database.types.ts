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
      }
    }
  }
}
