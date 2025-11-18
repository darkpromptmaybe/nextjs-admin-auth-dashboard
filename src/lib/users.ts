import { Pool } from 'pg';
import { getPool } from './database';

export interface User {
  id: number;
  email: string;
  name: string | null;
  role: string;
  created_at: Date;
  updated_at: Date;
  last_login?: Date | null;
  is_active: boolean;
}

export interface CreateUserData {
  email: string;
  name?: string;
  role?: string;
  password?: string;
}

export interface UpdateUserData {
  name?: string;
  role?: string;
  is_active?: boolean;
}

// Create enhanced users table with additional fields
export async function createUsersTableEnhanced() {
  try {
    const pool = getPool();
    const client = await pool.connect();
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        role VARCHAR(50) DEFAULT 'user',
        password_hash VARCHAR(255),
        is_active BOOLEAN DEFAULT true,
        email_verified BOOLEAN DEFAULT false,
        last_login TIMESTAMP,
        login_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create indexes for better performance
    await client.query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active)`);
    
    // Create user activities table for audit trail
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_activities (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        action VARCHAR(100) NOT NULL,
        description TEXT,
        ip_address INET,
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await client.query(`CREATE INDEX IF NOT EXISTS idx_activities_user_id ON user_activities(user_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_activities_created_at ON user_activities(created_at)`);
    
    client.release();
    
    return {
      success: true,
      message: 'Enhanced users table and activities table created successfully'
    };
  } catch (error) {
    console.error('Error creating enhanced users table:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to create enhanced users table'
    };
  }
}

// Get all users with pagination and filtering
export async function getUsers(options: {
  page?: number;
  limit?: number;
  role?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
} = {}) {
  try {
    const {
      page = 1,
      limit = 10,
      role,
      search,
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = options;
    
    const pool = getPool();
    const client = await pool.connect();
    
    let whereClause = 'WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;
    
    if (role) {
      whereClause += ` AND role = $${paramIndex}`;
      params.push(role);
      paramIndex++;
    }
    
    if (search) {
      whereClause += ` AND (name ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }
    
    const offset = (page - 1) * limit;
    
    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM users ${whereClause}`;
    const countResult = await client.query(countQuery, params);
    const total = parseInt(countResult.rows[0].total);
    
    // Get users
    const usersQuery = `
      SELECT id, email, name, role, is_active, email_verified, last_login, login_count, created_at, updated_at
      FROM users 
      ${whereClause}
      ORDER BY ${sortBy} ${sortOrder}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    params.push(limit, offset);
    
    const usersResult = await client.query(usersQuery, params);
    
    client.release();
    
    return {
      success: true,
      users: usersResult.rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Error getting users:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      users: [],
      pagination: { total: 0, page: 1, limit: 10, totalPages: 0 }
    };
  }
}

// Get single user by ID
export async function getUserById(id: number) {
  try {
    const pool = getPool();
    const client = await pool.connect();
    
    const result = await client.query(
      'SELECT id, email, name, role, is_active, email_verified, last_login, login_count, created_at, updated_at FROM users WHERE id = $1',
      [id]
    );
    
    client.release();
    
    if (result.rows.length === 0) {
      return {
        success: false,
        message: 'User not found'
      };
    }
    
    return {
      success: true,
      user: result.rows[0]
    };
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Create new user
export async function createUser(userData: CreateUserData) {
  try {
    const pool = getPool();
    const client = await pool.connect();
    
    const { email, name, role = 'user' } = userData;
    
    const result = await client.query(
      `INSERT INTO users (email, name, role) 
       VALUES ($1, $2, $3) 
       RETURNING id, email, name, role, is_active, created_at`,
      [email, name, role]
    );
    
    client.release();
    
    return {
      success: true,
      user: result.rows[0],
      message: 'User created successfully'
    };
  } catch (error) {
    console.error('Error creating user:', error);
    
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return {
        success: false,
        error: 'Email already exists',
        message: 'A user with this email already exists'
      };
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to create user'
    };
  }
}

// Update user
export async function updateUser(id: number, userData: UpdateUserData) {
  try {
    const pool = getPool();
    const client = await pool.connect();
    
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;
    
    if (userData.name !== undefined) {
      fields.push(`name = $${paramIndex}`);
      values.push(userData.name);
      paramIndex++;
    }
    
    if (userData.role !== undefined) {
      fields.push(`role = $${paramIndex}`);
      values.push(userData.role);
      paramIndex++;
    }
    
    if (userData.is_active !== undefined) {
      fields.push(`is_active = $${paramIndex}`);
      values.push(userData.is_active);
      paramIndex++;
    }
    
    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    
    if (fields.length === 1) { // Only updated_at
      return {
        success: false,
        message: 'No fields to update'
      };
    }
    
    values.push(id);
    
    const query = `
      UPDATE users 
      SET ${fields.join(', ')} 
      WHERE id = $${paramIndex}
      RETURNING id, email, name, role, is_active, updated_at
    `;
    
    const result = await client.query(query, values);
    
    client.release();
    
    if (result.rows.length === 0) {
      return {
        success: false,
        message: 'User not found'
      };
    }
    
    return {
      success: true,
      user: result.rows[0],
      message: 'User updated successfully'
    };
  } catch (error) {
    console.error('Error updating user:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to update user'
    };
  }
}

// Delete user
export async function deleteUser(id: number) {
  try {
    const pool = getPool();
    const client = await pool.connect();
    
    const result = await client.query(
      'DELETE FROM users WHERE id = $1 RETURNING email',
      [id]
    );
    
    client.release();
    
    if (result.rows.length === 0) {
      return {
        success: false,
        message: 'User not found'
      };
    }
    
    return {
      success: true,
      message: `User ${result.rows[0].email} deleted successfully`
    };
  } catch (error) {
    console.error('Error deleting user:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to delete user'
    };
  }
}

// Log user activity
export async function logUserActivity(userId: number, action: string, description?: string, ipAddress?: string, userAgent?: string) {
  try {
    const pool = getPool();
    const client = await pool.connect();
    
    await client.query(
      'INSERT INTO user_activities (user_id, action, description, ip_address, user_agent) VALUES ($1, $2, $3, $4, $5)',
      [userId, action, description, ipAddress, userAgent]
    );
    
    client.release();
    
    return { success: true };
  } catch (error) {
    console.error('Error logging user activity:', error);
    return { success: false };
  }
}

// Get user activities
export async function getUserActivities(userId: number, limit: number = 20) {
  try {
    const pool = getPool();
    const client = await pool.connect();
    
    const result = await client.query(
      'SELECT action, description, ip_address, created_at FROM user_activities WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2',
      [userId, limit]
    );
    
    client.release();
    
    return {
      success: true,
      activities: result.rows
    };
  } catch (error) {
    console.error('Error getting user activities:', error);
    return {
      success: false,
      activities: []
    };
  }
}

// Get user statistics
export async function getUserStatistics() {
  try {
    const pool = getPool();
    const client = await pool.connect();
    
    const stats = await client.query(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(*) FILTER (WHERE is_active = true) as active_users,
        COUNT(*) FILTER (WHERE is_active = false) as inactive_users,
        COUNT(*) FILTER (WHERE role = 'admin') as admin_users,
        COUNT(*) FILTER (WHERE role = 'user') as regular_users,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') as new_users_30d,
        COUNT(*) FILTER (WHERE last_login >= NOW() - INTERVAL '7 days') as active_users_7d
      FROM users
    `);
    
    client.release();
    
    return {
      success: true,
      statistics: stats.rows[0]
    };
  } catch (error) {
    console.error('Error getting user statistics:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      statistics: {}
    };
  }
}