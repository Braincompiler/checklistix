export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      checklist_items: {
        Row: {
          checklist_id: string
          color: string | null
          column: number
          id: string
          page: number
          position: number
          text: string | null
          title: string | null
          type: string
        }
        Insert: {
          checklist_id: string
          color?: string | null
          column: number
          id?: string
          page: number
          position: number
          text?: string | null
          title?: string | null
          type: string
        }
        Update: {
          checklist_id?: string
          color?: string | null
          column?: number
          id?: string
          page?: number
          position?: number
          text?: string | null
          title?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "ChecklistItems_checklistId_fkey"
            columns: ["checklist_id"]
            isOneToOne: false
            referencedRelation: "checklists"
            referencedColumns: ["id"]
          },
        ]
      }
      checklists: {
        Row: {
          border_thickness: number
          columns: number
          created: string
          default_color: string
          font_family: string
          font_size: number
          id: string
          page_orientation: string
          page_size: string
          style: string
          title: string
          updated: string | null
        }
        Insert: {
          border_thickness?: number
          columns?: number
          created?: string
          default_color?: string
          font_family?: string
          font_size?: number
          id?: string
          page_orientation?: string
          page_size?: string
          style?: string
          title?: string
          updated?: string | null
        }
        Update: {
          border_thickness?: number
          columns?: number
          created?: string
          default_color?: string
          font_family?: string
          font_size?: number
          id?: string
          page_orientation?: string
          page_size?: string
          style?: string
          title?: string
          updated?: string | null
        }
        Relationships: []
      }
      sub_checklist_items: {
        Row: {
          action: string | null
          id: string
          item: string | null
          sub_checklist_id: string
          text: string | null
          type: string
        }
        Insert: {
          action?: string | null
          id?: string
          item?: string | null
          sub_checklist_id: string
          text?: string | null
          type: string
        }
        Update: {
          action?: string | null
          id?: string
          item?: string | null
          sub_checklist_id?: string
          text?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "SubChecklistItems_subChecklistId_fkey"
            columns: ["sub_checklist_id"]
            isOneToOne: false
            referencedRelation: "checklist_items"
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
