import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  onClear: () => void;
  placeholder?: string;
  isLoading?: boolean;
}

export function SearchBar({ value, onChange, onClear, placeholder = 'Search posts, people...', isLoading }: SearchBarProps) {
  return (
    <div className="relative flex items-center">
      <Search className="absolute left-4 w-4 h-4 text-muted-foreground pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-11 pr-10 py-3 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
        autoFocus
      />
      {isLoading && (
        <div className="absolute right-10 w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      )}
      {value && !isLoading && (
        <button
          onClick={onClear}
          className="absolute right-3 p-1 hover:bg-muted rounded-full transition-colors"
        >
          <X className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      )}
    </div>
  );
}
