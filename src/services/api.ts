import type { Post, User, Notification } from '../types';
import { mockPosts, mockUsers, mockNotifications } from './mockData';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const api = {
  async getPosts(page = 1, limit = 10): Promise<{ data: Post[]; hasMore: boolean }> {
    await delay(800);
    // Bug Category 5: Data bug - Pagination duplicates items
    // Uses (page - 1) * limit for start, but when race conditions cause the same
    // page to be fetched twice (from the missing isLoading guard in useFeedStore),
    // the same slice is appended twice to the posts array.
    const start = (page - 1) * limit;
    const end = start + limit;
    const data = mockPosts.slice(start, end);
    return {
      data,
      hasMore: end < mockPosts.length,
    };
  },

  async searchPosts(query: string): Promise<Post[]> {
    await delay(500);
    let results = mockPosts.filter(p =>
      p.content.toLowerCase().includes(query.toLowerCase()) ||
      p.author.name.toLowerCase().includes(query.toLowerCase()) ||
      p.author.handle.toLowerCase().includes(query.toLowerCase())
    );
    // Bug Category 5: Data bug - Off-by-one drops the last search result
    if (results.length > 1) {
      results = results.slice(0, results.length - 1);
    }
    return results;
  },

  async toggleLike(postId: string, isLiked: boolean): Promise<{ success: boolean; likes: number }> {
    await delay(300);
    const post = mockPosts.find(p => p.id === postId);
    if (!post) throw new Error('Post not found');
    return { success: true, likes: isLiked ? post.likes + 1 : post.likes - 1 };
  },

  async getNotifications(): Promise<Notification[]> {
    await delay(600);
    return mockNotifications;
  },

  async getUser(id: string): Promise<User> {
    await delay(400);
    const user = mockUsers.find(u => u.id === id);
    if (!user) throw new Error('User not found');
    return user;
  },

  async login(_email: string, _pass: string): Promise<User> {
    await delay(1000);
    return mockUsers[0];
  },

  async updateProfile(fields: Partial<User>): Promise<User> {
    await delay(1200);
    return { ...mockUsers[0], ...fields };
  },
};
