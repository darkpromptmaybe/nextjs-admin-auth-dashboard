import { Pool } from 'pg';

let pool: Pool | null = null;

export function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });
  }
  return pool;
}

export async function testDatabaseConnection() {
  try {
    const pool = getPool();
    const client = await pool.connect();
    
    // Test basic connection
    const result = await client.query('SELECT NOW() as current_time, version() as db_version');
    
    client.release();
    
    return {
      success: true,
      timestamp: result.rows[0].current_time,
      version: result.rows[0].db_version,
      message: 'Database connection successful'
    };
  } catch (error) {
    console.error('Database connection error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Database connection failed'
    };
  }
}

export async function createUsersTable() {
  try {
    const pool = getPool();
    const client = await pool.connect();
    
    // Create users table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create an index on email for faster lookups
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
    `);
    
    client.release();
    
    return {
      success: true,
      message: 'Users table created successfully'
    };
  } catch (error) {
    console.error('Error creating users table:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to create users table'
    };
  }
}

export async function getUsersCount() {
  try {
    const pool = getPool();
    const client = await pool.connect();
    
    const result = await client.query('SELECT COUNT(*) as count FROM users');
    
    client.release();
    
    return {
      success: true,
      count: parseInt(result.rows[0].count),
      message: 'Users count retrieved successfully'
    };
  } catch (error) {
    console.error('Error getting users count:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      count: 0,
      message: 'Failed to get users count'
    };
  }
}