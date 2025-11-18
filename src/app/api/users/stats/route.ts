import { NextRequest, NextResponse } from 'next/server';
import { getUserStatistics, createUsersTableEnhanced } from '@/lib/users';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    if (action === 'setup') {
      // Initialize the enhanced users table
      const setupResult = await createUsersTableEnhanced();
      
      if (!setupResult.success) {
        return NextResponse.json({
          success: false,
          message: 'Failed to setup users table',
          error: setupResult.error
        }, { status: 500 });
      }
      
      // Get initial statistics
      const statsResult = await getUserStatistics();
      
      return NextResponse.json({
        success: true,
        message: 'User management system initialized successfully',
        setup: setupResult,
        statistics: statsResult.statistics
      });
    }
    
    // Default: get user statistics
    const result = await getUserStatistics();
    
    if (!result.success) {
      return NextResponse.json({
        success: false,
        message: 'Failed to get user statistics',
        error: result.error
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      statistics: result.statistics
    });
    
  } catch (error) {
    console.error('Users stats API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}