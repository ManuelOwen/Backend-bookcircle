
-- Create books table
CREATE TABLE public.books (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  isbn TEXT UNIQUE,
  description TEXT,
  cover_image_url TEXT,
  published_date DATE,
  genre TEXT,
  page_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  book_id UUID REFERENCES public.books(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, book_id)
);

-- Create tags table
CREATE TABLE public.tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create book_tags junction table
CREATE TABLE public.book_tags (
  book_id UUID REFERENCES public.books(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (book_id, tag_id)
);

-- Create likes table for reviews
CREATE TABLE public.review_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  review_id UUID REFERENCES public.reviews(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, review_id)
);

-- Create personal_library table
CREATE TABLE public.personal_library (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  book_id UUID REFERENCES public.books(id) ON DELETE CASCADE NOT NULL,
  status TEXT CHECK (status IN ('want_to_read', 'currently_reading', 'read')) NOT NULL DEFAULT 'want_to_read',
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  started_reading_at TIMESTAMP WITH TIME ZONE,
  finished_reading_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, book_id)
);

-- Create clubs table
CREATE TABLE public.clubs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  created_by UUID REFERENCES auth.users NOT NULL,
  is_private BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create memberships table
CREATE TABLE public.memberships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  club_id UUID REFERENCES public.clubs(id) ON DELETE CASCADE NOT NULL,
  role TEXT CHECK (role IN ('member', 'moderator', 'admin')) NOT NULL DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, club_id)
);

-- Update existing profiles table to include more fields for bookclub
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS favorite_genres TEXT[];

-- Enable Row Level Security
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personal_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;

-- Books policies (public read, authenticated write)
CREATE POLICY "Anyone can view books" ON public.books FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert books" ON public.books FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update books" ON public.books FOR UPDATE TO authenticated USING (true);

-- Reviews policies
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can insert their own reviews" ON public.reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reviews" ON public.reviews FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reviews" ON public.reviews FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Tags policies
CREATE POLICY "Anyone can view tags" ON public.tags FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage tags" ON public.tags FOR ALL TO authenticated USING (true);

-- Book tags policies
CREATE POLICY "Anyone can view book tags" ON public.book_tags FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage book tags" ON public.book_tags FOR ALL TO authenticated USING (true);

-- Review likes policies
CREATE POLICY "Anyone can view review likes" ON public.review_likes FOR SELECT USING (true);
CREATE POLICY "Users can manage their own likes" ON public.review_likes FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Personal library policies
CREATE POLICY "Users can view their own library" ON public.personal_library FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own library" ON public.personal_library FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Clubs policies
CREATE POLICY "Anyone can view public clubs" ON public.clubs FOR SELECT USING (is_private = false OR auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can create clubs" ON public.clubs FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Club creators can update their clubs" ON public.clubs FOR UPDATE TO authenticated USING (auth.uid() = created_by);
CREATE POLICY "Club creators can delete their clubs" ON public.clubs FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- Memberships policies
CREATE POLICY "Members can view club memberships" ON public.memberships FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.memberships m WHERE m.club_id = memberships.club_id AND m.user_id = auth.uid())
);
CREATE POLICY "Users can join clubs" ON public.memberships FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave clubs" ON public.memberships FOR DELETE TO authenticated USING (auth.uid() = user_id);
