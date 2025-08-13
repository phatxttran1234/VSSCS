/*
  # Remove categories from video drills

  1. Changes
    - Remove category column from video_drills table
    - Remove check constraint for categories

  2. Security
    - No changes to RLS policies needed
*/

-- Remove the check constraint first
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'video_drills_category_check'
  ) THEN
    ALTER TABLE video_drills DROP CONSTRAINT video_drills_category_check;
  END IF;
END $$;

-- Remove the category column
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'video_drills' AND column_name = 'category'
  ) THEN
    ALTER TABLE video_drills DROP COLUMN category;
  END IF;
END $$;