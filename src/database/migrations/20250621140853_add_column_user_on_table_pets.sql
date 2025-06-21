-- Migration: add_column_user_on_table_pets
ALTER TABLE adoptions ADD COLUMN user_id TEXT NULL;
