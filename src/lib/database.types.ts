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
      }
      profiles: {
        Row: {
          id: string
          email: string | null
          phone: string | null
          full_name: string
          role: string
          zone: string | null
          avatar_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
          zone_id: string | null
        }
        Insert: {
          id: string
          email?: string | null
          phone?: string | null
          full_name?: string
          role?: string
          zone?: string | null
          avatar_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
          zone_id?: string | null
        }
        Update: {
          id?: string
          email?: string | null
          phone?: string | null
          full_name?: string
          role?: string
          zone?: string | null
          avatar_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
          zone_id?: string | null
        }
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
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          recipient_id: string | null
          subject: string
          body: string
          is_read: boolean
          message_type: string
          priority: string
          created_at: string
        }
        Insert: {
          id?: string
          sender_id: string
          recipient_id?: string | null
          subject?: string
          body?: string
          is_read?: boolean
          message_type?: string
          priority?: string
          created_at?: string
        }
        Update: {
          id?: string
          sender_id?: string
          recipient_id?: string | null
          subject?: string
          body?: string
          is_read?: boolean
          message_type?: string
          priority?: string
          created_at?: string
        }
      }
      announcements: {
        Row: {
          id: string
          author_id: string
          title: string
          body: string
          target_role: string
          is_pinned: boolean
          created_at: string
        }
        Insert: {
          id?: string
          author_id: string
          title?: string
          body?: string
          target_role?: string
          is_pinned?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          author_id?: string
          title?: string
          body?: string
          target_role?: string
          is_pinned?: boolean
          created_at?: string
        }
      }
    }
  }
}
