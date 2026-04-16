import type { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <div className="flex flex-1 max-w-[1400px] w-full mx-auto relative">
        <Sidebar />
        <main className="flex-1 shrink w-full border-r border-border min-h-full">
          {children}
        </main>
        
        {/* Right Rail (Trending, Suggestions) */}
        <aside className="w-80 hidden lg:block p-6 sticky top-[65px] h-[calc(100vh-65px)]">
          <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
            <h3 className="font-bold mb-4">Trending Topics</h3>
            <div className="space-y-4">
              <div className="cursor-pointer group">
                <p className="text-xs text-muted-foreground">Technology</p>
                <p className="font-medium group-hover:text-primary transition-colors">#React19</p>
                <p className="text-xs text-muted-foreground">12.5k posts</p>
              </div>
              <div className="cursor-pointer group">
                <p className="text-xs text-muted-foreground">Design</p>
                <p className="font-medium group-hover:text-primary transition-colors">#UIUX</p>
                <p className="text-xs text-muted-foreground">8.2k posts</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
