import { ForecastDay } from '@/types/weather';
import { WeatherIcon } from './WeatherIcon';
import { Droplets, Wind } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

interface ForecastCardProps {
  forecast: ForecastDay[];
}

export const ForecastCard = ({ forecast }: ForecastCardProps) => {
  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-display font-semibold text-foreground mb-4">
        7-Day Forecast
      </h3>
      
      <div className="space-y-2">
        {forecast.map((day, index) => (
          <div 
            key={day.date}
            className={cn(
              "flex items-center gap-4 p-3 rounded-xl transition-colors",
              "hover:bg-white/5",
              index === 0 && "bg-primary/10"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Day name */}
            <div className="w-20 flex-shrink-0">
              <p className="font-medium text-foreground">
                {index === 0 ? 'Today' : format(parseISO(day.date), 'EEE')}
              </p>
              <p className="text-xs text-muted-foreground">
                {format(parseISO(day.date), 'MMM d')}
              </p>
            </div>
            
            {/* Weather icon */}
            <div className="flex-shrink-0">
              <WeatherIcon condition={day.condition} size="sm" animated={false} />
            </div>
            
            {/* Rain probability */}
            <div className="flex items-center gap-1.5 w-16 flex-shrink-0">
              <Droplets className="h-3.5 w-3.5 text-rainy" />
              <span className="text-sm text-muted-foreground">{day.rainProbability}%</span>
            </div>
            
            {/* Wind */}
            <div className="flex items-center gap-1.5 w-20 flex-shrink-0 hidden sm:flex">
              <Wind className="h-3.5 w-3.5 text-wind" />
              <span className="text-sm text-muted-foreground">{day.windSpeed} km/h</span>
            </div>
            
            {/* Temperature range */}
            <div className="flex-1 flex items-center justify-end gap-3">
              <span className="text-foreground font-semibold">{day.maxTemp}°</span>
              <div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden hidden sm:block">
                <div 
                  className="h-full bg-gradient-to-r from-cold via-primary to-hot rounded-full"
                  style={{ 
                    width: `${((day.maxTemp - day.minTemp) / 20) * 100}%`,
                    marginLeft: `${((day.minTemp + 10) / 50) * 100}%`
                  }}
                />
              </div>
              <span className="text-muted-foreground">{day.minTemp}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
