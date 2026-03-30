-- 1. Create the bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio', 'portfolio', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow Public Access (SELECT) to everyone
DO $$ BEGIN
  CREATE POLICY "Public Access" ON storage.objects
    FOR SELECT USING (bucket_id = 'portfolio');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 3. Allow Authenticated users to Upload (INSERT)
DO $$ BEGIN
  CREATE POLICY "Authenticated Upload" ON storage.objects
    FOR INSERT WITH CHECK (
      bucket_id = 'portfolio' 
      AND auth.role() = 'authenticated'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 4. Allow Authenticated users to Update (UPDATE)
DO $$ BEGIN
  CREATE POLICY "Authenticated Update" ON storage.objects
    FOR UPDATE USING (
      bucket_id = 'portfolio' 
      AND auth.role() = 'authenticated'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 5. Allow Authenticated users to Delete (DELETE)
DO $$ BEGIN
  CREATE POLICY "Authenticated Delete" ON storage.objects
    FOR DELETE USING (
      bucket_id = 'portfolio' 
      AND auth.role() = 'authenticated'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


