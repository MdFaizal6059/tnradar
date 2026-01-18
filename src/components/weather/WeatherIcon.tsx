import { WeatherCondition } from '@/types/weather';
import { Sun, Cloud, CloudRain, CloudSnow, Wind, Thermometer, CloudLightning, CloudFog, CloudSun } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WeatherIconProps {
  condition: WeatherCondition;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 24,
  md: 40,
  lg: 64,
  xl: 96,
};

export const WeatherIcon = ({ condition, size = 'md', animated = true, className }: WeatherIconProps) => {
  const iconSize = sizeMap[size];
  
  const baseClasses = cn(
    'transition-all duration-300',
    animated && 'animate-float',
    className
  );

  const iconProps = {
    size: iconSize,
    strokeWidth: 1.5,
  };

  switch (condition) {
    case 'sunny':
    case 'hot':
      return (
        <div className={cn(baseClasses, 'text-sunny drop-shadow-[0_0_20px_hsl(var(--sunny)/0.5)]')}>
          <Sun {...iconProps} className={cn(animated && 'animate-spin-slow')} />
        </div>
      );
    
    case 'partly-cloudy':
      return (
        <div className={cn(baseClasses, 'text-sunny')}>
          <CloudSun {...iconProps} />
        </div>
      );
    
    case 'cloudy':
      return (
        <div className={cn(baseClasses, 'text-cloudy')}>
          <Cloud {...iconProps} />
        </div>
      );
    
    case 'rainy':
      return (
        <div className={cn(baseClasses, 'text-rainy drop-shadow-[0_0_15px_hsl(var(--rainy)/0.4)]')}>
          <CloudRain {...iconProps} />
        </div>
      );
    
    case 'stormy':
      return (
        <div className={cn(baseClasses, 'text-stormy drop-shadow-[0_0_15px_hsl(var(--stormy)/0.5)]')}>
          <CloudLightning {...iconProps} className={animated ? 'animate-lightning' : ''} />
        </div>
      );
    
    case 'snowy':
    case 'cold':
      return (
        <div className={cn(baseClasses, 'text-snow drop-shadow-[0_0_15px_hsl(var(--snow)/0.3)]')}>
          <CloudSnow {...iconProps} />
        </div>
      );
    
    case 'windy':
      return (
        <div className={cn(baseClasses, 'text-wind')}>
          <Wind {...iconProps} />
        </div>
      );
    
    case 'fog':
      return (
        <div className={cn(baseClasses, 'text-cloudy opacity-70')}>
          <CloudFog {...iconProps} />
        </div>
      );
    
    default:
      return (
        <div className={cn(baseClasses, 'text-muted-foreground')}>
          <Thermometer {...iconProps} />
        </div>
      );
  }
};
