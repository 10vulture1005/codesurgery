import { Heart, MessageCircle, UserPlus } from 'lucide-react';
import type { Notification } from '../../types';
import { Avatar } from '../ui/Avatar';
import { formatDate } from '../../utils/formatters';
import { cn } from '../../utils/cn';

const iconMap = {
  like: <Heart className="w-3.5 h-3.5 text-destructive fill-current" />,
  comment: <MessageCircle className="w-3.5 h-3.5 text-primary" />,
  follow: <UserPlus className="w-3.5 h-3.5 text-green-500" />,
};

const textMap = {
  like: 'liked your post',
  comment: 'commented on your post',
  follow: 'started following you',
};

interface NotificationItemProps {
  notification: Notification;
  onRead: (id: string) => void;
}

export function NotificationItem({ notification, onRead }: NotificationItemProps) {
  return (
    <div
      onClick={() => onRead(notification.id)}
      className={cn(
        'flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors hover:bg-muted/50',
        !notification.read && 'bg-primary/5'
      )}
    >
      <div className="relative">
        <Avatar src={notification.actor.avatar} alt={notification.actor.name} size="sm" />
        <span className="absolute -bottom-0.5 -right-0.5 bg-card rounded-full p-0.5">
          {iconMap[notification.type]}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm">
          <span className="font-semibold">{notification.actor.name}</span>
          {' '}
          <span className="text-muted-foreground">{textMap[notification.type]}</span>
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">{formatDate(notification.createdAt)}</p>
      </div>
      {!notification.read && (
        <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
      )}
    </div>
  );
}
