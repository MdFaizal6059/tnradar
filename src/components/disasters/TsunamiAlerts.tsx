import { TsunamiAlert } from '@/types/weather';
import { Waves, AlertTriangle, Info, Clock } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

interface TsunamiAlertsProps {
  alerts: TsunamiAlert[];
}

const getAlertClass = (level: TsunamiAlert['level']): string => {
  const classes = {
    watch: 'severity-low',
    advisory: 'severity-medium',
    warning: 'severity-extreme',
  };
  return classes[level];
};

const getAlertIcon = (level: TsunamiAlert['level']) => {
  if (level === 'warning') return <AlertTriangle className="h-4 w-4" />;
  return <Info className="h-4 w-4" />;
};

export const TsunamiAlerts = ({ alerts }: TsunamiAlertsProps) => {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-rainy/20">
          <Waves className="h-5 w-5 text-rainy" />
        </div>
        <div>
          <h3 className="text-lg font-display font-semibold text-foreground">
            Tsunami Alerts
          </h3>
          <p className="text-sm text-muted-foreground">
            Global tsunami warning status
          </p>
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Waves className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>No tsunami alerts at this time</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div 
              key={alert.id}
              className={cn(
                "p-4 rounded-xl border",
                getAlertClass(alert.level)
              )}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {getAlertIcon(alert.level)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{alert.region}</h4>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full border uppercase",
                      getAlertClass(alert.level)
                    )}>
                      {alert.level}
                    </span>
                  </div>
                  <p className="text-sm opacity-80 mb-2">{alert.description}</p>
                  <div className="flex items-center gap-1 text-xs opacity-60">
                    <Clock className="h-3 w-3" />
                    <span>Issued {formatDistanceToNow(parseISO(alert.issuedAt), { addSuffix: true })}</span>
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
