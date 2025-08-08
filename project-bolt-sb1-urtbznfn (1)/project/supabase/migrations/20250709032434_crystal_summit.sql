/*
  # Add categories to video drills

  1. Changes
    - Add category column to video_drills table with default value
    - Add check constraint to ensure valid categories
    - Update existing records to have 'General' category

  2. Categories
    - Agility
    - Passing
    - Setting
    - Spiking
    - Serving
    - Blocking
    - General (default)

  3. Security
    - No changes to RLS policies needed
*/

-- Add category column to video_drills table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'video_drills' AND column_name = 'category'
  ) THEN
    ALTER TABLE video_drills ADD COLUMN category text DEFAULT 'General';
  END IF;
END $$;

-- Add check constraint for valid categories
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'video_drills_category_check'
  ) THEN
    ALTER TABLE video_drills 
    ADD CONSTRAINT video_drills_category_check 
    CHECK (category IN ('Agility', 'Passing', 'Setting', 'Spiking', 'Serving', 'Blocking', 'General'));
  END IF;
END $$;

-- Update existing records to have 'General' category if they don't have one
UPDATE video_drills 
SET category = 'General' 
WHERE category IS NULL OR category = '';