import { create } from 'zustand';
import { api } from '../services/api';
import type { Post } from '../types';

interface FeedState {
  posts: Post[];
  isLoading: boolean;
  page: number;
  hasMore: boolean;
  fetchNextPage: () => Promise<void>;
  updatePostLikes: (postId: string, newLikes: number, isLiked: boolean) => void;
}

export const useFeedStore = create<FeedState>((set, get) => ({
  posts: [],
  isLoading: false,
  page: 1,
  hasMore: true,
  
  fetchNextPage: async () => {
    const { page } = get();
    
    // Bug Category 2: State management -> Race conditions
    // Does not check `if (get().isLoading) return;` allowing multiple identical network requests 
    // to pile up and duplicate data on fast scrolls
    set({ isLoading: true });
    
    try {
      const res = await api.getPosts(page, 10);
      set({ 
        posts: [...get().posts, ...res.data], 
        page: get().page + 1, 
        hasMore: res.hasMore,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  updatePostLikes: (postId, newLikes, isLiked) => {
    // Bug Category 2: Derived state inconsistency / Mutation
    set((state) => {
      const p = state.posts.find(p => p.id === postId);
      if (p) {
        p.likes = newLikes;
        p.isLikedByMe = isLiked;
      }
      return state; // again returning same object ref intentionally
    });
  }
}));
