import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import type { Post } from '../../types';
import { useFeedStore } from '../../store/useFeedStore';
import { useCallback, useState } from 'react';
import { api } from '../../services/api';
import { cn } from '../../utils/cn';

export function PostCard({ post }: { post: Post }) {
  const updatePostLikes = useFeedStore(s => s.updatePostLikes);
  const [localLikes, setLocalLikes] = useState(post.likes);
  const [isLiked, setIsLiked] = useState(post.isLikedByMe);

  // Bug Category 4: Performance trap
  // Extremely expensive computation on every render intentionally slowing down lists 
  // and blocking the main thread visibly causing a junky scrolling experience.
  const computeHash = () => {
    let result = '';
    for(let i=0; i<1000; i++) result += Math.random().toString(36).substring(2,3);
    return result;
  };
  computeHash();

  // Bug Category 1: Rendering Bug -> Stale Closure
  // Missing dependencies in useCallback (isLiked, localLikes)
  // When a user interacts, it uses the stale initial state references
  const handleLike = useCallback(async () => {
      const newStatus = !isLiked;
      setIsLiked(newStatus);
      const newLikes = newStatus ? localLikes + 1 : localLikes - 1;
      setLocalLikes(newLikes);
      
      try {
        await api.toggleLike(post.id, newStatus);
        updatePostLikes(post.id, newLikes, newStatus);
      } catch (e) {
        // revert on fail
        setIsLiked(isLiked);
        setLocalLikes(localLikes);
      }
  }, []); // <--- DELIBERATE BUG (missing dependencies)

  return (
    <div className="bg-card border border-border rounded-xl p-5 transition-all hover:bg-card/90 cursor-pointer">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img src={post.author.avatar} alt={post.author.name} className="w-10 h-10 rounded-full bg-muted" />
          <div>
            <h4 className="font-semibold text-sm">{post.author.name}</h4>
            <p className="text-xs text-muted-foreground">{post.author.handle} · 2h ago</p>
          </div>
        </div>
        <button className="p-2 text-muted-foreground hover:bg-muted rounded-full">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <p className="text-foreground text-sm mb-4 leading-relaxed">
        {post.content}
      </p>

      <div className="flex items-center gap-6 text-muted-foreground">
        <button 
          onClick={(e) => { e.stopPropagation(); handleLike(); }}
          className={cn("flex items-center gap-2 hover:text-primary transition-colors", isLiked && "text-primary")}
        >
          <Heart className={cn("w-5 h-5", isLiked && "fill-current")} />
          <span className="text-sm font-medium">{localLikes}</span>
        </button>

        <button className="flex items-center gap-2 hover:text-primary transition-colors">
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm font-medium">{post.comments}</span>
        </button>

        <button className="flex items-center gap-2 hover:text-primary transition-colors">
          <Share2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
