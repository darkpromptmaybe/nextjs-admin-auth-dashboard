import { NextRequest, NextResponse } from 'next/server';
import { getUsers, createUser, updateUser, deleteUser, getUserById, createUsersTableEnhanced, getUserStatistics } from '@/lib/users';

// GET /api/users - Get all users with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const role = searchParams.get('role') || undefined;
    const search = searchParams.get('search') || undefined;
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = (searchParams.get('sortOrder') || 'DESC') as 'ASC' | 'DESC';
    
    const result = await getUsers({
      page,
      limit,
      role,
      search,
      sortBy,
      sortOrder
    });
    
    if (!result.success) {
      return NextResponse.json({
        success: false,
        message: 'Failed to fetch users',
        error: result.error
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      users: result.users,
      pagination: result.pagination
    });
    
  } catch (error) {
    console.error('Users API GET error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST /api/users - Create new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, role } = body;
    
    if (!email) {
      return NextResponse.json({
        success: false,
        message: 'Email is required'
      }, { status: 400 });
    }
    
    const result = await createUser({ email, name, role });
    
    if (!result.success) {
      return NextResponse.json({
        success: false,
        message: result.message,
        error: result.error
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: true,
      user: result.user,
      message: result.message
    }, { status: 201 });
    
  } catch (error) {
    console.error('Users API POST error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// PUT /api/users - Update user (expects user ID in request body)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, role, is_active } = body;
    
    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'User ID is required'
      }, { status: 400 });
    }
    
    const result = await updateUser(id, { name, role, is_active });
    
    if (!result.success) {
      return NextResponse.json({
        success: false,
        message: result.message,
        error: result.error
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: true,
      user: result.user,
      message: result.message
    });
    
  } catch (error) {
    console.error('Users API PUT error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// DELETE /api/users - Delete user (expects user ID in request body)
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;
    
    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'User ID is required'
      }, { status: 400 });
    }
    
    const result = await deleteUser(id);
    
    if (!result.success) {
      return NextResponse.json({
        success: false,
        message: result.message,
        error: result.error
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: true,
      message: result.message
    });
    
  } catch (error) {
    console.error('Users API DELETE error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}