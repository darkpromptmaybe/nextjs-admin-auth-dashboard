import { NextRequest, NextResponse } from 'next/server';
import { testDatabaseConnection, createUsersTable, getUsersCount } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    const connectionTest = await testDatabaseConnection();
    
    if (!connectionTest.success) {
      return NextResponse.json({
        success: false,
        message: 'Database connection failed',
        error: connectionTest.error
      }, { status: 500 });
    }

    // Create users table
    const tableCreation = await createUsersTable();
    
    // Get users count
    const usersCount = await getUsersCount();

    return NextResponse.json({
      success: true,
      message: 'Database test completed successfully',
      connection: {
        status: 'Connected',
        timestamp: connectionTest.timestamp,
        version: connectionTest.version
      },
      table: {
        created: tableCreation.success,
        message: tableCreation.message
      },
      users: {
        count: usersCount.count,
        message: usersCount.message
      }
    });

  } catch (error) {
    console.error('Database test API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Database test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();
    
    if (action === 'create-table') {
      const result = await createUsersTable();
      return NextResponse.json(result);
    }
    
    if (action === 'test-connection') {
      const result = await testDatabaseConnection();
      return NextResponse.json(result);
    }
    
    return NextResponse.json({
      success: false,
      message: 'Invalid action'
    }, { status: 400 });

  } catch (error) {
    console.error('Database test POST error:', error);
    return NextResponse.json({
      success: false,
      message: 'Database operation failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}