
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  
  "graphql_public": {
          Tables: {
            [_ in never]: never
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "graphql":
{ Args: { "extensions"?: Json,"operationName"?: string,"query"?: string,"variables"?: Json }; Returns: Json
                           }
          }
          Enums: {
            [_ in never]: never
          }
          CompositeTypes: {
            [_ in never]: never
          }
        },"public": {
          Tables: {
            "academic_years": {
                  Row: {
                    "created_at": string,"end_date": string,"id": string,"is_current": boolean,"name": string,"school_id": string,"start_date": string,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"end_date": string,"id"?: string,"is_current"?: boolean,"name": string,"school_id": string,"start_date": string,"updated_at"?: string
                  }
                  Update: {
                    "created_at"?: string,"end_date"?: string,"id"?: string,"is_current"?: boolean,"name"?: string,"school_id"?: string,"start_date"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "academic_years_school_id_fkey"
      columns: ["school_id"]
isOneToOne: false
      referencedRelation: "schools"
      referencedColumns: ["id"]
    }
                  ]
                },"ai_generation_jobs": {
                  Row: {
                    "assessment_id": string | null,"created_at": string,"created_by": string,"error": string | null,"id": string,"model": string | null,"provider": string,"question_ids": (string)[],"request": NonNullable<Json>,"status": string,"warnings": NonNullable<Json>
                  }
                  ComputedFields: never
                  Insert: {
                    "assessment_id"?: string | null,"created_at"?: string,"created_by": string,"error"?: string | null,"id"?: string,"model"?: string | null,"provider": string,"question_ids"?: (string)[],"request": NonNullable<Json>,"status": string,"warnings"?: NonNullable<Json>
                  }
                  Update: {
                    "assessment_id"?: string | null,"created_at"?: string,"created_by"?: string,"error"?: string | null,"id"?: string,"model"?: string | null,"provider"?: string,"question_ids"?: (string)[],"request"?: NonNullable<Json>,"status"?: string,"warnings"?: NonNullable<Json>
                  }
                  Relationships: [
                    {
      foreignKeyName: "ai_generation_jobs_assessment_id_fkey"
      columns: ["assessment_id"]
isOneToOne: false
      referencedRelation: "assessments"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "ai_generation_jobs_created_by_fkey"
      columns: ["created_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"assessment_assignments": {
                  Row: {
                    "assessment_id": string,"assigned_by": string,"class_id": string,"code": string,"created_at": string,"due_at": string,"id": string,"is_closed": boolean,"max_attempts": number,"show_answers": Database["public"]['Enums']["answer_visibility"],"show_leaderboard": boolean,"start_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "assessment_id": string,"assigned_by": string,"class_id": string,"code"?: string,"created_at"?: string,"due_at": string,"id"?: string,"is_closed"?: boolean,"max_attempts"?: number,"show_answers"?: Database["public"]['Enums']["answer_visibility"],"show_leaderboard"?: boolean,"start_at"?: string
                  }
                  Update: {
                    "assessment_id"?: string,"assigned_by"?: string,"class_id"?: string,"code"?: string,"created_at"?: string,"due_at"?: string,"id"?: string,"is_closed"?: boolean,"max_attempts"?: number,"show_answers"?: Database["public"]['Enums']["answer_visibility"],"show_leaderboard"?: boolean,"start_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "assessment_assignments_assessment_id_fkey"
      columns: ["assessment_id"]
isOneToOne: false
      referencedRelation: "assessments"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "assessment_assignments_assigned_by_fkey"
      columns: ["assigned_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "assessment_assignments_class_id_fkey"
      columns: ["class_id"]
isOneToOne: false
      referencedRelation: "classes"
      referencedColumns: ["id"]
    }
                  ]
                },"assessment_attempts": {
                  Row: {
                    "answers": NonNullable<Json>,"assignment_id": string,"attempt_no": number,"correct_units": number | null,"deadline_at": string,"details": NonNullable<Json>,"earned_points": number | null,"id": string,"max_points": number | null,"needs_grading": boolean,"score": number | null,"started_at": string,"status": Database["public"]['Enums']["attempt_status"],"submitted_at": string | null,"total_units": number | null,"updated_at": string,"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "answers"?: NonNullable<Json>,"assignment_id": string,"attempt_no"?: number,"correct_units"?: number | null,"deadline_at": string,"details"?: NonNullable<Json>,"earned_points"?: number | null,"id"?: string,"max_points"?: number | null,"needs_grading"?: boolean,"score"?: number | null,"started_at"?: string,"status"?: Database["public"]['Enums']["attempt_status"],"submitted_at"?: string | null,"total_units"?: number | null,"updated_at"?: string,"user_id": string
                  }
                  Update: {
                    "answers"?: NonNullable<Json>,"assignment_id"?: string,"attempt_no"?: number,"correct_units"?: number | null,"deadline_at"?: string,"details"?: NonNullable<Json>,"earned_points"?: number | null,"id"?: string,"max_points"?: number | null,"needs_grading"?: boolean,"score"?: number | null,"started_at"?: string,"status"?: Database["public"]['Enums']["attempt_status"],"submitted_at"?: string | null,"total_units"?: number | null,"updated_at"?: string,"user_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "assessment_attempts_assignment_id_fkey"
      columns: ["assignment_id"]
isOneToOne: false
      referencedRelation: "assessment_assignments"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "assessment_attempts_user_id_fkey"
      columns: ["user_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"assessment_questions": {
                  Row: {
                    "assessment_id": string,"points": number,"question_id": string,"sort_order": number
                  }
                  ComputedFields: never
                  Insert: {
                    "assessment_id": string,"points"?: number,"question_id": string,"sort_order"?: number
                  }
                  Update: {
                    "assessment_id"?: string,"points"?: number,"question_id"?: string,"sort_order"?: number
                  }
                  Relationships: [
                    {
      foreignKeyName: "assessment_questions_assessment_id_fkey"
      columns: ["assessment_id"]
isOneToOne: false
      referencedRelation: "assessments"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "assessment_questions_question_id_fkey"
      columns: ["question_id"]
isOneToOne: false
      referencedRelation: "question_bank"
      referencedColumns: ["id"]
    }
                  ]
                },"assessments": {
                  Row: {
                    "created_at": string,"created_by": string,"description": string | null,"duration_minutes": number,"id": string,"lesson_ids": (string)[],"source": Database["public"]['Enums']["assessment_source"],"status": Database["public"]['Enums']["assessment_status"],"structure": NonNullable<Json>,"title": string,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"created_by": string,"description"?: string | null,"duration_minutes"?: number,"id"?: string,"lesson_ids"?: (string)[],"source"?: Database["public"]['Enums']["assessment_source"],"status"?: Database["public"]['Enums']["assessment_status"],"structure"?: NonNullable<Json>,"title": string,"updated_at"?: string
                  }
                  Update: {
                    "created_at"?: string,"created_by"?: string,"description"?: string | null,"duration_minutes"?: number,"id"?: string,"lesson_ids"?: (string)[],"source"?: Database["public"]['Enums']["assessment_source"],"status"?: Database["public"]['Enums']["assessment_status"],"structure"?: NonNullable<Json>,"title"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "assessments_created_by_fkey"
      columns: ["created_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"audit_logs": {
                  Row: {
                    "action": string,"actor_id": string | null,"created_at": string,"entity": string,"entity_id": string | null,"id": number,"metadata": NonNullable<Json>
                  }
                  ComputedFields: never
                  Insert: {
                    "action": string,"actor_id"?: string | null,"created_at"?: string,"entity": string,"entity_id"?: string | null,"id"?: never,"metadata"?: NonNullable<Json>
                  }
                  Update: {
                    "action"?: string,"actor_id"?: string | null,"created_at"?: string,"entity"?: string,"entity_id"?: string | null,"id"?: never,"metadata"?: NonNullable<Json>
                  }
                  Relationships: [
                    {
      foreignKeyName: "audit_logs_actor_id_fkey"
      columns: ["actor_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"chapters": {
                  Row: {
                    "created_at": string,"description": string | null,"id": string,"number": number,"roman": string,"sort_order": number,"textbook_id": string,"title": string,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"description"?: string | null,"id"?: string,"number": number,"roman": string,"sort_order": number,"textbook_id": string,"title": string,"updated_at"?: string
                  }
                  Update: {
                    "created_at"?: string,"description"?: string | null,"id"?: string,"number"?: number,"roman"?: string,"sort_order"?: number,"textbook_id"?: string,"title"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "chapters_textbook_id_fkey"
      columns: ["textbook_id"]
isOneToOne: false
      referencedRelation: "textbooks"
      referencedColumns: ["id"]
    }
                  ]
                },"class_members": {
                  Row: {
                    "class_id": string,"joined_at": string,"member_role": Database["public"]['Enums']["class_member_role"],"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "class_id": string,"joined_at"?: string,"member_role": Database["public"]['Enums']["class_member_role"],"user_id": string
                  }
                  Update: {
                    "class_id"?: string,"joined_at"?: string,"member_role"?: Database["public"]['Enums']["class_member_role"],"user_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "class_members_class_id_fkey"
      columns: ["class_id"]
isOneToOne: false
      referencedRelation: "classes"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "class_members_user_id_fkey"
      columns: ["user_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"classes": {
                  Row: {
                    "academic_year_id": string,"allow_self_join": boolean,"created_at": string,"created_by": string | null,"grade": number,"id": string,"is_active": boolean,"join_code": string,"name": string,"school_id": string,"show_leaderboard": boolean,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "academic_year_id": string,"allow_self_join"?: boolean,"created_at"?: string,"created_by"?: string | null,"grade"?: number,"id"?: string,"is_active"?: boolean,"join_code"?: string,"name": string,"school_id": string,"show_leaderboard"?: boolean,"updated_at"?: string
                  }
                  Update: {
                    "academic_year_id"?: string,"allow_self_join"?: boolean,"created_at"?: string,"created_by"?: string | null,"grade"?: number,"id"?: string,"is_active"?: boolean,"join_code"?: string,"name"?: string,"school_id"?: string,"show_leaderboard"?: boolean,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "classes_academic_year_id_fkey"
      columns: ["academic_year_id"]
isOneToOne: false
      referencedRelation: "academic_years"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "classes_created_by_fkey"
      columns: ["created_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "classes_school_id_fkey"
      columns: ["school_id"]
isOneToOne: false
      referencedRelation: "schools"
      referencedColumns: ["id"]
    }
                  ]
                },"essay_grades": {
                  Row: {
                    "ai_suggested_score": number | null,"attempt_id": string,"feedback": string | null,"graded_at": string,"graded_by": string,"question_id": string,"score": number
                  }
                  ComputedFields: never
                  Insert: {
                    "ai_suggested_score"?: number | null,"attempt_id": string,"feedback"?: string | null,"graded_at"?: string,"graded_by": string,"question_id": string,"score": number
                  }
                  Update: {
                    "ai_suggested_score"?: number | null,"attempt_id"?: string,"feedback"?: string | null,"graded_at"?: string,"graded_by"?: string,"question_id"?: string,"score"?: number
                  }
                  Relationships: [
                    {
      foreignKeyName: "essay_grades_attempt_id_fkey"
      columns: ["attempt_id"]
isOneToOne: false
      referencedRelation: "assessment_attempts"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "essay_grades_graded_by_fkey"
      columns: ["graded_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "essay_grades_question_id_fkey"
      columns: ["question_id"]
isOneToOne: false
      referencedRelation: "question_bank"
      referencedColumns: ["id"]
    }
                  ]
                },"experiment_attempts": {
                  Row: {
                    "answers": NonNullable<Json>,"created_at": string,"data": NonNullable<Json>,"experiment_id": string,"id": string,"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "answers"?: NonNullable<Json>,"created_at"?: string,"data"?: NonNullable<Json>,"experiment_id": string,"id"?: string,"user_id"?: string
                  }
                  Update: {
                    "answers"?: NonNullable<Json>,"created_at"?: string,"data"?: NonNullable<Json>,"experiment_id"?: string,"id"?: string,"user_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "experiment_attempts_experiment_id_fkey"
      columns: ["experiment_id"]
isOneToOne: false
      referencedRelation: "experiments"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "experiment_attempts_user_id_fkey"
      columns: ["user_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"experiments": {
                  Row: {
                    "created_at": string,"id": string,"key": string,"lesson_id": string,"sort_order": number,"summary": string | null,"title": string,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"id"?: string,"key": string,"lesson_id": string,"sort_order"?: number,"summary"?: string | null,"title": string,"updated_at"?: string
                  }
                  Update: {
                    "created_at"?: string,"id"?: string,"key"?: string,"lesson_id"?: string,"sort_order"?: number,"summary"?: string | null,"title"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "experiments_lesson_id_fkey"
      columns: ["lesson_id"]
isOneToOne: false
      referencedRelation: "lessons"
      referencedColumns: ["id"]
    }
                  ]
                },"learning_objectives": {
                  Row: {
                    "code": string | null,"content": string,"created_at": string,"created_by": string | null,"id": string,"kind": Database["public"]['Enums']["objective_kind"],"lesson_id": string,"sort_order": number,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "code"?: string | null,"content": string,"created_at"?: string,"created_by"?: string | null,"id"?: string,"kind": Database["public"]['Enums']["objective_kind"],"lesson_id": string,"sort_order"?: number,"updated_at"?: string
                  }
                  Update: {
                    "code"?: string | null,"content"?: string,"created_at"?: string,"created_by"?: string | null,"id"?: string,"kind"?: Database["public"]['Enums']["objective_kind"],"lesson_id"?: string,"sort_order"?: number,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "learning_objectives_created_by_fkey"
      columns: ["created_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "learning_objectives_lesson_id_fkey"
      columns: ["lesson_id"]
isOneToOne: false
      referencedRelation: "lessons"
      referencedColumns: ["id"]
    }
                  ]
                },"lesson_materials": {
                  Row: {
                    "body": string | null,"created_at": string,"created_by": string | null,"id": string,"is_published": boolean,"kind": Database["public"]['Enums']["material_kind"],"lesson_id": string,"section": Database["public"]['Enums']["lesson_section"],"sort_order": number,"storage_path": string | null,"title": string,"updated_at": string,"url": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "body"?: string | null,"created_at"?: string,"created_by"?: string | null,"id"?: string,"is_published"?: boolean,"kind": Database["public"]['Enums']["material_kind"],"lesson_id": string,"section": Database["public"]['Enums']["lesson_section"],"sort_order"?: number,"storage_path"?: string | null,"title": string,"updated_at"?: string,"url"?: string | null
                  }
                  Update: {
                    "body"?: string | null,"created_at"?: string,"created_by"?: string | null,"id"?: string,"is_published"?: boolean,"kind"?: Database["public"]['Enums']["material_kind"],"lesson_id"?: string,"section"?: Database["public"]['Enums']["lesson_section"],"sort_order"?: number,"storage_path"?: string | null,"title"?: string,"updated_at"?: string,"url"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "lesson_materials_created_by_fkey"
      columns: ["created_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "lesson_materials_lesson_id_fkey"
      columns: ["lesson_id"]
isOneToOne: false
      referencedRelation: "lessons"
      referencedColumns: ["id"]
    }
                  ]
                },"lessons": {
                  Row: {
                    "chapter_id": string,"created_at": string,"id": string,"is_published": boolean,"lesson_type": Database["public"]['Enums']["lesson_type"],"number": number,"slug": string,"sort_order": number,"summary": string | null,"title": string,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "chapter_id": string,"created_at"?: string,"id"?: string,"is_published"?: boolean,"lesson_type"?: Database["public"]['Enums']["lesson_type"],"number": number,"slug": string,"sort_order": number,"summary"?: string | null,"title": string,"updated_at"?: string
                  }
                  Update: {
                    "chapter_id"?: string,"created_at"?: string,"id"?: string,"is_published"?: boolean,"lesson_type"?: Database["public"]['Enums']["lesson_type"],"number"?: number,"slug"?: string,"sort_order"?: number,"summary"?: string | null,"title"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "lessons_chapter_id_fkey"
      columns: ["chapter_id"]
isOneToOne: false
      referencedRelation: "chapters"
      referencedColumns: ["id"]
    }
                  ]
                },"notifications": {
                  Row: {
                    "body": string | null,"created_at": string,"created_by": string | null,"id": string,"link": string | null,"read_at": string | null,"title": string,"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "body"?: string | null,"created_at"?: string,"created_by"?: string | null,"id"?: string,"link"?: string | null,"read_at"?: string | null,"title": string,"user_id": string
                  }
                  Update: {
                    "body"?: string | null,"created_at"?: string,"created_by"?: string | null,"id"?: string,"link"?: string | null,"read_at"?: string | null,"title"?: string,"user_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "notifications_created_by_fkey"
      columns: ["created_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "notifications_user_id_fkey"
      columns: ["user_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"practice_attempts": {
                  Row: {
                    "correct_units": number,"details": NonNullable<Json>,"duration_seconds": number | null,"id": string,"lesson_id": string,"mode": string,"score": number,"submitted_at": string,"total_units": number,"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "correct_units": number,"details"?: NonNullable<Json>,"duration_seconds"?: number | null,"id"?: string,"lesson_id": string,"mode": string,"score": number,"submitted_at"?: string,"total_units": number,"user_id": string
                  }
                  Update: {
                    "correct_units"?: number,"details"?: NonNullable<Json>,"duration_seconds"?: number | null,"id"?: string,"lesson_id"?: string,"mode"?: string,"score"?: number,"submitted_at"?: string,"total_units"?: number,"user_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "practice_attempts_lesson_id_fkey"
      columns: ["lesson_id"]
isOneToOne: false
      referencedRelation: "lessons"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "practice_attempts_user_id_fkey"
      columns: ["user_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"profiles": {
                  Row: {
                    "created_at": string,"email": string | null,"full_name": string,"id": string,"is_active": boolean,"role": Database["public"]['Enums']["user_role"],"school_id": string | null,"student_code": string | null,"updated_at": string,"username": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"email"?: string | null,"full_name"?: string,"id": string,"is_active"?: boolean,"role"?: Database["public"]['Enums']["user_role"],"school_id"?: string | null,"student_code"?: string | null,"updated_at"?: string,"username"?: string | null
                  }
                  Update: {
                    "created_at"?: string,"email"?: string | null,"full_name"?: string,"id"?: string,"is_active"?: boolean,"role"?: Database["public"]['Enums']["user_role"],"school_id"?: string | null,"student_code"?: string | null,"updated_at"?: string,"username"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "profiles_school_id_fkey"
      columns: ["school_id"]
isOneToOne: false
      referencedRelation: "schools"
      referencedColumns: ["id"]
    }
                  ]
                },"question_bank": {
                  Row: {
                    "answer_number": number | null,"answer_text": string | null,"code": string | null,"content": string,"created_at": string,"created_by": string | null,"explanation": string,"formula": string | null,"id": string,"lesson_id": string,"level": Database["public"]['Enums']["cognitive_level"],"points": number,"remember": string | null,"requirement": string | null,"rubric": string | null,"sort_order": number,"source": string,"status": Database["public"]['Enums']["review_status"],"tolerance": number,"type": Database["public"]['Enums']["question_type"],"unit": string | null,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "answer_number"?: number | null,"answer_text"?: string | null,"code"?: string | null,"content": string,"created_at"?: string,"created_by"?: string | null,"explanation"?: string,"formula"?: string | null,"id"?: string,"lesson_id": string,"level": Database["public"]['Enums']["cognitive_level"],"points"?: number,"remember"?: string | null,"requirement"?: string | null,"rubric"?: string | null,"sort_order"?: number,"source"?: string,"status"?: Database["public"]['Enums']["review_status"],"tolerance"?: number,"type": Database["public"]['Enums']["question_type"],"unit"?: string | null,"updated_at"?: string
                  }
                  Update: {
                    "answer_number"?: number | null,"answer_text"?: string | null,"code"?: string | null,"content"?: string,"created_at"?: string,"created_by"?: string | null,"explanation"?: string,"formula"?: string | null,"id"?: string,"lesson_id"?: string,"level"?: Database["public"]['Enums']["cognitive_level"],"points"?: number,"remember"?: string | null,"requirement"?: string | null,"rubric"?: string | null,"sort_order"?: number,"source"?: string,"status"?: Database["public"]['Enums']["review_status"],"tolerance"?: number,"type"?: Database["public"]['Enums']["question_type"],"unit"?: string | null,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "question_bank_created_by_fkey"
      columns: ["created_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "question_bank_lesson_id_fkey"
      columns: ["lesson_id"]
isOneToOne: false
      referencedRelation: "lessons"
      referencedColumns: ["id"]
    }
                  ]
                },"question_options": {
                  Row: {
                    "content": string,"id": string,"is_correct": boolean,"label": string,"question_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "content": string,"id"?: string,"is_correct"?: boolean,"label": string,"question_id": string
                  }
                  Update: {
                    "content"?: string,"id"?: string,"is_correct"?: boolean,"label"?: string,"question_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "question_options_question_id_fkey"
      columns: ["question_id"]
isOneToOne: false
      referencedRelation: "question_bank"
      referencedColumns: ["id"]
    }
                  ]
                },"question_subitems": {
                  Row: {
                    "content": string,"explanation": string,"id": string,"is_true": boolean,"label": string,"question_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "content": string,"explanation"?: string,"id"?: string,"is_true": boolean,"label": string,"question_id": string
                  }
                  Update: {
                    "content"?: string,"explanation"?: string,"id"?: string,"is_true"?: boolean,"label"?: string,"question_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "question_subitems_question_id_fkey"
      columns: ["question_id"]
isOneToOne: false
      referencedRelation: "question_bank"
      referencedColumns: ["id"]
    }
                  ]
                },"schools": {
                  Row: {
                    "address": string | null,"code": string,"created_at": string,"id": string,"name": string,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "address"?: string | null,"code": string,"created_at"?: string,"id"?: string,"name": string,"updated_at"?: string
                  }
                  Update: {
                    "address"?: string | null,"code"?: string,"created_at"?: string,"id"?: string,"name"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    
                  ]
                },"student_comments": {
                  Row: {
                    "assignment_id": string | null,"content": string,"created_at": string,"id": string,"student_id": string,"teacher_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "assignment_id"?: string | null,"content": string,"created_at"?: string,"id"?: string,"student_id": string,"teacher_id": string
                  }
                  Update: {
                    "assignment_id"?: string | null,"content"?: string,"created_at"?: string,"id"?: string,"student_id"?: string,"teacher_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "student_comments_assignment_id_fkey"
      columns: ["assignment_id"]
isOneToOne: false
      referencedRelation: "assessment_assignments"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "student_comments_student_id_fkey"
      columns: ["student_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "student_comments_teacher_id_fkey"
      columns: ["teacher_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"system_settings": {
                  Row: {
                    "description": string | null,"key": string,"updated_at": string,"updated_by": string | null,"value": NonNullable<Json>
                  }
                  ComputedFields: never
                  Insert: {
                    "description"?: string | null,"key": string,"updated_at"?: string,"updated_by"?: string | null,"value": NonNullable<Json>
                  }
                  Update: {
                    "description"?: string | null,"key"?: string,"updated_at"?: string,"updated_by"?: string | null,"value"?: NonNullable<Json>
                  }
                  Relationships: [
                    {
      foreignKeyName: "system_settings_updated_by_fkey"
      columns: ["updated_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"textbooks": {
                  Row: {
                    "code": string,"created_at": string,"grade": number,"id": string,"name": string,"series": string,"subject": string,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "code": string,"created_at"?: string,"grade": number,"id"?: string,"name": string,"series": string,"subject": string,"updated_at"?: string
                  }
                  Update: {
                    "code"?: string,"created_at"?: string,"grade"?: number,"id"?: string,"name"?: string,"series"?: string,"subject"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    
                  ]
                }
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "current_user_role":
{ Args: Record<PropertyKey, never>; Returns: Database["public"]['Enums']["user_role"]
                           },
"generate_join_code":
{ Args: Record<PropertyKey, never>; Returns: string
                           },
"get_class_teachers":
{ Args: { "p_class_ids": (string)[] }; Returns: {
              "class_id": string,"full_name": string,"teacher_id": string
            }[]
                           },
"is_admin":
{ Args: Record<PropertyKey, never>; Returns: boolean
                           },
"is_class_member":
{ Args: { "p_class_id": string }; Returns: boolean
                           },
"is_class_teacher":
{ Args: { "p_class_id": string }; Returns: boolean
                           },
"is_my_teacher":
{ Args: { "p_user_id": string }; Returns: boolean
                           },
"is_staff":
{ Args: Record<PropertyKey, never>; Returns: boolean
                           },
"list_open_classes":
{ Args: Record<PropertyKey, never>; Returns: {
              "academic_year": string,"id": string,"name": string,"school_name": string
            }[]
                           },
"list_unassigned_classes":
{ Args: Record<PropertyKey, never>; Returns: {
              "academic_year": string,"id": string,"name": string,"student_count": number
            }[]
                           },
"owns_assessment":
{ Args: { "p_assessment_id": string }; Returns: boolean
                           },
"teaches_user":
{ Args: { "p_user_id": string }; Returns: boolean
                           }
          }
          Enums: {
            "answer_visibility": "immediately"|"after_due"|"never","assessment_source": "manual"|"auto"|"ai","assessment_status": "draft"|"published"|"archived","attempt_status": "in_progress"|"submitted","class_member_role": "teacher"|"student","cognitive_level": "biet"|"hieu"|"van_dung","lesson_section": "knowledge"|"experiment"|"practice"|"self_assessment","lesson_type": "theory"|"practice","material_kind": "text"|"formula"|"example"|"image"|"video"|"link"|"file","objective_kind": "objective"|"requirement","question_type": "multiple_choice"|"true_false"|"short_answer"|"essay","review_status": "draft"|"reviewed"|"approved"|"published","user_role": "admin"|"teacher"|"student"
          }
          CompositeTypes: {
            [_ in never]: never
          }
        }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "graphql_public": {
          Enums: {
            
          }
        },"public": {
          Enums: {
            "answer_visibility": ["immediately", "after_due", "never"],"assessment_source": ["manual", "auto", "ai"],"assessment_status": ["draft", "published", "archived"],"attempt_status": ["in_progress", "submitted"],"class_member_role": ["teacher", "student"],"cognitive_level": ["biet", "hieu", "van_dung"],"lesson_section": ["knowledge", "experiment", "practice", "self_assessment"],"lesson_type": ["theory", "practice"],"material_kind": ["text", "formula", "example", "image", "video", "link", "file"],"objective_kind": ["objective", "requirement"],"question_type": ["multiple_choice", "true_false", "short_answer", "essay"],"review_status": ["draft", "reviewed", "approved", "published"],"user_role": ["admin", "teacher", "student"]
          }
        }
} as const
