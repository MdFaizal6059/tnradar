import { WeatherModel } from '@/types/weather';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Thermometer, Wind, Droplets } from 'lucide-react';

interface ModelComparisonProps {
  models: WeatherModel[];
  selectedModel: string;
  onModelSelect: (modelId: string) => void;
}

export const ModelComparison = ({ models, selectedModel, onModelSelect }: ModelComparisonProps) => {
  const currentModel = models.find(m => m.id === selectedModel);

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-display font-semibold text-foreground">
            Model Comparison
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Compare forecasts from different global weather models
          </p>
        </div>
        <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
          Demo Data
        </span>
      </div>

      <Tabs value={selectedModel} onValueChange={onModelSelect} className="w-full">
        <TabsList className="grid grid-cols-4 w-full bg-secondary/50 p-1 h-auto">
          {models.map((model) => (
            <TabsTrigger
              key={model.id}
              value={model.id}
              className={cn(
                "flex flex-col items-center gap-1 py-3 px-2",
                "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                "transition-all duration-200"
              )}
            >
              <span className="text-lg">{model.flag}</span>
              <span className="text-xs font-medium">{model.name}</span>
              <span className="text-[10px] opacity-70 hidden sm:block">{model.country}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {models.map((model) => (
          <TabsContent key={model.id} value={model.id} className="mt-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Date</th>
                    <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">
                      <div className="flex items-center justify-center gap-1.5">
                        <Thermometer className="h-4 w-4" />
                        <span className="hidden sm:inline">Temp</span>
                      </div>
                    </th>
                    <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">
                      <div className="flex items-center justify-center gap-1.5">
                        <Wind className="h-4 w-4" />
                        <span className="hidden sm:inline">Wind</span>
                      </div>
                    </th>
                    <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">
                      <div className="flex items-center justify-center gap-1.5">
                        <Wind className="h-4 w-4" />
                        <span className="hidden sm:inline">Gusts</span>
                      </div>
                    </th>
                    <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">
                      <div className="flex items-center justify-center gap-1.5">
                        <Droplets className="h-4 w-4" />
                        <span className="hidden sm:inline">Rain</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {model.forecast.map((day, index) => (
                    <tr 
                      key={day.date} 
                      className={cn(
                        "border-b border-border/30 hover:bg-white/5 transition-colors",
                        index === 0 && "bg-primary/5"
                      )}
                    >
                      <td className="py-3 px-2">
                        <div>
                          <p className="font-medium text-foreground">
                            {index === 0 ? 'Today' : format(parseISO(day.date), 'EEE')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(parseISO(day.date), 'MMM d')}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span className="font-semibold text-foreground">{day.temperature}°C</span>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span className="text-muted-foreground">{day.windSpeed} km/h</span>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span className="text-muted-foreground">{day.windGusts} km/h</span>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-sm",
                          day.rainProbability > 60 && "bg-rainy/20 text-rainy",
                          day.rainProbability > 30 && day.rainProbability <= 60 && "bg-yellow-500/20 text-yellow-400",
                          day.rainProbability <= 30 && "text-muted-foreground"
                        )}>
                          {day.rainProbability}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
