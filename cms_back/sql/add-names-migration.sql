-- Migration: Add nombre and apellido to USUARIO table
-- This adds first name and last name fields to the user table

-- Add columns
ALTER TABLE USUARIO ADD COLUMN IF NOT EXISTS nombre VARCHAR(100);
ALTER TABLE USUARIO ADD COLUMN IF NOT EXISTS apellido VARCHAR(100);

-- Update existing records to populate names from username (temporary)
-- You can manually update these later with real names
UPDATE USUARIO 
SET nombre = SPLIT_PART(username, ' ', 1),
    apellido = COALESCE(NULLIF(SPLIT_PART(username, ' ', 2), ''), 'N/A')
WHERE nombre IS NULL;

-- Add comment
COMMENT ON COLUMN USUARIO.nombre IS 'First name of the user';
COMMENT ON COLUMN USUARIO.apellido IS 'Last name of the user';





