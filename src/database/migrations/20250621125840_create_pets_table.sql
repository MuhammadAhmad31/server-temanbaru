-- Migration: create_pets_table
CREATE TABLE IF NOT EXISTS adoptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT  NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL,
  animal_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_adoptions_updated_at 
AFTER UPDATE ON adoptions
BEGIN
  UPDATE adoptions SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;