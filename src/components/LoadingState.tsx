import { Loader2, Radar } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState = ({ message = 'Loading weather data...' }: LoadingStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
        <div className="relative p-4 rounded-full bg-primary/10 border border-primary/30">
          <Radar className="h-12 w-12 text-primary animate-pulse" />
        </div>
      </div>
      <Loader2 className="h-6 w-6 text-primary animate-spin mb-3" />
      <p className="text-muted-foreground text-sm">{message}</p>
    </div>
  );
};
