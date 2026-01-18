import { CurrentWeather, Location } from '@/types/weather';
import { WeatherIcon } from './WeatherIcon';
import { 
  Droplets, 
  Wind, 
  Gauge, 
  Eye, 
  Compass, 
  Thermometer,
  ArrowUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CurrentWeatherCardProps {
  weather: CurrentWeather;
  location: Location;
}

const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

export const CurrentWeatherCard = ({ weather, location }: CurrentWeatherCardProps) => {
  const bgClass = weather.isDay 
    ? weather.condition === 'rainy' || weather.condition === 'stormy' 
      ? 'weather-gradient-rain' 
      : 'weather-gradient-day'
    : 'weather-gradient-night';

  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl p-6 md:p-8",
      bgClass
    )}>
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent" />
      
      <div className="relative z-10">
        {/* Location */}
        <div className="mb-4">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-white">
            {location.city}
          </h2>
          <p className="text-white/70 text-sm">
            {location.locality && `${location.locality}, `}{location.country}
          </p>
        </div>
        
        {/* Main temperature */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-start">
              <span className="text-7xl md:text-8xl font-display font-bold text-white leading-none">
                {weather.temperature}
              </span>
              <span className="text-3xl md:text-4xl text-white/80 font-light mt-2">°C</span>
            </div>
            <p className="text-white/80 text-lg mt-2">{weather.description}</p>
            <div className="flex items-center gap-2 mt-1 text-white/60">
              <Thermometer className="h-4 w-4" />
              <span className="text-sm">Feels like {weather.feelsLike}°C</span>
            </div>
          </div>
          
          <WeatherIcon 
            condition={weather.condition} 
            size="xl" 
            className="drop-shadow-2xl" 
          />
        </div>
        
        {/* Weather stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard 
            icon={<Droplets className="h-4 w-4" />} 
            label="Humidity" 
            value={`${weather.humidity}%`} 
          />
          <StatCard 
            icon={<Wind className="h-4 w-4" />} 
            label="Wind" 
            value={`${weather.windSpeed} km/h`} 
          />
          <StatCard 
            icon={
              <ArrowUp 
                className="h-4 w-4 transition-transform" 
                style={{ transform: `rotate(${weather.windDirection}deg)` }} 
              />
            } 
            label="Direction" 
            value={getWindDirection(weather.windDirection)} 
          />
          <StatCard 
            icon={<Wind className="h-4 w-4" />} 
            label="Gusts" 
            value={`${weather.windGusts} km/h`} 
          />
          <StatCard 
            icon={<Gauge className="h-4 w-4" />} 
            label="Pressure" 
            value={`${weather.pressure} hPa`} 
          />
          <StatCard 
            icon={<Eye className="h-4 w-4" />} 
            label="Visibility" 
            value={`${weather.visibility} km`} 
          />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ 
  icon, 
  label, 
  value 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string;
}) => (
  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
    <div className="flex items-center gap-2 text-white/60 mb-1">
      {icon}
      <span className="text-xs uppercase tracking-wide">{label}</span>
    </div>
    <p className="text-white font-semibold">{value}</p>
  </div>
);
