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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      account: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          id: string
          role: Database["public"]["Enums"]["user_roles"]
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          id?: string
          role?: Database["public"]["Enums"]["user_roles"]
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          id?: string
          role?: Database["public"]["Enums"]["user_roles"]
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      onboarding: {
        Row: {
          created_at: string
          description: Json
          id: number
          user_id: string | null
          user_type: string | null
          workspace: string | null
        }
        Insert: {
          created_at?: string
          description: Json
          id?: number
          user_id?: string | null
          user_type?: string | null
          workspace?: string | null
        }
        Update: {
          created_at?: string
          description?: Json
          id?: number
          user_id?: string | null
          user_type?: string | null
          workspace?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "onborad_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "account"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          itemlines_id: string | null
          subscription_customer_id: string | null
          subscription_id: string
          subscription_invoice_id: string
          subscription_status: string | null
          updated_at: string | null
          user_owner_subscription_id: string | null
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id: string
          itemlines_id?: string | null
          subscription_customer_id?: string | null
          subscription_id: string
          subscription_invoice_id: string
          subscription_status?: string | null
          updated_at?: string | null
          user_owner_subscription_id?: string | null
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          itemlines_id?: string | null
          subscription_customer_id?: string | null
          subscription_id?: string
          subscription_invoice_id?: string
          subscription_status?: string | null
          updated_at?: string | null
          user_owner_subscription_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscription_itemlines_id_fkey"
            columns: ["itemlines_id"]
            isOneToOne: false
            referencedRelation: "subscription_lineitems"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscription_user_owner_subscription_id_fkey"
            columns: ["user_owner_subscription_id"]
            isOneToOne: false
            referencedRelation: "account"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_lineitems: {
        Row: {
          created_at: string
          id: string
          line_items_id: string
          price_id: string
          product_id: string
          productname: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          line_items_id: string
          price_id: string
          product_id: string
          productname?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          line_items_id?: string
          price_id?: string
          product_id?: string
          productname?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      subscription_user_role: {
        Row: {
          cus_id: string
          id: string
          Interval: string
          user_owner_id: string
          user_role: Database["public"]["Enums"]["subscription_role"]
        }
        Insert: {
          cus_id?: string
          id?: string
          Interval?: string
          user_owner_id: string
          user_role?: Database["public"]["Enums"]["subscription_role"]
        }
        Update: {
          cus_id?: string
          id?: string
          Interval?: string
          user_owner_id?: string
          user_role?: Database["public"]["Enums"]["subscription_role"]
        }
        Relationships: [
          {
            foreignKeyName: "subscription_user_role_user_owner_id_fkey"
            columns: ["user_owner_id"]
            isOneToOne: false
            referencedRelation: "account"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace: {
        Row: {
          created_at: string
          id: string
          name: string
          user_id: string
          workspace_icon: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          user_id: string
          workspace_icon?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          user_id?: string
          workspace_icon?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workspace_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "account"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_invite: {
        Row: {
          created_at: string
          expired_at: string
          invited_by: string
          updated_at: string | null
          user_owner_id: string
          workspace_owner_id: string
          workspace_status:
            | Database["public"]["Enums"]["workspace_status"]
            | null
        }
        Insert: {
          created_at?: string
          expired_at?: string
          invited_by?: string
          updated_at?: string | null
          user_owner_id?: string
          workspace_owner_id?: string
          workspace_status?:
            | Database["public"]["Enums"]["workspace_status"]
            | null
        }
        Update: {
          created_at?: string
          expired_at?: string
          invited_by?: string
          updated_at?: string | null
          user_owner_id?: string
          workspace_owner_id?: string
          workspace_status?:
            | Database["public"]["Enums"]["workspace_status"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "workspace_invite_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspace_invite_user_owner_id_fkey"
            columns: ["user_owner_id"]
            isOneToOne: false
            referencedRelation: "account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspace_invite_workspace_owner_id_fkey"
            columns: ["workspace_owner_id"]
            isOneToOne: true
            referencedRelation: "workspace"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_member: {
        Row: {
          created_at: string
          invited_by: string | null
          joined_at: string | null
          role: Database["public"]["Enums"]["workspace_role"] | null
          user_id_owner_id: string | null
          workspace_owner_id: string
        }
        Insert: {
          created_at?: string
          invited_by?: string | null
          joined_at?: string | null
          role?: Database["public"]["Enums"]["workspace_role"] | null
          user_id_owner_id?: string | null
          workspace_owner_id: string
        }
        Update: {
          created_at?: string
          invited_by?: string | null
          joined_at?: string | null
          role?: Database["public"]["Enums"]["workspace_role"] | null
          user_id_owner_id?: string | null
          workspace_owner_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_member_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspace_member_user_id_owner_id_fkey"
            columns: ["user_id_owner_id"]
            isOneToOne: false
            referencedRelation: "account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspace_member_workspace_owner_id_fkey"
            columns: ["workspace_owner_id"]
            isOneToOne: true
            referencedRelation: "workspace"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cancel_workspace: {
        Args: { c_user_owner_id: string; c_workspace_owner_id: string }
        Returns: undefined
      }
      create_onboarding_and_workspace: {
        Args: {
          p_description: Json
          p_user_id: string
          p_user_type: string
          p_workspace_name: string
        }
        Returns: undefined
      }
      insert_subscription: {
        Args: {
          l_item_created_at: string
          l_item_id: string
          l_item_price_id: string
          l_item_product_id: string
          l_item_productname: string
          l_item_updated_at: string
          s_created_at: string
          s_cus_id: string
          s_expires_at: string
          s_id: string
          s_inv_id: string
          s_status: string
          s_sub_id: string
          s_updated_at: string
          s_user_id: string
        }
        Returns: undefined
      }
      workspace_approved: {
        Args: {
          w_invited_by: string
          w_joined: string
          w_role: Database["public"]["Enums"]["workspace_role"]
          w_user_owner_id: string
          w_workspace_owner_id: string
          w_workspace_status: Database["public"]["Enums"]["workspace_status"]
        }
        Returns: undefined
      }
    }
    Enums: {
      subscription_role: "Premium" | "Pro"
      user_roles: "admin" | "user" | "guest" | "owner"
      workspace_role: "member" | "admin"
      workspace_status: "pending" | "cancel" | "reject" | "answer"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      subscription_role: ["Premium", "Pro"],
      user_roles: ["admin", "user", "guest", "owner"],
      workspace_role: ["member", "admin"],
      workspace_status: ["pending", "cancel", "reject", "answer"],
    },
  },
} as const
