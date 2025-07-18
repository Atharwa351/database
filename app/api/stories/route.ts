import { NextRequest, NextResponse } from 'next/server';
import { storyDB, Story } from '@/lib/storyDatabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');
    const author = searchParams.get('author');

    // Connect to database if not already connected
    if (!storyDB.isConnected()) {
      await storyDB.connect();
    }

    let stories: Story[] = [];

    if (search) {
      stories = await storyDB.searchStories(search);
    } else if (category) {
      stories = await storyDB.getStoriesByCategory(category);
    } else if (featured === 'true') {
      stories = await storyDB.getFeaturedStories();
    } else {
      stories = await storyDB.getAllStories();
    }

    // Filter by author if specified
    if (author) {
      stories = stories.filter(story => 
        story.author.toLowerCase().includes(author.toLowerCase())
      );
    }

    return NextResponse.json({
      success: true,
      data: stories,
      total: stories.length,
      message: 'Stories retrieved successfully'
    });

  } catch (error: any) {
    console.error('Stories API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch stories',
        data: []
      }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const storyData = await request.json();

    // Connect to database if not already connected
    if (!storyDB.isConnected()) {
      await storyDB.connect();
    }

    // Validate required fields
    const requiredFields = ['title', 'content', 'author', 'category', 'excerpt', 'slug'];
    for (const field of requiredFields) {
      if (!storyData[field]) {
        return NextResponse.json(
          { 
            success: false, 
            error: `Missing required field: ${field}` 
          }, 
          { status: 400 }
        );
      }
    }

    // Set default values
    const newStoryData = {
      ...storyData,
      status: storyData.status || 'draft',
      views: 0,
      likes: 0,
      featured: storyData.featured || false,
      tags: storyData.tags || [],
      readTime: storyData.readTime || Math.ceil(storyData.content.length / 200) // Estimate reading time
    };

    const newStory = await storyDB.createStory(newStoryData);

    return NextResponse.json({
      success: true,
      data: newStory,
      message: 'Story created successfully'
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create story error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to create story' 
      }, 
      { status: 500 }
    );
  }
}