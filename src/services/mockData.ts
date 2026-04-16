import type { Post, User, Notification } from '../types';

export const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'Alice Johnson',
    handle: '@alicej',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    bio: 'Frontend enthusiast. Building beautiful UIs one component at a time. ☕',
  },
  {
    id: 'u2',
    name: 'Bob Smith',
    handle: '@bobsmith',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
    bio: 'Backend developer. Loves distributed systems and strong coffee.',
  },
  {
    id: 'u3',
    name: 'Clara Diaz',
    handle: '@clarad',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f',
    bio: 'Product designer. Making complex things simple.',
  },
  {
    id: 'u4',
    name: 'David Park',
    handle: '@dpark',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705a',
    bio: 'Open source contributor. TypeScript advocate.',
  },
  {
    id: 'u5',
    name: 'Eva Chen',
    handle: '@evachen',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705b',
    bio: 'ML engineer by day, indie hacker by night.',
  },
];

const postContents = [
  'Just shipped a new feature using React Server Components. The performance gains are incredible — initial load dropped by 40%. Thread 🧵',
  'Hot take: TypeScript strict mode should be the default for every new project. The time you spend fixing types upfront saves 10x in debugging later.',
  'Redesigned our onboarding flow from scratch. Conversion rate went from 12% to 31% just by removing friction. UX matters more than features.',
  'The best code is the code you don\'t write. Spent 3 hours today deleting 500 lines of over-engineered abstractions. Codebase is so much cleaner now.',
  'Tailwind CSS just clicked for me. I resisted it for 2 years. Now I can\'t imagine going back to writing CSS files. The DX is unmatched.',
  'Reminder: your users don\'t care about your tech stack. They care about whether the product solves their problem. Ship faster, iterate more.',
  'Finally got around to reading "A Philosophy of Software Design". If you write code for a living, this book is mandatory. Highly recommend.',
  'Zustand vs Redux in 2024: Zustand wins for 90% of use cases. Less boilerplate, same power, better DX. Only reach for Redux when you truly need it.',
  'Dark mode isn\'t just a preference anymore — it\'s an accessibility feature. Make sure your contrast ratios hold up in both themes.',
  'Spent the morning pair programming with a junior dev. Reminded me how much I take for granted. Teaching is the best way to solidify your own knowledge.',
  'The gap between "it works on my machine" and "it works in production" is where most engineering effort actually goes. Invest in your dev/prod parity.',
  'CSS Grid changed how I think about layout. Flexbox for 1D, Grid for 2D. Once you internalize this, everything becomes cleaner.',
  'Accessibility audit on our app revealed 47 issues. We fixed them all in a sprint. Our screen reader users noticed immediately. Do the audit.',
  'Web performance is a feature. A 1-second delay in page load can reduce conversions by 7%. Measure, optimize, repeat.',
  'Just discovered `useId` hook in React 18. Perfect for generating stable IDs for accessibility attributes. Small API, big impact.',
  'Monorepos are underrated. Once you set up the tooling (Turborepo is great), the DX of sharing code across packages is a game changer.',
  'The best PR review comment I ever got: "This is clever. Can you make it boring instead?" Boring code is maintainable code.',
  'Vite is genuinely the best thing to happen to frontend tooling in years. Cold start in milliseconds. HMR that actually works. No config needed.',
  'Wrote my first Rust program today. Coming from TypeScript, the ownership model is mind-bending but I can already see why people love it.',
  'Reminder that `console.log` debugging is a valid strategy. Sometimes the simplest tool is the right tool. Don\'t let anyone shame you for it.',
];

export const mockPosts: Post[] = Array.from({ length: 45 }).map((_, i) => ({
  id: `p${i}`,
  author: mockUsers[i % mockUsers.length],
  content: postContents[i % postContents.length],
  likes: Math.floor(Math.random() * 500) + 10,
  comments: Math.floor(Math.random() * 80) + 1,
  createdAt: new Date(Date.now() - i * 3600000 * 2).toISOString(),
  isLikedByMe: false,
}));

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'like',
    actor: mockUsers[1],
    postId: 'p0',
    createdAt: new Date(Date.now() - 300000).toISOString(),
    read: false,
  },
  {
    id: 'n2',
    type: 'comment',
    actor: mockUsers[2],
    postId: 'p0',
    createdAt: new Date(Date.now() - 900000).toISOString(),
    read: false,
  },
  {
    id: 'n3',
    type: 'follow',
    actor: mockUsers[3],
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    read: false,
  },
  {
    id: 'n4',
    type: 'like',
    actor: mockUsers[4],
    postId: 'p2',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    read: true,
  },
  {
    id: 'n5',
    type: 'follow',
    actor: mockUsers[1],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    read: true,
  },
  {
    id: 'n6',
    type: 'comment',
    actor: mockUsers[4],
    postId: 'p1',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    read: true,
  },
];
