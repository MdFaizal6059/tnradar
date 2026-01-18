import { Cyclone } from '@/types/weather';
import { CloudLightning, Wind, Gauge, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CycloneTrackerProps {
  cyclones: Cyclone[];
}

const getCategoryColor = (category: number): string => {
  if (category >= 4) return 'severity-extreme';
  if (category >= 3) return 'severity-high';
  if (category >= 2) return 'severity-medium';
  return 'severity-low';
};

const getStatusBadge = (status: Cyclone['status']) => {
  const styles = {
    active: 'bg-red-500/20 text-red-400 border-red-500/30',
    strengthening: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    weakening: 'bg-green-500/20 text-green-400 border-green-500/30',
  };
  return styles[status];
};

export const CycloneTracker = ({ cyclones }: CycloneTrackerProps) => {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-stormy/20 relative">
          <div className="absolute inset-0 bg-stormy/30 rounded-lg animate-ping" />
          <CloudLightning className="h-5 w-5 text-stormy relative" />
        </div>
        <div>
          <h3 className="text-lg font-display font-semibold text-foreground">
            Cyclone Tracker
          </h3>
          <p className="text-sm text-muted-foreground">
            Active tropical storms worldwide
          </p>
        </div>
      </div>

      {cyclones.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <CloudLightning className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>No active cyclones at this time</p>
        </div>
      ) : (
        <div className="space-y-4">
          {cyclones.map((cyclone) => (
            <div 
              key={cyclone.id}
              className={cn(
                "p-4 rounded-xl border",
                getCategoryColor(cyclone.category)
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-lg">{cyclone.name}</h4>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full border",
                      getStatusBadge(cyclone.status)
                    )}>
                      {cyclone.status}
                    </span>
                  </div>
                  <p className="text-sm opacity-80">Category {cyclone.category} Tropical Cyclone</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <Wind className="h-4 w-4 opacity-70" />
                  <div>
                    <p className="text-xs opacity-70">Max Wind</p>
                    <p className="font-semibold">{cyclone.windSpeed} km/h</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Gauge className="h-4 w-4 opacity-70" />
                  <div>
                    <p className="text-xs opacity-70">Pressure</p>
                    <p className="font-semibold">{cyclone.pressure} hPa</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 opacity-70 mt-0.5" />
                <div>
                  <p className="text-xs opacity-70">Affected Regions</p>
                  <p className="text-sm">{cyclone.regions.join(', ')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
