import { Heart, MessageCircle } from 'lucide-react';
import type { Post } from '../../types';
import { Avatar } from '../ui/Avatar';
import { Skeleton } from '../ui/Skeleton';

interface SearchResultsProps {
  results: Post[];
  isLoading: boolean;
  query: string;
}

export function SearchResults({ results, isLoading, query }: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="space-y-3 mt-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="w-9 h-9 rounded-full" />
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (!query) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p className="text-base font-medium">Search for posts or people</p>
        <p className="text-sm mt-1">Try searching for topics, keywords, or usernames.</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p className="text-base font-medium">No results for "{query}"</p>
        <p className="text-sm mt-1">Try different keywords.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 mt-4">
      <p className="text-xs text-muted-foreground px-1">{results.length} result{results.length !== 1 ? 's' : ''} for "{query}"</p>
      {results.map(post => (
        <div key={post.id} className="bg-card border border-border rounded-xl p-4 hover:bg-muted/30 transition-colors cursor-pointer">
          <div className="flex items-center gap-3 mb-3">
            <Avatar src={post.author.avatar} alt={post.author.name} size="sm" />
            <div>
              <p className="text-sm font-semibold">{post.author.name}</p>
              <p className="text-xs text-muted-foreground">{post.author.handle}</p>
            </div>
          </div>
          <p className="text-sm text-foreground leading-relaxed mb-3">{post.content}</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> {post.likes}</span>
            <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> {post.comments}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
