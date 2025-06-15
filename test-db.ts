import { createConnection } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  console.log('Attempting to connect to database...');
  
  try {
    const connection = await createConnection({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: ['src/**/*.entity{.ts,.js}'],
      synchronize: false,
      logging: true,
    });
    
    console.log('Successfully connected to database!');
    
    // List all tables
    const queryRunner = connection.createQueryRunner();
    const tables = await queryRunner.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('\nTables in database:');
    console.log(tables.map((t: any) => t.table_name).join('\n'));
    
    // Check if books table exists and count rows
    const bookCount = await queryRunner.query('SELECT COUNT(*) as count FROM books');
    console.log('\nNumber of books in database:', bookCount[0].count);
    
    // List first few books if any exist
    if (bookCount[0].count > 0) {
      const books = await queryRunner.query('SELECT id, title, author FROM books LIMIT 5');
      console.log('\nSample books:');
      console.log(books);
    }
    
    await connection.close();
    console.log('\nConnection closed');
  } catch (error) {
    console.error('Error connecting to database:', error);
  }
}

testConnection();
