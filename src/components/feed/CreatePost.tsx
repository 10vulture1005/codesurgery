import { useState, useRef } from 'react';
import { Image, Smile, MapPin, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { Avatar } from '../ui/Avatar';

interface CreatePostProps {
  onPost?: (content: string) => void;
}

export function CreatePost({ onPost }: CreatePostProps) {
  const { user } = useAuthStore();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Bug Category 7: UX - Form loses input on re-render
  // charCount is tracked as separate state, causing an extra re-render on every keystroke.
  // Combined with the parent re-rendering (e.g. feed updating), the textarea can lose focus.
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setCharCount(e.target.value.length);
  };

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting) return;
    setIsSubmitting(true);

    await new Promise(r => setTimeout(r, 800));

    onPost?.(content);
    setContent('');
    setCharCount(0);
    setIsSubmitting(false);
  };

  const remaining = 280 - charCount;

  return (
    <div className="bg-card border border-border rounded-xl p-4 mb-4">
      <div className="flex gap-3">
        {user && <Avatar src={user.avatar} alt={user.name} size="md" />}
        <div className="flex-1">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleChange}
            placeholder="What's on your mind?"
            rows={3}
            className="w-full bg-transparent text-foreground placeholder:text-muted-foreground resize-none outline-none text-sm leading-relaxed"
          />
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
            <div className="flex items-center gap-2 text-muted-foreground">
              <button className="p-1.5 hover:bg-muted rounded-lg transition-colors hover:text-primary">
                <Image className="w-4 h-4" />
              </button>
              <button className="p-1.5 hover:bg-muted rounded-lg transition-colors hover:text-primary">
                <Smile className="w-4 h-4" />
              </button>
              <button className="p-1.5 hover:bg-muted rounded-lg transition-colors hover:text-primary">
                <MapPin className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs font-medium ${remaining < 20 ? 'text-destructive' : 'text-muted-foreground'}`}>
                {remaining}
              </span>
              <button
                onClick={handleSubmit}
                disabled={!content.trim() || isSubmitting || remaining < 0}
                className="px-4 py-1.5 bg-primary text-primary-foreground text-sm font-semibold rounded-full hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
