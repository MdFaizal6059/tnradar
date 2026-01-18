import { MapPin, CloudSun, Activity, Layers } from 'lucide-react';

export const WelcomeState = () => {
  return (
    <div className="text-center py-16 animate-fade-in">
      <div className="relative inline-block mb-8">
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150" />
        <div className="relative">
          <CloudSun className="h-24 w-24 text-primary mx-auto animate-float" />
        </div>
      </div>
      
      <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
        Welcome to <span className="text-gradient">TN Radar</span>
      </h2>
      <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
        Your multi-model global weather and disaster intelligence platform
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
        <FeatureCard 
          icon={<CloudSun className="h-6 w-6" />}
          title="Real-time Weather"
          description="Accurate current conditions and forecasts"
        />
        <FeatureCard 
          icon={<Layers className="h-6 w-6" />}
          title="Multi-Model"
          description="Compare GFS, ECMWF, ICON models"
        />
        <FeatureCard 
          icon={<Activity className="h-6 w-6" />}
          title="Disaster Tracking"
          description="Cyclones, earthquakes, tsunamis"
        />
      </div>
      
      <div className="mt-10 flex items-center justify-center gap-2 text-muted-foreground">
        <MapPin className="h-5 w-5 text-primary" />
        <span>Search for a city above to get started</span>
      </div>
    </div>
  );
};

const FeatureCard = ({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) => (
  <div className="glass-card p-4 text-center">
    <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary mb-3">
      {icon}
    </div>
    <h3 className="font-semibold text-foreground mb-1">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);
