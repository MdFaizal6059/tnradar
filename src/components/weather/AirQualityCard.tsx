import { Wind, Droplets, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { AirQuality } from '@/types/weather';
import { cn } from '@/lib/utils';

interface AirQualityCardProps {
  airQuality: AirQuality;
}

const getAqiColor = (category: AirQuality['aqiCategory']) => {
  switch (category) {
    case 'good':
      return 'text-green-400 bg-green-500/20 border-green-500/30';
    case 'fair':
      return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
    case 'moderate':
      return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
    case 'poor':
      return 'text-red-400 bg-red-500/20 border-red-500/30';
    case 'very-poor':
      return 'text-purple-400 bg-purple-500/20 border-purple-500/30';
    case 'hazardous':
      return 'text-rose-500 bg-rose-500/20 border-rose-500/30';
    default:
      return 'text-muted-foreground bg-muted/20 border-muted/30';
  }
};

const getAqiIcon = (category: AirQuality['aqiCategory']) => {
  switch (category) {
    case 'good':
      return <CheckCircle className="h-8 w-8" />;
    case 'fair':
    case 'moderate':
      return <Info className="h-8 w-8" />;
    case 'poor':
    case 'very-poor':
    case 'hazardous':
      return <AlertTriangle className="h-8 w-8" />;
    default:
      return <Wind className="h-8 w-8" />;
  }
};

const getAqiLabel = (category: AirQuality['aqiCategory']) => {
  switch (category) {
    case 'good':
      return 'Good';
    case 'fair':
      return 'Fair';
    case 'moderate':
      return 'Moderate';
    case 'poor':
      return 'Poor';
    case 'very-poor':
      return 'Very Poor';
    case 'hazardous':
      return 'Hazardous';
    default:
      return 'Unknown';
  }
};

const getHealthAdvice = (category: AirQuality['aqiCategory']) => {
  switch (category) {
    case 'good':
      return 'Air quality is satisfactory. Enjoy outdoor activities!';
    case 'fair':
      return 'Air quality is acceptable. Sensitive individuals should limit prolonged outdoor exertion.';
    case 'moderate':
      return 'Members of sensitive groups may experience health effects. Consider reducing outdoor activities.';
    case 'poor':
      return 'Everyone may begin to experience health effects. Limit outdoor activities.';
    case 'very-poor':
      return 'Health alert: everyone may experience serious health effects. Avoid outdoor activities.';
    case 'hazardous':
      return 'Health emergency: the entire population is at risk. Stay indoors.';
    default:
      return 'Air quality data is being analyzed.';
  }
};

const PollutantCard = ({ 
  label, 
  value, 
  unit, 
  icon: Icon 
}: { 
  label: string; 
  value: number; 
  unit: string; 
  icon: React.ElementType;
}) => (
  <div className="glass-card p-4 flex flex-col items-center text-center">
    <Icon className="h-5 w-5 text-primary mb-2" />
    <span className="text-xs text-muted-foreground mb-1">{label}</span>
    <span className="text-lg font-semibold text-foreground">
      {value.toFixed(1)}
    </span>
    <span className="text-xs text-muted-foreground">{unit}</span>
  </div>
);

export const AirQualityCard = ({ airQuality }: AirQualityCardProps) => {
  const aqiColorClass = getAqiColor(airQuality.aqiCategory);

  return (
    <div className="space-y-6">
      {/* Main AQI Display */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-semibold text-foreground">
            Air Quality Index
          </h2>
          <span className="text-xs text-muted-foreground">Live Data</span>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* AQI Circle */}
          <div className={cn(
            "flex flex-col items-center justify-center w-40 h-40 rounded-full border-4",
            aqiColorClass
          )}>
            <div className={cn("mb-1", aqiColorClass.split(' ')[0])}>
              {getAqiIcon(airQuality.aqiCategory)}
            </div>
            <span className="text-4xl font-bold text-foreground">
              {airQuality.aqi}
            </span>
            <span className={cn("text-sm font-medium", aqiColorClass.split(' ')[0])}>
              {getAqiLabel(airQuality.aqiCategory)}
            </span>
          </div>

          {/* Health Advice */}
          <div className="flex-1">
            <div className={cn(
              "p-4 rounded-xl border",
              aqiColorClass
            )}>
              <div className="flex items-start gap-3">
                <AlertTriangle className={cn("h-5 w-5 mt-0.5 flex-shrink-0", aqiColorClass.split(' ')[0])} />
                <div>
                  <h3 className="font-medium text-foreground mb-1">Health Advisory</h3>
                  <p className="text-sm text-muted-foreground">
                    {getHealthAdvice(airQuality.aqiCategory)}
                  </p>
                </div>
              </div>
            </div>

            {/* AQI Scales */}
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="glass-card p-3">
                <span className="text-xs text-muted-foreground block mb-1">US AQI</span>
                <span className="text-xl font-semibold text-foreground">{airQuality.usAqi}</span>
              </div>
              <div className="glass-card p-3">
                <span className="text-xs text-muted-foreground block mb-1">European AQI</span>
                <span className="text-xl font-semibold text-foreground">{airQuality.europeanAqi}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pollutants Grid */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-display font-semibold text-foreground mb-4">
          Pollutant Concentrations
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <PollutantCard 
            label="PM2.5" 
            value={airQuality.pm25} 
            unit="μg/m³" 
            icon={Droplets} 
          />
          <PollutantCard 
            label="PM10" 
            value={airQuality.pm10} 
            unit="μg/m³" 
            icon={Droplets} 
          />
          <PollutantCard 
            label="Ozone (O₃)" 
            value={airQuality.o3} 
            unit="μg/m³" 
            icon={Wind} 
          />
          <PollutantCard 
            label="NO₂" 
            value={airQuality.no2} 
            unit="μg/m³" 
            icon={Wind} 
          />
          <PollutantCard 
            label="SO₂" 
            value={airQuality.so2} 
            unit="μg/m³" 
            icon={Wind} 
          />
          <PollutantCard 
            label="CO" 
            value={airQuality.co} 
            unit="μg/m³" 
            icon={Wind} 
          />
        </div>
      </div>

      {/* AQI Scale Legend */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-display font-semibold text-foreground mb-4">
          AQI Scale Reference
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {[
            { label: 'Good', range: '0-50', color: 'bg-green-500' },
            { label: 'Fair', range: '51-100', color: 'bg-yellow-500' },
            { label: 'Moderate', range: '101-150', color: 'bg-orange-500' },
            { label: 'Poor', range: '151-200', color: 'bg-red-500' },
            { label: 'Very Poor', range: '201-300', color: 'bg-purple-500' },
            { label: 'Hazardous', range: '301+', color: 'bg-rose-600' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className={cn("w-3 h-3 rounded-full", item.color)} />
              <div>
                <span className="text-xs font-medium text-foreground">{item.label}</span>
                <span className="text-xs text-muted-foreground block">{item.range}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};