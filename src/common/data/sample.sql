
-- First, let's add some tags for categorizing books
INSERT INTO tags (id, name, color) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'Fiction', '#3B82F6'),
('550e8400-e29b-41d4-a716-446655440002', 'Mystery', '#8B5CF6'),
('550e8400-e29b-41d4-a716-446655440003', 'Romance', '#EC4899'),
('550e8400-e29b-41d4-a716-446655440004', 'Thriller', '#EF4444'),
('550e8400-e29b-41d4-a716-446655440005', 'Self-Help', '#10B981'),
('550e8400-e29b-41d4-a716-446655440006', 'Biography', '#F59E0B'),
('550e8400-e29b-41d4-a716-446655440007', 'Science Fiction', '#06B6D4'),
('550e8400-e29b-41d4-a716-446655440008', 'Fantasy', '#8B5CF6'),
('550e8400-e29b-41d4-a716-446655440009', 'History', '#6B7280'),
('550e8400-e29b-41d4-a716-446655440010', 'Psychology', '#14B8A6');

-- Add sample books with cover images
INSERT INTO books (id, title, author, isbn, description, cover_image_url, published_date, genre, page_count) VALUES 
('650e8400-e29b-41d4-a716-446655440001', 'The Silent Patient', 'Alex Michaelides', '978-1250301697', 'A gripping psychological thriller about a woman who refuses to speak after allegedly murdering her husband.', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400', '2019-02-05', 'Thriller', 336),
('650e8400-e29b-41d4-a716-446655440002', 'Where the Crawdads Sing', 'Delia Owens', '978-0735219090', 'A haunting tale of nature, love, and murder set in the marshlands of North Carolina.', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400', '2018-08-14', 'Fiction', 384),
('650e8400-e29b-41d4-a716-446655440003', 'Atomic Habits', 'James Clear', '978-0735211292', 'An easy and proven way to build good habits and break bad ones.', 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400', '2018-10-16', 'Self-Help', 320),
('650e8400-e29b-41d4-a716-446655440004', 'The Seven Husbands of Evelyn Hugo', 'Taylor Jenkins Reid', '978-1501161933', 'A reclusive Hollywood icon finally tells her story to a young journalist.', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400', '2017-06-13', 'Fiction', 400),
('650e8400-e29b-41d4-a716-446655440005', 'Project Hail Mary', 'Andy Weir', '978-0593135204', 'A lone astronaut must save humanity in this thrilling science fiction adventure.', 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400', '2021-05-04', 'Science Fiction', 496),
('650e8400-e29b-41d4-a716-446655440006', 'The Midnight Library', 'Matt Haig', '978-0525559474', 'Between life and death there is a library, and within that library, the shelves go on forever.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', '2020-08-13', 'Fiction', 288),
('650e8400-e29b-41d4-a716-446655440007', 'Educated', 'Tara Westover', '978-0399590504', 'A memoir about a young girl who grows up in a survivalist family and eventually gets a PhD from Cambridge.', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400', '2018-02-20', 'Biography', 334),
('650e8400-e29b-41d4-a716-446655440008', 'The Song of Achilles', 'Madeline Miller', '978-0062060624', 'A tale of love, honor, and destiny in ancient Greece.', 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400', '2011-09-20', 'Fantasy', 416);

-- Add book-tag relationships
INSERT INTO book_tags (book_id, tag_id) VALUES 
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004'), -- Silent Patient - Thriller
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440010'), -- Silent Patient - Psychology
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001'), -- Crawdads - Fiction
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002'), -- Crawdads - Mystery
('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440005'), -- Atomic Habits - Self-Help
('650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001'), -- Evelyn Hugo - Fiction
('650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003'), -- Evelyn Hugo - Romance
('650e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440007'), -- Project Hail Mary - Science Fiction
('650e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440001'), -- Midnight Library - Fiction
('650e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440006'), -- Educated - Biography
('650e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440008'); -- Song of Achilles - Fantasy

-- Add sample user profiles (these will be created when users sign up via auth)
INSERT INTO profiles (id, full_name, organization, bio, avatar_url, favorite_genres) VALUES 
('750e8400-e29b-41d4-a716-446655440001', 'Sarah Johnson', 'BookWorms United', 'Avid reader and book club enthusiast. Love discovering new authors and discussing plot twists!', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150', ARRAY['Fiction', 'Mystery', 'Thriller']),
('750e8400-e29b-41d4-a716-446655440002', 'Mike Chen', 'City Library Book Club', 'Former librarian turned book reviewer. Passionate about science fiction and fantasy novels.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', ARRAY['Science Fiction', 'Fantasy', 'Biography']),
('750e8400-e29b-41d4-a716-446655440003', 'Emma Williams', 'Romance Readers Society', 'Romance novel enthusiast and blogger. Always looking for the next great love story!', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', ARRAY['Romance', 'Fiction', 'Contemporary']),
('750e8400-e29b-41d4-a716-446655440004', 'David Rodriguez', 'Mystery Book Club', 'Detective fiction lover and amateur sleuth. Enjoys solving puzzles in books and real life.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', ARRAY['Mystery', 'Thriller', 'Crime']),
('750e8400-e29b-41d4-a716-446655440005', 'Lisa Zhang', 'Self-Improvement Circle', 'Life coach and motivational speaker. Believes in the power of books to transform lives.', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', ARRAY['Self-Help', 'Psychology', 'Business']);

-- Add book clubs
INSERT INTO clubs (id, name, description, cover_image_url, created_by, is_private) VALUES 
('850e8400-e29b-41d4-a716-446655440001', 'The Mystery Solvers', 'A club dedicated to unraveling the best mystery and thriller novels. We meet monthly to discuss plot twists, red herrings, and detective work!', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600', '750e8400-e29b-41d4-a716-446655440001', false),
('850e8400-e29b-41d4-a716-446655440002', 'Sci-Fi Explorers', 'Journey through galaxies and alternate realities with fellow science fiction enthusiasts. From classic Asimov to modern space operas!', 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=600', '750e8400-e29b-41d4-a716-446655440002', false),
('850e8400-e29b-41d4-a716-446655440003', 'Romance & Relationships', 'Dive into love stories that make our hearts flutter. From contemporary romance to historical love affairs.', 'https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?w=600', '750e8400-e29b-41d4-a716-446655440003', false),
('850e8400-e29b-41d4-a716-446655440004', 'Personal Growth Hub', 'Transform your life one book at a time. We focus on self-help, psychology, and personal development literature.', 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600', '750e8400-e29b-41d4-a716-446655440005', false),
('850e8400-e29b-41d4-a716-446655440005', 'Classic Literature Society', 'Exploring timeless masterpieces and their enduring impact on modern literature and society.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600', '750e8400-e29b-41d4-a716-446655440004', true);

-- Add club memberships
INSERT INTO memberships (user_id, club_id, role) VALUES 
('750e8400-e29b-41d4-a716-446655440001', '850e8400-e29b-41d4-a716-446655440001', 'admin'),
('750e8400-e29b-41d4-a716-446655440002', '850e8400-e29b-41d4-a716-446655440002', 'admin'),
('750e8400-e29b-41d4-a716-446655440003', '850e8400-e29b-41d4-a716-446655440003', 'admin'),
('750e8400-e29b-41d4-a716-446655440004', '850e8400-e29b-41d4-a716-446655440005', 'admin'),
('750e8400-e29b-41d4-a716-446655440005', '850e8400-e29b-41d4-a716-446655440004', 'admin'),
-- Cross memberships
('750e8400-e29b-41d4-a716-446655440001', '850e8400-e29b-41d4-a716-446655440002', 'member'),
('750e8400-e29b-41d4-a716-446655440002', '850e8400-e29b-41d4-a716-446655440001', 'member'),
('750e8400-e29b-41d4-a716-446655440003', '850e8400-e29b-41d4-a716-446655440004', 'member'),
('750e8400-e29b-41d4-a716-446655440004', '850e8400-e29b-41d4-a716-446655440003', 'member'),
('750e8400-e29b-41d4-a716-446655440005', '850e8400-e29b-41d4-a716-446655440001', 'member');

-- Add book reviews
INSERT INTO reviews (id, user_id, book_id, rating, review_text) VALUES 
('950e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', 5, 'Absolutely gripping! Could not put it down. The psychological depth and plot twists kept me guessing until the very end.'),
('950e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440001', 4, 'Well-written thriller with complex characters. The ending was surprising but felt earned.'),
('950e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440002', 5, 'Beautiful storytelling with vivid descriptions of nature. The mystery kept me engaged throughout.'),
('950e8400-e29b-41d4-a716-446655440004', '750e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440002', 4, 'Lyrical prose and compelling mystery. Some parts felt slow but the payoff was worth it.'),
('950e8400-e29b-41d4-a716-446655440005', '750e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440003', 5, 'Life-changing book! The practical advice is backed by solid research. Implementing these habits has improved my daily routine significantly.'),
('950e8400-e29b-41d4-a716-446655440006', '750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440003', 4, 'Great self-help book with actionable insights. Some concepts could be explained more concisely.'),
('950e8400-e29b-41d4-a716-446655440007', '750e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440004', 5, 'Captivating story with amazing character development. The romance and drama were perfectly balanced.'),
('950e8400-e29b-41d4-a716-446655440008', '750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440005', 5, 'Incredible science fiction adventure! The problem-solving and humor made it an absolute page-turner.'),
('950e8400-e29b-41d4-a716-446655440009', '750e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440006', 4, 'Philosophical and thought-provoking. Made me reflect on life choices and possibilities.'),
('950e8400-e29b-41d4-a716-446655440010', '750e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440007', 5, 'Powerful memoir that shows the importance of education and perseverance. Truly inspiring.'),
('950e8400-e29b-41d4-a716-446655440011', '750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440008', 4, 'Beautiful retelling of the Iliad. The relationship between Achilles and Patroclus was handled with such care and emotion.');

-- Add some review likes
INSERT INTO review_likes (user_id, review_id) VALUES 
('750e8400-e29b-41d4-a716-446655440002', '950e8400-e29b-41d4-a716-446655440001'),
('750e8400-e29b-41d4-a716-446655440003', '950e8400-e29b-41d4-a716-446655440001'),
('750e8400-e29b-41d4-a716-446655440004', '950e8400-e29b-41d4-a716-446655440001'),
('750e8400-e29b-41d4-a716-446655440001', '950e8400-e29b-41d4-a716-446655440005'),
('750e8400-e29b-41d4-a716-446655440003', '950e8400-e29b-41d4-a716-446655440005'),
('750e8400-e29b-41d4-a716-446655440004', '950e8400-e29b-41d4-a716-446655440007'),
('750e8400-e29b-41d4-a716-446655440005', '950e8400-e29b-41d4-a716-446655440008'),
('750e8400-e29b-41d4-a716-446655440001', '950e8400-e29b-41d4-a716-446655440008'),
('750e8400-e29b-41d4-a716-446655440002', '950e8400-e29b-41d4-a716-446655440010');

-- Add personal library entries
INSERT INTO personal_library (user_id, book_id, status, started_reading_at, finished_reading_at) VALUES 
('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', 'finished', '2024-01-15 10:00:00', '2024-01-18 22:30:00'),
('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440003', 'currently_reading', '2024-01-20 09:00:00', NULL),
('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440008', 'finished', '2024-01-05 14:00:00', '2024-01-12 20:00:00'),
('750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440001', 'finished', '2024-01-10 11:00:00', '2024-01-14 19:00:00'),
('750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440005', 'finished', '2024-01-16 16:00:00', '2024-01-22 21:00:00'),
('750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440006', 'want_to_read', NULL, NULL),
('750e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440002', 'finished', '2024-01-08 12:00:00', '2024-01-15 18:00:00'),
('750e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440004', 'finished', '2024-01-18 15:00:00', '2024-01-24 23:00:00'),
('750e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440002', 'finished', '2024-01-12 13:00:00', '2024-01-19 17:00:00'),
('750e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440006', 'currently_reading', '2024-01-25 10:00:00', NULL),
('750e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440003', 'finished', '2024-01-14 08:00:00', '2024-01-20 22:00:00'),
('750e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440007', 'finished', '2024-01-21 11:00:00', '2024-01-26 20:30:00');
