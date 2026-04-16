import { useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useNotificationStore } from '../store/useNotificationStore';
import { NotificationItem } from '../components/notifications/NotificationItem';
import { Skeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';

export function NotificationsPage() {
  const { notifications, isLoading, unreadCount, fetchNotifications, markAsRead } = useNotificationStore();

  // Bug Category 1: Missing dependency - fetchNotifications not in dep array
  // If fetchNotifications reference changes (e.g. store rehydrates), this won't re-run
  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAllRead = () => {
    notifications.filter(n => !n.read).forEach(n => markAsRead(n.id));
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 md:px-0">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6" />
          <h2 className="text-2xl font-bold">Notifications</h2>
          {unreadCount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllRead}>
            Mark all read
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3">
              <Skeleton className="w-9 h-9 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No notifications yet</p>
          <p className="text-sm mt-1">When someone interacts with you, it'll show up here.</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border">
          {notifications.map(n => (
            <NotificationItem key={n.id} notification={n} onRead={markAsRead} />
          ))}
        </div>
      )}
    </div>
  );
}
