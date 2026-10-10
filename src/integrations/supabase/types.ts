export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      faqs: {
        Row: {
          answer: string
          created_at: string
          id: string
          is_active: boolean
          question: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          answer?: string
          created_at?: string
          id?: string
          is_active?: boolean
          question: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          answer?: string
          created_at?: string
          id?: string
          is_active?: boolean
          question?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          created_at: string
          email: string
          id: string
          is_read: boolean
          message: string
          name: string
          phone: string
        }
        Insert: {
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean
          message: string
          name: string
          phone?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean
          message?: string
          name?: string
          phone?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          address: string
          city: string
          created_at: string
          customer_name: string
          delivery: number
          id: string
          items: Json
          notes: string
          order_no: number
          payment_method: string
          phone: string
          postal: string
          province: string
          status: string
          subtotal: number
          total: number
          updated_at: string
        }
        Insert: {
          address: string
          city: string
          created_at?: string
          customer_name: string
          delivery?: number
          id?: string
          items?: Json
          notes?: string
          order_no?: number
          payment_method?: string
          phone: string
          postal?: string
          province?: string
          status?: string
          subtotal?: number
          total?: number
          updated_at?: string
        }
        Update: {
          address?: string
          city?: string
          created_at?: string
          customer_name?: string
          delivery?: number
          id?: string
          items?: Json
          notes?: string
          order_no?: number
          payment_method?: string
          phone?: string
          postal?: string
          province?: string
          status?: string
          subtotal?: number
          total?: number
          updated_at?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          author: string
          canonical_url: string
          category: string
          content: string
          cover_image_url: string
          created_at: string
          excerpt: string
          featured: boolean
          id: string
          image_alt: string
          publish_date: string
          reading_minutes: number
          seo_description: string
          seo_title: string
          slug: string
          status: string
          tagline: string
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          author?: string
          canonical_url?: string
          category?: string
          content?: string
          cover_image_url?: string
          created_at?: string
          excerpt?: string
          featured?: boolean
          id?: string
          image_alt?: string
          publish_date?: string
          reading_minutes?: number
          seo_description?: string
          seo_title?: string
          slug: string
          status?: string
          tagline?: string
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          canonical_url?: string
          category?: string
          content?: string
          cover_image_url?: string
          created_at?: string
          excerpt?: string
          featured?: boolean
          id?: string
          image_alt?: string
          publish_date?: string
          reading_minutes?: number
          seo_description?: string
          seo_title?: string
          slug?: string
          status?: string
          tagline?: string
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          availability: string
          category: string
          created_at: string
          description: string
          discount: number
          hover_image_url: string
          hover_key: string
          id: string
          image_key: string
          image_url: string
          is_active: boolean
          name: string
          price: number
          sort_order: number
          tagline: string
          updated_at: string
        }
        Insert: {
          availability?: string
          category?: string
          created_at?: string
          description?: string
          discount?: number
          hover_image_url?: string
          hover_key?: string
          id?: string
          image_key?: string
          image_url?: string
          is_active?: boolean
          name: string
          price?: number
          sort_order?: number
          tagline?: string
          updated_at?: string
        }
        Update: {
          availability?: string
          category?: string
          created_at?: string
          description?: string
          discount?: number
          hover_image_url?: string
          hover_key?: string
          id?: string
          image_key?: string
          image_url?: string
          is_active?: boolean
          name?: string
          price?: number
          sort_order?: number
          tagline?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_admin: { Args: never; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
