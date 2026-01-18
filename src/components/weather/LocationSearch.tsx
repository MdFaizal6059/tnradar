import { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Location } from '@/types/weather';
import { cn } from '@/lib/utils';

interface LocationSearchProps {
  onLocationSelect: (location: Location) => void;
  searchLocation: (query: string) => Promise<Location[]>;
  currentLocation?: Location | null;
}

export const LocationSearch = ({ 
  onLocationSelect, 
  searchLocation, 
  currentLocation 
}: LocationSearchProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Location[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (value: string) => {
    setQuery(value);
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    if (value.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      const locations = await searchLocation(value);
      setResults(locations);
      setIsOpen(locations.length > 0);
      setLoading(false);
    }, 300);
  };

  const handleSelect = (location: Location) => {
    onLocationSelect(location);
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search city, country..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          className="pl-10 pr-10 bg-secondary/50 border-border/50 focus:border-primary/50 h-11"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
        )}
      </div>
      
      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full glass-card p-2 z-50 animate-fade-in">
          {results.map((location, index) => (
            <button
              key={`${location.city}-${location.country}-${index}`}
              onClick={() => handleSelect(location)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left",
                "hover:bg-white/10 transition-colors"
              )}
            >
              <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {location.city}
                  {location.locality && <span className="text-muted-foreground">, {location.locality}</span>}
                </p>
                <p className="text-xs text-muted-foreground">{location.country}</p>
              </div>
            </button>
          ))}
        </div>
      )}
      
      {currentLocation && (
        <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 text-primary" />
          <span>
            {currentLocation.city}, {currentLocation.country}
          </span>
        </div>
      )}
    </div>
  );
};
