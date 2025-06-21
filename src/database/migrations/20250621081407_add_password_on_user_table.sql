-- Migration: add_password_on_user_table
ALTER TABLE users ADD COLUMN password TEXT;