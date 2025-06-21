-- Migration: rename_user_id_on_table_adoptions
ALTER TABLE adoptions RENAME COLUMN user_id TO user_email;
