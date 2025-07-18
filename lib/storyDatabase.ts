// Fake Story Database with Credentials
// This simulates a story/content management database

export interface StoryCredentials {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl: boolean;
}

export interface Story {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  publishedAt: string;
  status: 'draft' | 'published' | 'archived';
  views: number;
  likes: number;
  featured: boolean;
  imageUrl?: string;
  excerpt: string;
  readTime: number; // in minutes
  seoTitle?: string;
  seoDescription?: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

// Fake database credentials (for demonstration purposes)
export const STORY_DB_CREDENTIALS: StoryCredentials = {
  host: 'story-db.apollo-cms.com',
  port: 5432,
  database: 'apollo_stories_prod',
  username: 'apollo_story_user',
  password: 'St0ry_Ap0ll0_2024!',
  ssl: true
};

// Mock story data
export const mockStories: Story[] = [
  {
    id: 'story_001',
    title: 'The Future of AI in Content Creation',
    content: 'Artificial Intelligence is revolutionizing how we create and consume content. From automated writing assistants to AI-generated images, the landscape of digital content is rapidly evolving...',
    author: 'Sarah Chen',
    category: 'Technology',
    tags: ['AI', 'Content Creation', 'Future Tech', 'Digital Marketing'],
    publishedAt: '2024-01-15T10:30:00Z',
    status: 'published',
    views: 15420,
    likes: 342,
    featured: true,
    imageUrl: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg',
    excerpt: 'Exploring how AI is transforming content creation and what it means for creators and businesses.',
    readTime: 8,
    seoTitle: 'AI Content Creation: The Future is Here',
    seoDescription: 'Discover how artificial intelligence is revolutionizing content creation and digital marketing strategies.',
    slug: 'future-ai-content-creation',
    createdAt: '2024-01-10T14:20:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'story_002',
    title: 'Building Scalable Web Applications with Modern Frameworks',
    content: 'In today\'s fast-paced digital world, building scalable web applications is crucial for business success. Modern frameworks like React, Vue, and Angular provide powerful tools...',
    author: 'Michael Rodriguez',
    category: 'Web Development',
    tags: ['React', 'Vue', 'Angular', 'Scalability', 'Web Apps'],
    publishedAt: '2024-01-12T09:15:00Z',
    status: 'published',
    views: 8930,
    likes: 156,
    featured: false,
    imageUrl: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg',
    excerpt: 'A comprehensive guide to building scalable web applications using modern JavaScript frameworks.',
    readTime: 12,
    seoTitle: 'Scalable Web Apps: Modern Framework Guide',
    seoDescription: 'Learn how to build scalable web applications using React, Vue, and Angular frameworks.',
    slug: 'scalable-web-apps-modern-frameworks',
    createdAt: '2024-01-08T16:45:00Z',
    updatedAt: '2024-01-12T09:15:00Z'
  },
  {
    id: 'story_003',
    title: 'The Rise of Remote Work Culture',
    content: 'Remote work has transformed from a perk to a necessity. Companies worldwide are adapting to distributed teams and flexible work arrangements...',
    author: 'Emily Johnson',
    category: 'Business',
    tags: ['Remote Work', 'Company Culture', 'Productivity', 'Work-Life Balance'],
    publishedAt: '2024-01-10T14:22:00Z',
    status: 'published',
    views: 12750,
    likes: 289,
    featured: true,
    imageUrl: 'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg',
    excerpt: 'How remote work is reshaping company culture and employee expectations in the modern workplace.',
    readTime: 6,
    seoTitle: 'Remote Work Culture: The New Normal',
    seoDescription: 'Explore how remote work is transforming business culture and employee productivity.',
    slug: 'rise-remote-work-culture',
    createdAt: '2024-01-05T11:30:00Z',
    updatedAt: '2024-01-10T14:22:00Z'
  },
  {
    id: 'story_004',
    title: 'Sustainable Technology: Green Computing Initiatives',
    content: 'As environmental concerns grow, the tech industry is embracing sustainable practices. Green computing initiatives are becoming essential...',
    author: 'David Park',
    category: 'Environment',
    tags: ['Sustainability', 'Green Tech', 'Environment', 'Computing'],
    publishedAt: '2024-01-08T11:45:00Z',
    status: 'published',
    views: 6420,
    likes: 98,
    featured: false,
    imageUrl: 'https://images.pexels.com/photos/9800029/pexels-photo-9800029.jpeg',
    excerpt: 'Exploring how the technology sector is adopting sustainable practices and green computing solutions.',
    readTime: 10,
    seoTitle: 'Green Computing: Sustainable Technology Solutions',
    seoDescription: 'Learn about sustainable technology practices and green computing initiatives in the tech industry.',
    slug: 'sustainable-technology-green-computing',
    createdAt: '2024-01-03T13:15:00Z',
    updatedAt: '2024-01-08T11:45:00Z'
  },
  {
    id: 'story_005',
    title: 'Cybersecurity Best Practices for Small Businesses',
    content: 'Small businesses are increasingly targeted by cybercriminals. Implementing robust security measures is no longer optional...',
    author: 'Lisa Thompson',
    category: 'Security',
    tags: ['Cybersecurity', 'Small Business', 'Data Protection', 'Security'],
    publishedAt: '2024-01-06T16:30:00Z',
    status: 'published',
    views: 9840,
    likes: 187,
    featured: false,
    imageUrl: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg',
    excerpt: 'Essential cybersecurity practices every small business should implement to protect their data and customers.',
    readTime: 7,
    seoTitle: 'Small Business Cybersecurity: Essential Practices',
    seoDescription: 'Protect your small business with these essential cybersecurity best practices and data protection strategies.',
    slug: 'cybersecurity-best-practices-small-business',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-06T16:30:00Z'
  }
];

// Simulated database connection class
export class StoryDatabase {
  private credentials: StoryCredentials;
  private connected: boolean = false;

