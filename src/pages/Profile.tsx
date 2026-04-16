import { useMemo, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { mockPosts } from '../services/mockData';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { ProfileStats } from '../components/profile/ProfileStats';
import { ProfilePostGrid } from '../components/profile/ProfilePostGrid';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import { Modal } from '../components/ui/Modal';
import type { Post } from '../types';

export function ProfilePage() {
  const { user } = useAuthStore();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Bug Category 1: Incorrect memoization
  // userPosts is memoized with no dependencies, so it always returns the same
  // filtered result even if mockPosts were to change (e.g. after creating a post).
  // The empty dep array means this never recomputes.
  const userPosts = useMemo(() => {
    return mockPosts.filter(p => p.author.id === user?.id);
  }, []);

  const stats = useMemo(() => ({
    totalLikes: userPosts.reduce((acc, p) => acc + p.likes, 0),
    totalComments: userPosts.reduce((acc, p) => acc + p.comments, 0),
    totalViews: userPosts.reduce((acc, p) => acc + p.likes * 8, 0),
    engagementRate: userPosts.length
      ? (userPosts.reduce((acc, p) => acc + p.likes + p.comments, 0) / (userPosts.length * 100)) * 100
      : 0,
  }), [userPosts]);

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 md:px-0 space-y-6">
      <ProfileHeader
        user={user}
        postCount={userPosts.length}
        followerCount={1284}
        followingCount={342}
        isOwnProfile
      />

      <ProfileStats {...stats} />

      <Tabs defaultValue="posts">
        <TabsList>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="likes">Likes</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          <ProfilePostGrid posts={userPosts} onPostClick={setSelectedPost} />
        </TabsContent>

        <TabsContent value="likes">
          <div className="text-center py-12 text-muted-foreground text-sm">
            Posts you've liked will appear here.
          </div>
        </TabsContent>

        <TabsContent value="media">
          <div className="text-center py-12 text-muted-foreground text-sm">
            Media posts will appear here.
          </div>
        </TabsContent>
      </Tabs>

      <Modal
        isOpen={!!selectedPost}
        onClose={() => setSelectedPost(null)}
        title="Post Detail"
      >
        {selectedPost && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img src={selectedPost.author.avatar} alt={selectedPost.author.name} className="w-9 h-9 rounded-full" />
              <div>
                <p className="font-semibold text-sm">{selectedPost.author.name}</p>
                <p className="text-xs text-muted-foreground">{selectedPost.author.handle}</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed">{selectedPost.content}</p>
            <div className="flex gap-4 text-sm text-muted-foreground pt-2 border-t border-border">
              <span>{selectedPost.likes} likes</span>
              <span>{selectedPost.comments} comments</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
