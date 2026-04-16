import { Bell, Search, Sun, Moon, LogOut } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useAuthStore } from '../../store/useAuthStore';
import { useNotificationStore } from '../../store/useNotificationStore';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NotificationItem } from '../notifications/NotificationItem';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuthStore();
  const { notifications, unreadCount, fetchNotifications, markAsRead } = useNotificationStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Bug Category 3: CSS/Layout - sticky header has no z-index
  // The notification dropdown uses z-40, but the header itself has no z-index class.
  // When PostCards have hover states or images that create stacking contexts,
  // the header scrolls behind them. The dropdown also has no portal, so it can
  // get clipped by overflow:hidden on parent containers at certain viewport sizes.

  return (
    <header className="sticky top-0 bg-background/80 backdrop-blur-md border-b border-border py-3 px-6 flex justify-between items-center transition-colors">
      <div className="flex items-center gap-4">
        <h1
          className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent cursor-pointer"
          onClick={() => navigate('/')}
        >
          Nexus
        </h1>
        <div className="relative hidden md:flex items-center">
          <Search className="w-4 h-4 absolute left-3 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            onFocus={() => navigate('/search')}
            readOnly
            className="pl-9 pr-4 py-1.5 bg-muted rounded-full text-sm outline-none w-64 border border-transparent focus:border-ring transition-all cursor-pointer"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 relative">
        <button onClick={toggleTheme} className="p-2 hover:bg-muted rounded-full transition-colors">
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <div className="relative">
          <button
            onClick={() => { setShowNotifications(v => !v); setShowUserMenu(false); }}
            className="p-2 hover:bg-muted rounded-full transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-destructive rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute top-12 right-0 w-80 bg-card border border-border rounded-xl shadow-xl z-40 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <h3 className="font-semibold text-sm">Notifications</h3>
                <button
                  onClick={() => { navigate('/notifications'); setShowNotifications(false); }}
                  className="text-xs text-primary hover:underline"
                >
                  See all
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">No notifications</p>
                ) : (
                  notifications.slice(0, 5).map(n => (
                    <NotificationItem key={n.id} notification={n} onRead={(id) => { markAsRead(id); }} />
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          {user && (
            <img
              src={user.avatar}
              alt="Avatar"
              onClick={() => { setShowUserMenu(v => !v); setShowNotifications(false); }}
              className="w-8 h-8 rounded-full ring-2 ring-primary cursor-pointer"
            />
          )}

          {showUserMenu && (
            <div className="absolute top-12 right-0 w-48 bg-card border border-border rounded-xl shadow-xl z-40 overflow-hidden">
              <button
                onClick={() => { navigate('/profile'); setShowUserMenu(false); }}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-muted transition-colors"
              >
                View Profile
              </button>
              <button
                onClick={() => { navigate('/settings'); setShowUserMenu(false); }}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-muted transition-colors"
              >
                Settings
              </button>
              <div className="border-t border-border" />
              <button
                onClick={() => { logout(); navigate('/login'); }}
                className="w-full text-left px-4 py-2.5 text-sm text-destructive hover:bg-muted transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
