
-- Rename categories
UPDATE categories SET name = 'Highlights', slug = 'highlights', sort_order = 1 WHERE id = 'db39bce9-c77f-49c6-b0bd-691de6675124';
UPDATE categories SET name = 'Formuler Geräte', slug = 'formuler-geraete', sort_order = 2 WHERE id = '23b7dfb4-9dbf-444c-819f-971334652055';
UPDATE categories SET name = 'Octagon Geräte', slug = 'octagon-geraete', sort_order = 3 WHERE id = '2fc226d0-7695-4973-b2f6-b0724a90b694';
UPDATE categories SET name = 'Zubehör', slug = 'zubehoer', sort_order = 4 WHERE id = '05d59437-3970-4814-a9fe-3a2fcbbf73cb';

-- Move Formuler products to "Formuler Geräte" category
UPDATE listings SET category_id = '23b7dfb4-9dbf-444c-819f-971334652055' WHERE id IN (
  '8ddc7af0-68a3-45bb-9763-46c31d699f6e',
  'd47e3b91-1871-4cdb-8ea6-a42e9baf40c7',
  '1f8101e9-1441-43ed-bc03-d71d9c2c962d',
  '17271261-e77d-47fc-a095-5128beca3b0d'
);

-- Move Octagon products to "Octagon Geräte" category
UPDATE listings SET category_id = '2fc226d0-7695-4973-b2f6-b0724a90b694' WHERE id IN (
  '26b4b1ff-008c-42e6-933d-af58a8ad5a5c',
  '73dc2582-c7ce-4263-bc02-69a15c50d0cf',
  '897593ad-ec62-4a06-820b-08e64a2528d1',
  'cffed507-e9c3-4e27-b2ba-4a5014a7c98a'
);

-- Move AirPods to "Zubehör" category
UPDATE listings SET category_id = '05d59437-3970-4814-a9fe-3a2fcbbf73cb' WHERE id = '0cd9432a-7ab2-4d00-9f5c-cb197c0ce232';
