import { Home, UserCircle, Settings, Bookmark, Search, Bell } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { useNotificationStore } from '../../store/useNotificationStore';
import { cn } from '../../utils/cn';

const navItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Search, label: 'Search', href: '/search' },
  { icon: Bell, label: 'Notifications', href: '/notifications' },
  { icon: UserCircle, label: 'Profile', href: '/profile' },
  { icon: Bookmark, label: 'Bookmarks', href: '/bookmarks' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export function Sidebar() {
  const location = useLocation();
  const { unreadCount } = useNotificationStore();

  return (
    // Bug Category 3: Layout overflow bug
    // overflow-y-hidden prevents scrolling to bottom nav items on short viewports.
    // The "Pro Account" card at the bottom gets cut off on laptops with small screens.
    <aside className="w-64 border-r border-border h-[calc(100vh-65px)] flex flex-col justify-between hidden md:flex sticky top-[65px] pt-6 px-4 pb-0 overflow-y-hidden">
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium relative',
              location.pathname === item.href
                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
            {item.label === 'Notifications' && unreadCount > 0 && (
              <span className="ml-auto bg-destructive text-destructive-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>
        ))}
      </nav>

      <div className="p-4 bg-muted/50 rounded-xl mb-4 border border-border/50">
        <p className="text-xs font-semibold mb-1">Nexus Pro ✨</p>
        <p className="text-xs text-muted-foreground mb-3">Get verified, analytics & more.</p>
        <button className="w-full py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-primary/90 transition-colors">
          Upgrade
        </button>
      </div>
    </aside>
  );
}
