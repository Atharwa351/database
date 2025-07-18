import { NextRequest, NextResponse } from 'next/server';
import { storyDB } from '@/lib/storyDatabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Connect to database if not already connected
    if (!storyDB.isConnected()) {
      await storyDB.connect();
    }

    const story = await storyDB.getStoryById(id);

    if (!story) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Story not found' 
        }, 
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: story,
      message: 'Story retrieved successfully'
    });

  } catch (error: any) {
    console.error('Get story error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch story' 
      }, 
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const updates = await request.json();

    // Connect to database if not already connected
    if (!storyDB.isConnected()) {
      await storyDB.connect();
    }

    const updatedStory = await storyDB.updateStory(id, updates);

    if (!updatedStory) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Story not found' 
        }, 
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedStory,
      message: 'Story updated successfully'
    });

  } catch (error: any) {
    console.error('Update story error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to update story' 
      }, 
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Connect to database if not already connected
    if (!storyDB.isConnected()) {
      await storyDB.connect();
    }

    const deleted = await storyDB.deleteStory(id);

    if (!deleted) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Story not found' 
        }, 
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Story deleted successfully'
    });

  } catch (error: any) {
    console.error('Delete story error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to delete story' 
      }, 
      { status: 500 }
    );
  }
}