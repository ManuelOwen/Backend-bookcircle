-- Insert basic tags for genres
INSERT INTO tags (id, name, color, created_at) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'Fiction', '#3B82F6', NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'Mystery', '#8B5CF6', NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'Romance', '#EC4899', NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'Thriller', '#EF4444', NOW()),
('550e8400-e29b-41d4-a716-446655440005', 'Self-Help', '#10B981', NOW()),
('550e8400-e29b-41d4-a716-446655440006', 'Biography', '#F59E0B', NOW()),
('550e8400-e29b-41d4-a716-446655440007', 'Science Fiction', '#06B6D4', NOW()),
('550e8400-e29b-41d4-a716-446655440008', 'Fantasy', '#8B5CF6', NOW()),
('550e8400-e29b-41d4-a716-446655440009', 'History', '#6B7280', NOW()),
('550e8400-e29b-41d4-a716-446655440010', 'Psychology', '#14B8A6', NOW()),
('550e8400-e29b-41d4-a716-446655440011', 'Business', '#059669', NOW()),
('550e8400-e29b-41d4-a716-446655440012', 'Finance', '#DC2626', NOW()),
('550e8400-e29b-41d4-a716-446655440013', 'Economics', '#7C3AED', NOW()),
('550e8400-e29b-41d4-a716-446655440014', 'Memoir', '#EA580C', NOW()),
('550e8400-e29b-41d4-a716-446655440015', 'Literary Fiction', '#1E40AF', NOW()),
('550e8400-e29b-41d4-a716-446655440016', 'Young Adult', '#BE185D', NOW()),
('550e8400-e29b-41d4-a716-446655440017', 'Horror', '#991B1B', NOW()),
('550e8400-e29b-41d4-a716-446655440018', 'Historical Fiction', '#92400E', NOW())
ON CONFLICT (name) DO NOTHING; 