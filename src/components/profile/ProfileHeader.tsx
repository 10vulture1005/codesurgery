import { useState } from 'react';
import { MapPin, Link2, Calendar } from 'lucide-react';
import type { User } from '../../types';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { formatDate } from '../../utils/formatters';

interface ProfileHeaderProps {
  user: User;
  postCount: number;
  followerCount: number;
  followingCount: number;
  isOwnProfile?: boolean;
}

export function ProfileHeader({
  user,
  postCount,
  followerCount,
  followingCount,
  isOwnProfile = false,
}: ProfileHeaderProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState(followerCount);

  // Bug Category 6: Event handling - double-triggered action
  // No guard against rapid clicks; each click fires the toggle and the API call.
  // Fast double-click toggles state twice, ending up in the original state
  // but with the wrong follower count (incremented/decremented twice).
  const handleFollow = async () => {
    const next = !isFollowing;
    setIsFollowing(next);
    setFollowers(prev => next ? prev + 1 : prev - 1);
    await new Promise(r => setTimeout(r, 400));
  };

  return (
    <div className="relative">
      <div className="h-40 bg-gradient-to-br from-primary/30 via-accent/20 to-primary/10 rounded-xl" />

      <div className="px-4 pb-4">
        <div className="flex items-end justify-between -mt-12 mb-4">
          <Avatar src={user.avatar} alt={user.name} size="xl" className="ring-4 ring-card" />
          <div className="flex gap-2 mb-2">
            {isOwnProfile ? (
              <Button variant="secondary" size="sm">Edit Profile</Button>
            ) : (
              <Button
                variant={isFollowing ? 'secondary' : 'primary'}
                size="sm"
                onClick={handleFollow}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">{user.name}</h1>
            <Badge variant="secondary">Pro</Badge>
          </div>
          <p className="text-muted-foreground text-sm">{user.handle}</p>
          <p className="text-sm leading-relaxed">{user.bio}</p>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-1">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> San Francisco, CA
            </span>
            <span className="flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5" /> nexus.app/u/{user.handle.replace('@', '')}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Joined {formatDate(new Date(Date.now() - 365 * 86400000).toISOString())}
            </span>
          </div>

          <div className="flex gap-6 pt-2 text-sm">
            <span><strong>{postCount}</strong> <span className="text-muted-foreground">Posts</span></span>
            <span><strong>{followers}</strong> <span className="text-muted-foreground">Followers</span></span>
            <span><strong>{followingCount}</strong> <span className="text-muted-foreground">Following</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}
