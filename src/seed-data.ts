import { NestFactory } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from './app.module';
import { BooksService } from './books/books.service';
import { ClubService } from './club/club.service';
import { UsersService } from './users/users.service';
import { PersonalLibrary } from './personal-library/entities/personal-library.entity';
import { Review } from './reviews/entities/review.entity';
import { Membership } from './membership/entities/membership.entity';
import { ReviewLike } from './likes/entities/like.entity';
import { getConnection, Repository, createConnection } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { Book } from './books/entities/book.entity';
import { Tag } from './tags/entities/tag.entity';

// Load environment variables
dotenv.config();

async function seedData() {
  // First create the NestJS application context
  const app = await NestFactory.createApplicationContext(AppModule);
  
  // Get services
  const booksService = app.get(BooksService);
  const clubService = app.get(ClubService);
  const usersService = app.get(UsersService);
  const configService = app.get(ConfigService);
  
  // Get database connection
  let connection;
  try {
    // Try to get existing connection first
    connection = getConnection();
  } catch (error) {
    console.log('No existing connection found, creating a new one...');
    try {
      // If no connection exists, create a new one
      connection = await createConnection({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        logging: true,
      });
      console.log('Database connection established successfully');
    } catch (dbError) {
      console.error('Failed to connect to the database:', dbError);
      await app.close();
      process.exit(1);
    }
  }
  
  // Initialize repositories
  const reviewLikeRepository = connection.getRepository(ReviewLike);
  const reviewRepository = connection.getRepository(Review);
  const membershipRepository = connection.getRepository(Membership);
  const personalLibraryRepository = connection.getRepository(PersonalLibrary);
  const tagRepository = connection.getRepository(Tag);
  
  console.log('Repositories initialized successfully');
  
  const userId = '56963768-b972-41a7-8cf1-826544da7199';
  
  try {
    // Create tags first
    const tagData = [
      { name: 'Fiction', color: '#3B82F6' },
      { name: 'Mystery', color: '#8B5CF6' },
      { name: 'Romance', color: '#EC4899' },
      { name: 'Thriller', color: '#EF4444' },
      { name: 'Self-Help', color: '#10B981' },
      { name: 'Biography', color: '#F59E0B' },
      { name: 'Science Fiction', color: '#06B6D4' },
      { name: 'Fantasy', color: '#8B5CF6' },
      { name: 'History', color: '#6B7280' },
      { name: 'Psychology', color: '#14B8A6' },
      { name: 'Business', color: '#059669' },
      { name: 'Finance', color: '#DC2626' },
      { name: 'Economics', color: '#7C3AED' },
      { name: 'Memoir', color: '#EA580C' },
      { name: 'Literary Fiction', color: '#1E40AF' },
      { name: 'Young Adult', color: '#BE185D' },
      { name: 'Horror', color: '#991B1B' },
      { name: 'Historical Fiction', color: '#92400E' },
    ];

    console.log('Creating tags...');
    const tags: Tag[] = [];
    for (const tagInfo of tagData) {
      const existingTag = await tagRepository.findOne({ where: { name: tagInfo.name } });
      if (!existingTag) {
        const tag = tagRepository.create(tagInfo);
        const savedTag = await tagRepository.save(tag);
        tags.push(savedTag);
        console.log(`Created tag: ${savedTag.name}`);
      } else {
        tags.push(existingTag);
        console.log(`Tag already exists: ${existingTag.name}`);
      }
    }
    console.log(`Total tags available: ${tags.length}`);

    // Array of book data for seeding
    const bookData = [
      // Fiction Books
      { title: 'The Silent Patient', author: 'Alex Michaelides', genre: 'thriller', description: 'A psychological thriller about a woman who refuses to speak after allegedly murdering her husband.' },
      { title: 'Where the Crawdads Sing', author: 'Delia Owens', genre: 'fiction', description: 'A coming-of-age mystery set in the marshlands of North Carolina.' },
      { title: 'The Seven Husbands of Evelyn Hugo', author: 'Taylor Jenkins Reid', genre: 'romance', description: 'The story of a reclusive Hollywood icon who decides to tell her life story.' },
      { title: 'Circe', author: 'Madeline Miller', genre: 'fantasy', description: 'A retelling of Greek mythology from the perspective of the witch Circe.' },
      { title: 'The Midnight Library', author: 'Matt Haig', genre: 'fiction', description: 'A magical library between life and death where each book represents a different life.' },
      
      // Mystery & Thriller
      { title: 'Gone Girl', author: 'Gillian Flynn', genre: 'thriller', description: 'A psychological thriller about a marriage gone terribly wrong.' },
      { title: 'The Girl on the Train', author: 'Paula Hawkins', genre: 'thriller', description: 'A psychological thriller told from three perspectives about obsession and deception.' },
      { title: 'Big Little Lies', author: 'Liane Moriarty', genre: 'mystery', description: 'A mystery drama about three women whose lives unravel to the point of murder.' },
      { title: 'The Thursday Murder Club', author: 'Richard Osman', genre: 'mystery', description: 'Four unlikely friends in a retirement village investigate cold cases.' },
      { title: 'In the Woods', author: 'Tana French', genre: 'mystery', description: 'A haunting mystery about a detective investigating a child\'s murder.' },
      
      // Science Fiction
      { title: 'Dune', author: 'Frank Herbert', genre: 'science fiction', description: 'An epic space opera set on the desert planet Arrakis.' },
      { title: 'The Handmaid\'s Tale', author: 'Margaret Atwood', genre: 'science fiction', description: 'A dystopian novel about a totalitarian society that treats women as property.' },
      { title: 'Station Eleven', author: 'Emily St. John Mandel', genre: 'science fiction', description: 'A post-apocalyptic novel about art, memory, and human connection.' },
      { title: 'Klara and the Sun', author: 'Kazuo Ishiguro', genre: 'science fiction', description: 'The story of an artificial friend observing human nature.' },
      { title: 'Project Hail Mary', author: 'Andy Weir', genre: 'science fiction', description: 'A lone astronaut must save humanity from extinction.' },
      
      // Self-Help & Non-Fiction
      { title: 'Atomic Habits', author: 'James Clear', genre: 'self-help', description: 'An easy and proven way to build good habits and break bad ones.' },
      { title: 'The 7 Habits of Highly Effective People', author: 'Stephen Covey', genre: 'self-help', description: 'A guide to personal and professional effectiveness.' },
      { title: 'Educated', author: 'Tara Westover', genre: 'memoir', description: 'A memoir about education, family, and the struggle for self-invention.' },
      { title: 'Sapiens', author: 'Yuval Noah Harari', genre: 'history', description: 'A brief history of humankind from the Stone Age to the present.' },
      { title: 'Becoming', author: 'Michelle Obama', genre: 'memoir', description: 'The former First Lady\'s memoir about her journey from childhood to the White House.' },
      
      // Romance
      { title: 'It Ends with Us', author: 'Colleen Hoover', genre: 'romance', description: 'A contemporary romance dealing with difficult themes of love and resilience.' },
      { title: 'The Hating Game', author: 'Sally Thorne', genre: 'romance', description: 'An enemies-to-lovers office romance.' },
      { title: 'Beach Read', author: 'Emily Henry', genre: 'romance', description: 'Two writers with writer\'s block challenge each other to write outside their comfort zones.' },
      { title: 'Red, White & Royal Blue', author: 'Casey McQuiston', genre: 'romance', description: 'A romance between the First Son of the United States and the Prince of Wales.' },
      { title: 'The Spanish Love Deception', author: 'Elena Armas', genre: 'romance', description: 'A fake dating romance with academic enemies-to-lovers vibes.' },
      
      // Fantasy
      { title: 'The Name of the Wind', author: 'Patrick Rothfuss', genre: 'fantasy', description: 'The first book in the Kingkiller Chronicle about a legendary figure.' },
      { title: 'The Way of Kings', author: 'Brandon Sanderson', genre: 'fantasy', description: 'Epic fantasy in a world of stone and storms.' },
      { title: 'The Priory of the Orange Tree', author: 'Samantha Shannon', genre: 'fantasy', description: 'A standalone epic fantasy about dragons and divided realms.' },
      { title: 'The Invisible Life of Addie LaRue', author: 'V.E. Schwab', genre: 'fantasy', description: 'A woman cursed to be forgotten by everyone she meets.' },
      { title: 'The Ten Thousand Doors of January', author: 'Alix E. Harrow', genre: 'fantasy', description: 'A story about doors to other worlds and the magic of books.' },
      
      // Historical Fiction
      { title: 'The Book Thief', author: 'Markus Zusak', genre: 'historical fiction', description: 'A story about a young girl in Nazi Germany who steals books.' },
      { title: 'All the Light We Cannot See', author: 'Anthony Doerr', genre: 'historical fiction', description: 'Two children\'s lives intersect in occupied France during WWII.' },
      { title: 'The Nightingale', author: 'Kristin Hannah', genre: 'historical fiction', description: 'Two sisters in France during WWII and their struggle to survive.' },
      { title: 'Pachinko', author: 'Min Jin Lee', genre: 'historical fiction', description: 'A multi-generational saga of a Korean family in Japan.' },
      { title: 'The Pillars of the Earth', author: 'Ken Follett', genre: 'historical fiction', description: 'Medieval England and the building of a cathedral.' },
      
      // Literary Fiction
      { title: 'Normal People', author: 'Sally Rooney', genre: 'literary fiction', description: 'The complex relationship between two Irish teenagers.' },
      { title: 'The Goldfinch', author: 'Donna Tartt', genre: 'literary fiction', description: 'A boy\'s journey after surviving a terrorist attack at a museum.' },
      { title: 'A Little Life', author: 'Hanya Yanagihara', genre: 'literary fiction', description: 'Four friends navigating life in New York City.' },
      { title: 'The Kite Runner', author: 'Khaled Hosseini', genre: 'literary fiction', description: 'A story of friendship and redemption set in Afghanistan.' },
      { title: 'Life of Pi', author: 'Yann Martel', genre: 'literary fiction', description: 'A boy stranded on a lifeboat with a Bengal tiger.' },
      
      // Young Adult
      { title: 'The Fault in Our Stars', author: 'John Green', genre: 'young adult', description: 'Two teenagers with cancer fall in love.' },
      { title: 'The Hunger Games', author: 'Suzanne Collins', genre: 'young adult', description: 'A dystopian story about survival and rebellion.' },
      { title: 'Six of Crows', author: 'Leigh Bardugo', genre: 'young adult', description: 'A heist story in a fantasy world.' },
      { title: 'The Perks of Being a Wallflower', author: 'Stephen Chbosky', genre: 'young adult', description: 'A coming-of-age story told through letters.' },
      { title: 'Eleanor & Park', author: 'Rainbow Rowell', genre: 'young adult', description: 'First love between two misfit teenagers.' },
      
      // Horror
      { title: 'The Silent Companion', author: 'Laura Purcell', genre: 'horror', description: 'Victorian gothic horror about a cursed dollhouse.' },
      { title: 'Mexican Gothic', author: 'Silvia Moreno-Garcia', genre: 'horror', description: 'Gothic horror set in 1950s Mexico.' },
      { title: 'The Haunting of Hill House', author: 'Shirley Jackson', genre: 'horror', description: 'Classic psychological horror about a haunted house.' },
      { title: 'Bird Box', author: 'Josh Malerman', genre: 'horror', description: 'Post-apocalyptic horror where sight means death.' },
      { title: 'The Exorcist', author: 'William Peter Blatty', genre: 'horror', description: 'Classic horror about demonic possession.' },
      
      // Business & Economics
      { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', genre: 'psychology', description: 'How the mind makes decisions and judgments.' },
      { title: 'The Lean Startup', author: 'Eric Ries', genre: 'business', description: 'How to build a successful startup through innovation.' },
      { title: 'Good to Great', author: 'Jim Collins', genre: 'business', description: 'What makes companies achieve sustained excellence.' },
      { title: 'The Psychology of Money', author: 'Morgan Housel', genre: 'finance', description: 'Timeless lessons on wealth, greed, and happiness.' },
      { title: 'Freakonomics', author: 'Steven Levitt', genre: 'economics', description: 'Hidden side of everything through economic thinking.' }
    ];

    // Unsplash image collections for book covers
    const coverImages = [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
      'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400',
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
      'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
      'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400',
      'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=400',
      'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400',
      'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400',
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
      'https://images.unsplash.com/photo-1554496350-61b4ab30c07d?w=400',
      'https://images.unsplash.com/photo-1514894780887-121cb2983d5c?w=400',
      'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=400',
      'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400',
      'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=400',
      'https://images.unsplash.com/photo-1588666309990-c64b6dfacab6?w=400',
      'https://images.unsplash.com/photo-1567359781514-3b964e2b04d6?w=400',
      'https://images.unsplash.com/photo-1562690868-60bbe7293e94?w=400',
      'https://images.unsplash.com/photo-1535905557558-afc4877cdf3f?w=400',
      'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=400',
      'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?w=400',
      'https://images.unsplash.com/photo-1553729784-e91953dec042?w=400',
      'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400',
      'https://images.unsplash.com/photo-1615799998603-7c6270a45196?w=400',
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400',
      'https://images.unsplash.com/photo-1526243741027-444d633d7365?w=400',
      'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400'
    ];

    const books: Book[] = [];
    
    // Create 100 books by cycling through our data and generating variations
    for (let i = 0; i < 100; i++) {
      const baseBook = bookData[i % bookData.length];
      const bookNumber = Math.floor(i / bookData.length) + 1;
      
      // Add variation to titles if we're repeating
      const title = bookNumber > 1 ? `${baseBook.title} ${bookNumber}` : baseBook.title;
      
      const book = await booksService.create({
        title,
        author: baseBook.author,
        isbn: `978-${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        description: baseBook.description,
        cover_image_url: coverImages[i % coverImages.length],
        genre: baseBook.genre,
        page_count: Math.floor(Math.random() * 400) + 150,
        published_date: new Date(
          2020 + Math.floor(Math.random() * 4),
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1
        ).toISOString(),
        tag_ids: []
      });
      
      books.push(book);
    }
    
    // Create sample clubs
    const clubs = await Promise.all([
      clubService.create({
        name: 'The Mystery Solvers',
        description: 'A club dedicated to unraveling the best mystery and thriller novels.',
        cover_image_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600',
        is_private: false
      }, userId),
      clubService.create({
        name: 'Sci-Fi Explorers',
        description: 'Journey through galaxies and alternate realities with fellow science fiction enthusiasts.',
        cover_image_url: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=600',
        is_private: false
      }, userId),
      clubService.create({
        name: 'Romance Readers United',
        description: 'Celebrating love stories in all their forms.',
        cover_image_url: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600',
        is_private: false
      }, userId),
      clubService.create({
        name: 'Fantasy & Magic',
        description: 'Dive into magical worlds and epic adventures.',
        cover_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600',
        is_private: false
      }, userId)
    ]);
    
    console.log('Sample data created successfully!');
    console.log(`Created ${books.length} books and ${clubs.length} clubs`);
    
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await app.close();
  }
}

seedData();
