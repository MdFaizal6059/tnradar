import { Earthquake } from '@/types/weather';
import { Activity, MapPin, Clock, ArrowDown } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

interface EarthquakeMonitorProps {
  earthquakes: Earthquake[];
}

const getSeverityClass = (severity: Earthquake['severity']): string => {
  const classes = {
    minor: 'severity-low',
    light: 'severity-low',
    moderate: 'severity-medium',
    strong: 'severity-high',
    major: 'severity-extreme',
  };
  return classes[severity];
};

const getMagnitudeColor = (magnitude: number): string => {
  if (magnitude >= 7) return 'text-red-400';
  if (magnitude >= 6) return 'text-orange-400';
  if (magnitude >= 5) return 'text-yellow-400';
  if (magnitude >= 4) return 'text-green-400';
  return 'text-muted-foreground';
};

export const EarthquakeMonitor = ({ earthquakes }: EarthquakeMonitorProps) => {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-orange-500/20">
          <Activity className="h-5 w-5 text-orange-400" />
        </div>
        <div>
          <h3 className="text-lg font-display font-semibold text-foreground">
            Earthquake Monitor
          </h3>
          <p className="text-sm text-muted-foreground">
            Recent seismic activity (M2.5+)
          </p>
        </div>
      </div>

      {earthquakes.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Activity className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>Loading earthquake data...</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
          {earthquakes.map((quake) => (
            <div 
              key={quake.id}
              className={cn(
                "p-4 rounded-xl border transition-colors hover:bg-white/5",
                getSeverityClass(quake.severity)
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn(
                      "text-2xl font-bold font-display",
                      getMagnitudeColor(quake.magnitude)
                    )}>
                      M{quake.magnitude.toFixed(1)}
                    </span>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full border capitalize",
                      getSeverityClass(quake.severity)
                    )}>
                      {quake.severity}
                    </span>
                  </div>
                  
                  <div className="flex items-start gap-1.5 mb-2">
                    <MapPin className="h-3.5 w-3.5 opacity-60 mt-0.5 flex-shrink-0" />
                    <p className="text-sm opacity-90 line-clamp-2">{quake.location}</p>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs opacity-70">
                    <div className="flex items-center gap-1">
                      <ArrowDown className="h-3 w-3" />
                      <span>{quake.depth} km deep</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatDistanceToNow(parseISO(quake.time), { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