  constructor(credentials: StoryCredentials) {
    this.credentials = credentials;
  }

  async connect(): Promise<boolean> {
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate connection success/failure
    const connectionSuccess = Math.random() > 0.1; // 90% success rate
    this.connected = connectionSuccess;
    
    if (connectionSuccess) {
      console.log(`Connected to Story Database at ${this.credentials.host}:${this.credentials.port}`);
    } else {
      console.error('Failed to connect to Story Database');
    }
    
    return connectionSuccess;
  }

  async disconnect(): Promise<void> {
    this.connected = false;
    console.log('Disconnected from Story Database');
  }

  async getAllStories(): Promise<Story[]> {
    if (!this.connected) {
      throw new Error('Database not connected');
    }
    
    // Simulate query delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockStories;
  }

  async getStoryById(id: string): Promise<Story | null> {
    if (!this.connected) {
      throw new Error('Database not connected');
    }
    
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockStories.find(story => story.id === id) || null;
  }

  async getStoriesByCategory(category: string): Promise<Story[]> {
    if (!this.connected) {
      throw new Error('Database not connected');
    }
    
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockStories.filter(story => 
      story.category.toLowerCase() === category.toLowerCase()
    );
  }

  async getFeaturedStories(): Promise<Story[]> {
    if (!this.connected) {
      throw new Error('Database not connected');
    }
    
    await new Promise(resolve => setTimeout(resolve, 250));
    return mockStories.filter(story => story.featured);
  }

  async searchStories(query: string): Promise<Story[]> {
    if (!this.connected) {
      throw new Error('Database not connected');
    }
    
    await new Promise(resolve => setTimeout(resolve, 400));
    const lowercaseQuery = query.toLowerCase();
    
    return mockStories.filter(story =>
      story.title.toLowerCase().includes(lowercaseQuery) ||
      story.content.toLowerCase().includes(lowercaseQuery) ||
      story.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
      story.author.toLowerCase().includes(lowercaseQuery)
    );
  }

  async createStory(storyData: Omit<Story, 'id' | 'createdAt' | 'updatedAt'>): Promise<Story> {
    if (!this.connected) {
      throw new Error('Database not connected');
    }
    
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const newStory: Story = {
      ...storyData,
      id: `story_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockStories.push(newStory);
    return newStory;
  }

  async updateStory(id: string, updates: Partial<Story>): Promise<Story | null> {
    if (!this.connected) {
      throw new Error('Database not connected');
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const storyIndex = mockStories.findIndex(story => story.id === id);
    if (storyIndex === -1) {
      return null;
    }
    
    mockStories[storyIndex] = {
      ...mockStories[storyIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return mockStories[storyIndex];
  }

  async deleteStory(id: string): Promise<boolean> {
    if (!this.connected) {
      throw new Error('Database not connected');
    }
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const storyIndex = mockStories.findIndex(story => story.id === id);
    if (storyIndex === -1) {
      return false;
    }
    
    mockStories.splice(storyIndex, 1);
    return true;
  }

  getConnectionInfo(): StoryCredentials {
    return { ...this.credentials };
  }

  isConnected(): boolean {
    return this.connected;
  }
}

// Export a default instance
export const storyDB = new StoryDatabase(STORY_DB_CREDENTIALS);

// Utility functions
export const connectToStoryDB = async (): Promise<StoryDatabase> => {
  const db = new StoryDatabase(STORY_DB_CREDENTIALS);
  const connected = await db.connect();
  
  if (!connected) {
    throw new Error('Failed to connect to Story Database');
  }
  
  return db;
};

export const getStoryCategories = (): string[] => {
  return [...new Set(mockStories.map(story => story.category))];
};

export const getStoryTags = (): string[] => {
  const allTags = mockStories.flatMap(story => story.tags);
  return [...new Set(allTags)];
};

export const getStoryAuthors = (): string[] => {
  return [...new Set(mockStories.map(story => story.author))];
};