import { useState, useEffect } from 'react';
import { useWeather } from '@/hooks/useWeather';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LocationSearch } from '@/components/weather/LocationSearch';
import { CurrentWeatherCard } from '@/components/weather/CurrentWeatherCard';
import { ForecastCard } from '@/components/weather/ForecastCard';
import { ModelComparison } from '@/components/weather/ModelComparison';
import { AirQualityCard } from '@/components/weather/AirQualityCard';
import { CycloneTracker } from '@/components/disasters/CycloneTracker';
import { EarthquakeMonitor } from '@/components/disasters/EarthquakeMonitor';
import { TsunamiAlerts } from '@/components/disasters/TsunamiAlerts';
import { WindAlert } from '@/components/disasters/WindAlert';
import { LoadingState } from '@/components/LoadingState';
import { WelcomeState } from '@/components/WelcomeState';
import { RefreshCw } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('weather');
  const [timeUntilRefresh, setTimeUntilRefresh] = useState(300);
  const {
    location,
    setLocation,
    currentWeather,
    forecast,
    weatherModels,
    selectedModel,
    selectModel,
    cyclones,
    earthquakes,
    tsunamis,
    airQuality,
    loading,
    error,
    searchLocation,
    lastUpdated,
  } = useWeather();

  // Countdown timer for next refresh
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeUntilRefresh((prev) => (prev <= 1 ? 300 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Reset countdown when data updates
  useEffect(() => {
    if (lastUpdated) {
      setTimeUntilRefresh(300);
    }
  }, [lastUpdated]);

  const formatTimeUntilRefresh = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        {/* Search Bar */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <LocationSearch 
            onLocationSelect={setLocation}
            searchLocation={searchLocation}
            currentLocation={location}
          />
          
          {/* Auto-refresh indicator */}
          {location && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <RefreshCw className="h-3 w-3 animate-spin-slow" />
              <span>Auto-refresh in {formatTimeUntilRefresh(timeUntilRefresh)}</span>
              {lastUpdated && (
                <span className="text-muted-foreground/60">
                  • Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="glass-card p-4 mb-6 border-destructive/50 bg-destructive/10">
            <p className="text-destructive text-center">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && <LoadingState />}

        {/* Welcome State */}
        {!loading && !location && <WelcomeState />}

        {/* Content */}
        {!loading && location && currentWeather && (
          <div className="animate-fade-in">
            {/* Current Weather Tab */}
            {activeTab === 'weather' && (
              <div className="space-y-6">
                <CurrentWeatherCard weather={currentWeather} location={location} />
                <WindAlert weather={currentWeather} />
              </div>
            )}

            {/* Forecast Tab */}
            {activeTab === 'forecast' && (
              <div className="space-y-6">
                <ForecastCard forecast={forecast} />
              </div>
            )}

            {/* Air Quality Tab */}
            {activeTab === 'airquality' && airQuality && (
              <div className="space-y-6">
                <AirQualityCard airQuality={airQuality} />
              </div>
            )}

            {/* Model Comparison Tab */}
            {activeTab === 'models' && weatherModels.length > 0 && (
              <div className="space-y-6">
                <ModelComparison 
                  models={weatherModels}
                  selectedModel={selectedModel}
                  onModelSelect={selectModel}
                />
              </div>
            )}

            {/* Disasters Tab */}
            {activeTab === 'disasters' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CycloneTracker cyclones={cyclones} />
                <EarthquakeMonitor earthquakes={earthquakes} />
                <div className="lg:col-span-2">
                  <TsunamiAlerts alerts={tsunamis} />
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
