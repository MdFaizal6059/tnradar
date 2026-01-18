import { CurrentWeather } from '@/types/weather';
import { Wind, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WindAlertProps {
  weather: CurrentWeather | null;
}

const getWindSeverity = (speed: number, gusts: number) => {
  if (gusts >= 90 || speed >= 70) return { level: 'extreme', message: 'Dangerous wind conditions - take shelter' };
  if (gusts >= 60 || speed >= 50) return { level: 'strong', message: 'High wind warning - secure loose objects' };
  return { level: 'normal', message: 'Normal wind conditions' };
};

export const WindAlert = ({ weather }: WindAlertProps) => {
  if (!weather) return null;

  const severity = getWindSeverity(weather.windSpeed, weather.windGusts);

  return (
    <div className={cn(
      "glass-card p-4 border",
      severity.level === 'extreme' && 'severity-extreme',
      severity.level === 'strong' && 'severity-high',
      severity.level === 'normal' && 'border-border/50'
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-lg",
            severity.level === 'extreme' && 'bg-red-500/20',
            severity.level === 'strong' && 'bg-orange-500/20',
            severity.level === 'normal' && 'bg-wind/20'
          )}>
            {severity.level !== 'normal' ? (
              <AlertTriangle className={cn(
                "h-5 w-5",
                severity.level === 'extreme' && 'text-red-400',
                severity.level === 'strong' && 'text-orange-400'
              )} />
            ) : (
              <Wind className="h-5 w-5 text-wind" />
            )}
          </div>
          <div>
            <h4 className="font-medium text-foreground">Wind Intelligence</h4>
            <p className="text-sm text-muted-foreground">{severity.message}</p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-2xl font-bold font-display text-foreground">{weather.windSpeed}</p>
          <p className="text-xs text-muted-foreground">km/h wind</p>
        </div>
      </div>
      
      <div className="mt-3 flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground">Gusts:</span>
          <span className={cn(
            "font-semibold",
            weather.windGusts >= 60 ? 'text-orange-400' : 'text-foreground'
          )}>
            {weather.windGusts} km/h
          </span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground">Severity:</span>
          <span className={cn(
            "capitalize font-semibold",
            severity.level === 'extreme' && 'text-red-400',
            severity.level === 'strong' && 'text-orange-400',
            severity.level === 'normal' && 'text-green-400'
          )}>
            {severity.level}
          </span>
        </div>
      </div>
    </div>
  );
};
