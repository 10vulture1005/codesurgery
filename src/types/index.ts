export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
}

export interface Post {
  id: string;
  author: User;
  content: string;
  likes: number;
  comments: number;
  createdAt: string;
  isLikedByMe: boolean;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow';
  actor: User;
  postId?: string;
  createdAt: string;
  read: boolean;
}
