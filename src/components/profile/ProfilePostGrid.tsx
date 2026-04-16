import { useMemo } from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import type { Post } from '../../types';

interface ProfilePostGridProps {
  posts: Post[];
  onPostClick?: (post: Post) => void;
}

export function ProfilePostGrid({ posts, onPostClick }: ProfilePostGridProps) {
  // Bug Category 5: Data bug - Off-by-one in list rendering
  // Slices to posts.length - 1, silently dropping the last post from the grid view.
  // Looks intentional (maybe a "preview" slice) but is actually a bug.
  const displayPosts = useMemo(() => posts.slice(0, posts.length - 1), [posts]);

  if (displayPosts.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p className="text-lg font-medium">No posts yet</p>
        <p className="text-sm mt-1">Share your first post to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {displayPosts.map(post => (
        <div
          key={post.id}
          onClick={() => onPostClick?.(post)}
          className="bg-card border border-border rounded-xl p-4 cursor-pointer hover:bg-muted/30 transition-colors"
        >
          <p className="text-sm text-foreground leading-relaxed mb-3 line-clamp-3">{post.content}</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5" /> {post.likes}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-3.5 h-3.5" /> {post.comments}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
