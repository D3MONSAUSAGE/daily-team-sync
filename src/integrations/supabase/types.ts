export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_access_audit: {
        Row: {
          access_type: string
          accessed_at: string | null
          admin_user_id: string
          id: string
          ip_address: string | null
          organization_id: string
          target_user_id: string
          user_agent: string | null
        }
        Insert: {
          access_type: string
          accessed_at?: string | null
          admin_user_id: string
          id?: string
          ip_address?: string | null
          organization_id: string
          target_user_id: string
          user_agent?: string | null
        }
        Update: {
          access_type?: string
          accessed_at?: string | null
          admin_user_id?: string
          id?: string
          ip_address?: string | null
          organization_id?: string
          target_user_id?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      chat_attachments: {
        Row: {
          created_at: string
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          id: string
          message_id: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          id?: string
          message_id: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_size?: number
          file_type?: string
          file_url?: string
          id?: string
          message_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_attachments_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          deleted_at: string | null
          id: string
          message_type: string
          room_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          message_type?: string
          room_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          message_type?: string
          room_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_participants: {
        Row: {
          id: string
          joined_at: string
          role: string
          room_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          role?: string
          room_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          role?: string
          room_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_participants_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_rooms: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          is_public: boolean
          name: string
          organization_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          is_public?: boolean
          name: string
          organization_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          is_public?: boolean
          name?: string
          organization_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_rooms_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          category: string | null
          content: string
          created_at: string
          id: string
          is_pinned: boolean | null
          metadata: Json | null
          organization_id: string
          project_id: string | null
          task_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string
          id?: string
          is_pinned?: boolean | null
          metadata?: Json | null
          organization_id: string
          project_id?: string | null
          task_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          id?: string
          is_pinned?: boolean | null
          metadata?: Json | null
          organization_id?: string
          project_id?: string | null
          task_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_time_summaries: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          break_count: number | null
          compliance_notes: string | null
          created_at: string | null
          id: string
          is_approved: boolean | null
          organization_id: string
          overtime_minutes: number | null
          session_count: number | null
          total_break_minutes: number | null
          total_work_minutes: number | null
          updated_at: string | null
          user_id: string
          work_date: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          break_count?: number | null
          compliance_notes?: string | null
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          organization_id: string
          overtime_minutes?: number | null
          session_count?: number | null
          total_break_minutes?: number | null
          total_work_minutes?: number | null
          updated_at?: string | null
          user_id: string
          work_date: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          break_count?: number | null
          compliance_notes?: string | null
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          organization_id?: string
          overtime_minutes?: number | null
          session_count?: number | null
          total_break_minutes?: number | null
          total_work_minutes?: number | null
          updated_at?: string | null
          user_id?: string
          work_date?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          created_at: string | null
          description: string | null
          file_path: string
          file_type: string
          folder: string | null
          id: string
          organization_id: string
          size_bytes: number
          storage_id: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          file_path: string
          file_type: string
          folder?: string | null
          id?: string
          organization_id: string
          size_bytes: number
          storage_id: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          file_path?: string
          file_type?: string
          folder?: string | null
          id?: string
          organization_id?: string
          size_bytes?: number
          storage_id?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          description: string | null
          end_date: string
          id: string
          organization_id: string
          start_date: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date: string
          id?: string
          organization_id: string
          start_date: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string
          id?: string
          organization_id?: string
          start_date?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_events_organization"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          branch: string
          created_at: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          invoice_date: string
          invoice_number: string
          organization_id: string
          updated_at: string
          uploader_name: string
          user_id: string
        }
        Insert: {
          branch: string
          created_at?: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          invoice_date: string
          invoice_number: string
          organization_id: string
          updated_at?: string
          uploader_name: string
          user_id: string
        }
        Update: {
          branch?: string
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          invoice_date?: string
          invoice_number?: string
          organization_id?: string
          updated_at?: string
          uploader_name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      journal_entries: {
        Row: {
          content: string
          created_at: string
          id: string
          is_public: boolean
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_public?: boolean
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_public?: boolean
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          content: string | null
          created_at: string
          event_id: string | null
          id: string
          organization_id: string
          read: boolean
          task_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          event_id?: string | null
          id?: string
          organization_id: string
          read?: boolean
          task_id?: string | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          event_id?: string | null
          id?: string
          organization_id?: string
          read?: boolean
          task_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_invites: {
        Row: {
          created_at: string
          created_by: string
          current_uses: number
          expires_at: string
          id: string
          invite_code: string
          invited_role: string | null
          invited_team_id: string | null
          is_active: boolean
          max_uses: number | null
          organization_id: string
        }
        Insert: {
          created_at?: string
          created_by: string
          current_uses?: number
          expires_at?: string
          id?: string
          invite_code: string
          invited_role?: string | null
          invited_team_id?: string | null
          is_active?: boolean
          max_uses?: number | null
          organization_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          current_uses?: number
          expires_at?: string
          id?: string
          invite_code?: string
          invited_role?: string | null
          invited_team_id?: string | null
          is_active?: boolean
          max_uses?: number | null
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_invites_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "organization_user_hierarchy"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_invites_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_invites_invited_team_id_fkey"
            columns: ["invited_team_id"]
            isOneToOne: false
            referencedRelation: "team_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_invites_invited_team_id_fkey"
            columns: ["invited_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_invites_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          created_by: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      project_team_members: {
        Row: {
          created_at: string | null
          id: string
          project_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          project_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          project_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_team_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_team_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "organization_user_hierarchy"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_team_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          budget: number | null
          budget_spent: number | null
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          is_completed: boolean | null
          manager_id: string | null
          organization_id: string
          start_date: string | null
          status: string | null
          tags: string[] | null
          tasks_count: number | null
          team_members: string[] | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          budget?: number | null
          budget_spent?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id: string
          is_completed?: boolean | null
          manager_id?: string | null
          organization_id: string
          start_date?: string | null
          status?: string | null
          tags?: string[] | null
          tasks_count?: number | null
          team_members?: string[] | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          budget?: number | null
          budget_spent?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_completed?: boolean | null
          manager_id?: string | null
          organization_id?: string
          start_date?: string | null
          status?: string | null
          tags?: string[] | null
          tasks_count?: number | null
          team_members?: string[] | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      shared_folders: {
        Row: {
          created_at: string
          folder_name: string
          id: string
          owner_id: string
          shared_with_user_id: string
        }
        Insert: {
          created_at?: string
          folder_name: string
          id?: string
          owner_id: string
          shared_with_user_id: string
        }
        Update: {
          created_at?: string
          folder_name?: string
          id?: string
          owner_id?: string
          shared_with_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shared_folders_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "organization_user_hierarchy"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shared_folders_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shared_folders_shared_with_user_id_fkey"
            columns: ["shared_with_user_id"]
            isOneToOne: false
            referencedRelation: "organization_user_hierarchy"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shared_folders_shared_with_user_id_fkey"
            columns: ["shared_with_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_to_id: string | null
          assigned_to_ids: string[] | null
          assigned_to_names: string[] | null
          completed_at: string | null
          cost: number | null
          created_at: string | null
          deadline: string | null
          description: string | null
          id: string
          organization_id: string
          priority: string | null
          project_id: string | null
          scheduled_end: string | null
          scheduled_start: string | null
          status: string | null
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          assigned_to_id?: string | null
          assigned_to_ids?: string[] | null
          assigned_to_names?: string[] | null
          completed_at?: string | null
          cost?: number | null
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          id: string
          organization_id: string
          priority?: string | null
          project_id?: string | null
          scheduled_end?: string | null
          scheduled_start?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          assigned_to_id?: string | null
          assigned_to_ids?: string[] | null
          assigned_to_names?: string[] | null
          completed_at?: string | null
          cost?: number | null
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          id?: string
          organization_id?: string
          priority?: string | null
          project_id?: string | null
          scheduled_end?: string | null
          scheduled_start?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          created_at: string
          email: string
          id: string
          manager_id: string
          name: string
          organization_id: string
          role: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          manager_id: string
          name: string
          organization_id: string
          role: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          manager_id?: string
          name?: string
          organization_id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      team_memberships: {
        Row: {
          id: string
          joined_at: string
          role: string
          team_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          role?: string
          team_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          role?: string
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_memberships_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_memberships_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_memberships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "organization_user_hierarchy"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_memberships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          manager_id: string | null
          name: string
          organization_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          manager_id?: string | null
          name: string
          organization_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          manager_id?: string | null
          name?: string
          organization_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "organization_user_hierarchy"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teams_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teams_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      time_entries: {
        Row: {
          clock_in: string
          clock_out: string | null
          created_at: string
          duration_minutes: number | null
          id: string
          is_paused: boolean | null
          notes: string | null
          organization_id: string
          paused_at: string | null
          task_id: string | null
          total_paused_duration: unknown | null
          user_id: string
        }
        Insert: {
          clock_in?: string
          clock_out?: string | null
          created_at?: string
          duration_minutes?: number | null
          id?: string
          is_paused?: boolean | null
          notes?: string | null
          organization_id: string
          paused_at?: string | null
          task_id?: string | null
          total_paused_duration?: unknown | null
          user_id: string
        }
        Update: {
          clock_in?: string
          clock_out?: string | null
          created_at?: string
          duration_minutes?: number | null
          id?: string
          is_paused?: boolean | null
          notes?: string | null
          organization_id?: string
          paused_at?: string | null
          task_id?: string | null
          total_paused_duration?: unknown | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "time_entries_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_entries_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      user_deletion_audit: {
        Row: {
          affected_resources: Json
          deleted_by_user_email: string
          deleted_by_user_id: string
          deleted_user_email: string
          deleted_user_id: string
          deleted_user_name: string
          deleted_user_role: string
          deletion_reason: string | null
          deletion_timestamp: string
          id: string
          ip_address: string | null
          user_agent: string | null
        }
        Insert: {
          affected_resources?: Json
          deleted_by_user_email: string
          deleted_by_user_id: string
          deleted_user_email: string
          deleted_user_id: string
          deleted_user_name: string
          deleted_user_role: string
          deletion_reason?: string | null
          deletion_timestamp?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Update: {
          affected_resources?: Json
          deleted_by_user_email?: string
          deleted_by_user_id?: string
          deleted_user_email?: string
          deleted_user_id?: string
          deleted_user_name?: string
          deleted_user_role?: string
          deletion_reason?: string | null
          deletion_timestamp?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      user_management_audit: {
        Row: {
          action_type: string
          created_at: string | null
          id: string
          ip_address: string | null
          metadata: Json | null
          new_values: Json | null
          old_values: Json | null
          organization_id: string
          performed_by_email: string
          performed_by_user_id: string
          target_user_email: string
          target_user_id: string
          target_user_name: string
          user_agent: string | null
        }
        Insert: {
          action_type: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          new_values?: Json | null
          old_values?: Json | null
          organization_id: string
          performed_by_email: string
          performed_by_user_id: string
          target_user_email: string
          target_user_id: string
          target_user_name: string
          user_agent?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          new_values?: Json | null
          old_values?: Json | null
          organization_id?: string
          performed_by_email?: string
          performed_by_user_id?: string
          target_user_email?: string
          target_user_id?: string
          target_user_name?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          daily_email_enabled: boolean | null
          daily_email_time: string | null
          email: string
          id: string
          name: string
          organization_id: string
          push_token: string | null
          role: string
          timezone: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          daily_email_enabled?: boolean | null
          daily_email_time?: string | null
          email: string
          id: string
          name: string
          organization_id: string
          push_token?: string | null
          role: string
          timezone?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          daily_email_enabled?: boolean | null
          daily_email_time?: string | null
          email?: string
          id?: string
          name?: string
          organization_id?: string
          push_token?: string | null
          role?: string
          timezone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      organization_user_hierarchy: {
        Row: {
          assigned_tasks_count: number | null
          completed_tasks_count: number | null
          created_at: string | null
          email: string | null
          id: string | null
          name: string | null
          organization_id: string | null
          organization_name: string | null
          role: string | null
          role_level: number | null
        }
        Relationships: [
          {
            foreignKeyName: "users_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      team_details: {
        Row: {
          created_at: string | null
          description: string | null
          id: string | null
          is_active: boolean | null
          manager_email: string | null
          manager_id: string | null
          manager_name: string | null
          member_count: number | null
          name: string | null
          organization_id: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teams_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "organization_user_hierarchy"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teams_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teams_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      audit_organization_data: {
        Args: Record<PropertyKey, never>
        Returns: {
          table_name: string
          records_without_org: number
          orphaned_records: number
        }[]
      }
      auto_close_stale_sessions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      can_change_user_role: {
        Args: {
          manager_user_id: string
          target_user_id: string
          new_role: string
        }
        Returns: Json
      }
      can_manage_user_role: {
        Args: { manager_role: string; target_role: string }
        Returns: boolean
      }
      can_user_access_project: {
        Args: { project_id_param: string; user_id_param: string }
        Returns: boolean
      }
      can_user_access_room: {
        Args: { room_id_param: string; user_id_param: string }
        Returns: boolean
      }
      can_user_access_task: {
        Args: { task_id_param: string; user_id_param: string }
        Returns: boolean
      }
      create_get_all_projects_function: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      create_get_all_tasks_function: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      create_user_admin: {
        Args: {
          email: string
          password: string
          user_name: string
          user_role: string
        }
        Returns: Json
      }
      debug_auth_status: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      end_of_day_auto_close: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      find_missing_users: {
        Args: Record<PropertyKey, never>
        Returns: {
          auth_user_id: string
          auth_email: string
          auth_created_at: string
          missing_from_public: boolean
        }[]
      }
      generate_invite_code: {
        Args: {
          org_id: string
          created_by_id: string
          expires_days?: number
          max_uses_param?: number
        }
        Returns: string
      }
      generate_invite_code_with_role: {
        Args: {
          org_id: string
          created_by_id: string
          invited_role?: string
          invited_team_id?: string
          expires_days?: number
          max_uses_param?: number
        }
        Returns: string
      }
      generate_invoice_file_path: {
        Args: { org_id: string; user_id: string; filename: string }
        Returns: string
      }
      get_all_projects: {
        Args: Record<PropertyKey, never>
        Returns: {
          budget: number | null
          budget_spent: number | null
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          is_completed: boolean | null
          manager_id: string | null
          organization_id: string
          start_date: string | null
          status: string | null
          tags: string[] | null
          tasks_count: number | null
          team_members: string[] | null
          title: string | null
          updated_at: string | null
        }[]
      }
      get_current_user_organization_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_daily_task_summary: {
        Args: { target_user_id: string; target_date?: string }
        Returns: Json
      }
      get_organization_stats: {
        Args: { org_id: string }
        Returns: Json
      }
      get_project_comment_stats: {
        Args: { project_id_param: string }
        Returns: Json
      }
      get_team_stats: {
        Args: { org_id: string }
        Returns: Json
      }
      get_user_deletion_impact: {
        Args: { target_user_id: string }
        Returns: Json
      }
      get_user_management_impact: {
        Args: { target_user_id: string }
        Returns: Json
      }
      get_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_admin_or_superadmin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_room_participant: {
        Args: { room_id: string; user_id: string }
        Returns: boolean
      }
      is_sole_admin_anywhere: {
        Args: { target_user_id: string }
        Returns: boolean
      }
      is_user_room_admin: {
        Args: { room_id_param: string; user_id_param: string }
        Returns: boolean
      }
      log_data_access: {
        Args:
          | { table_name: string; action_type: string; record_count: number }
          | { table_name: string; operation: string; user_id: string }
        Returns: undefined
      }
      pause_time_entry: {
        Args: { p_user_id: string; p_task_id?: string }
        Returns: Json
      }
      resume_time_entry: {
        Args: { p_user_id: string; p_task_id?: string }
        Returns: Json
      }
      send_daily_emails_and_reminders: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      send_reminders: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      send_timezone_aware_reminders: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      transfer_superadmin_role: {
        Args: {
          current_superadmin_id: string
          new_superadmin_id: string
          organization_id: string
        }
        Returns: Json
      }
      update_daily_summary: {
        Args: { target_user_id: string; target_date: string }
        Returns: undefined
      }
      update_time_entry_clock_out: {
        Args: { p_user_id: string; p_task_id: string }
        Returns: undefined
      }
      user_is_admin_or_superadmin: {
        Args: { user_id: string }
        Returns: boolean
      }
      user_is_project_creator: {
        Args: { project_id: string; user_id: string }
        Returns: boolean
      }
      user_is_project_member: {
        Args: { project_id: string; user_id: string }
        Returns: boolean
      }
      user_is_project_team_member: {
        Args: { project_id_val: string; user_id_val: string }
        Returns: boolean
      }
      validate_and_use_invite_code: {
        Args: { code: string }
        Returns: Json
      }
      validate_assigned_to_ids: {
        Args: { ids: string[] }
        Returns: boolean
      }
      validate_invite_code_without_consuming: {
        Args: { code: string }
        Returns: Json
      }
      would_leave_org_without_superadmin: {
        Args: { target_user_id: string; target_org_id: string }
        Returns: boolean
      }
    }
    Enums: {
      message_type: "text" | "system"
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
      message_type: ["text", "system"],
    },
  },
} as const
