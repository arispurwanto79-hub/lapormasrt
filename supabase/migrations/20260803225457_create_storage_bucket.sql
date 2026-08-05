/*
# Create storage bucket for report photos

1. Storage
- Create public bucket 'laporan-photos' for citizen complaint photos.
2. Policies
- Public read (anyone can view photos).
- Authenticated upload (admin) and anon upload (citizens submitting reports).
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('laporan-photos', 'laporan-photos', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "public_read_photos" ON storage.objects;
CREATE POLICY "public_read_photos" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'laporan-photos');

DROP POLICY IF EXISTS "anon_upload_photos" ON storage.objects;
CREATE POLICY "anon_upload_photos" ON storage.objects FOR INSERT
  TO anon, authenticated WITH CHECK (bucket_id = 'laporan-photos');

DROP POLICY IF EXISTS "auth_update_photos" ON storage.objects;
CREATE POLICY "auth_update_photos" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'laporan-photos') WITH CHECK (bucket_id = 'laporan-photos');

DROP POLICY IF EXISTS "auth_delete_photos" ON storage.objects;
CREATE POLICY "auth_delete_photos" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'laporan-photos');
