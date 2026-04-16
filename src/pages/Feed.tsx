import { useEffect, useRef } from 'react';
import { useFeedStore } from '../store/useFeedStore';
import { PostCard } from '../components/feed/PostCard';
import { PostSkeleton } from '../components/feed/PostSkeleton';
import { CreatePost } from '../components/feed/CreatePost';
import { Loader2 } from 'lucide-react';

export function FeedPage() {
  const { posts, isLoading, hasMore, fetchNextPage } = useFeedStore();
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (posts.length === 0) {
      fetchNextPage();
    }
  }, []);

  useEffect(() => {
    // Bug Category 6: Event Handling - scroll listener not cleaned up
    // Accumulates on every re-render because hasMore/fetchNextPage change
    // and each effect run adds a NEW listener without removing the old one.
    const handleScroll = () => {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500) {
        if (hasMore) fetchNextPage();
      }
    };
    window.addEventListener('scroll', handleScroll);
    // MISSING cleanup: return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, fetchNextPage]);

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 md:px-0">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Feed</h2>
      </div>

      <CreatePost />

      <div className="space-y-4">
        {posts.length === 0 && isLoading
          ? Array.from({ length: 4 }).map((_, i) => <PostSkeleton key={i} />)
          : posts.map(post => <PostCard key={post.id} post={post} />)
        }
      </div>

      {isLoading && posts.length > 0 && (
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <p className="text-center text-muted-foreground py-8 font-medium text-sm">
          You're all caught up! ✨
        </p>
      )}

      <div ref={sentinelRef} className="h-1" />
    </div>
  );
}
