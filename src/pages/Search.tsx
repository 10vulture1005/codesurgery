import { SearchBar } from '../components/search/SearchBar';
import { SearchResults } from '../components/search/SearchResults';
import { useSearch } from '../hooks/useSearch';
import { TrendingUp } from 'lucide-react';

const trendingTopics = [
  { tag: '#React19', count: '12.5k' },
  { tag: '#TypeScript', count: '9.8k' },
  { tag: '#WebDev', count: '8.2k' },
  { tag: '#OpenSource', count: '6.1k' },
  { tag: '#UIUX', count: '5.4k' },
];

export function SearchPage() {
  const { query, setQuery, results, isLoading, clearSearch } = useSearch();

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 md:px-0">
      <h2 className="text-2xl font-bold mb-4">Search</h2>

      <SearchBar
        value={query}
        onChange={setQuery}
        onClear={clearSearch}
        isLoading={isLoading}
      />

      {!query && (
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm">Trending</h3>
          </div>
          <div className="bg-card border border-border rounded-xl divide-y divide-border">
            {trendingTopics.map(({ tag, count }) => (
              <button
                key={tag}
                onClick={() => setQuery(tag.replace('#', ''))}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors text-left"
              >
                <span className="font-medium text-sm">{tag}</span>
                <span className="text-xs text-muted-foreground">{count} posts</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <SearchResults results={results} isLoading={isLoading} query={query} />
    </div>
  );
}
