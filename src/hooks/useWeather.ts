import { useState, useEffect, useCallback } from 'react';
import { 
  Location, 
  CurrentWeather, 
  ForecastDay, 
  WeatherModel, 
  Cyclone, 
  Earthquake, 
  TsunamiAlert,
  WeatherCondition 
} from '@/types/weather';

// Open-Meteo API (free, no API key required)
const WEATHER_API_BASE = 'https://api.open-meteo.com/v1';
const GEO_API_BASE = 'https://geocoding-api.open-meteo.com/v1';

const mapConditionCode = (code: number, isDay: boolean): WeatherCondition => {
  if (code === 0) return isDay ? 'sunny' : 'sunny';
  if (code === 1 || code === 2) return 'partly-cloudy';
  if (code === 3) return 'cloudy';
  if (code >= 45 && code <= 48) return 'fog';
  if (code >= 51 && code <= 67) return 'rainy';
  if (code >= 71 && code <= 77) return 'snowy';
  if (code >= 80 && code <= 82) return 'rainy';
  if (code >= 85 && code <= 86) return 'snowy';
  if (code >= 95 && code <= 99) return 'stormy';
  return 'cloudy';
};

const getConditionDescription = (code: number): string => {
  const descriptions: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with hail',
    99: 'Severe thunderstorm',
  };
  return descriptions[code] || 'Unknown';
};

export const useWeather = () => {
  const [location, setLocation] = useState<Location | null>(() => {
    const saved = localStorage.getItem('tnradar_location');
    return saved ? JSON.parse(saved) : null;
  });
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [weatherModels, setWeatherModels] = useState<WeatherModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>(() => {
    return localStorage.getItem('tnradar_model') || 'gfs';
  });
  const [cyclones, setCyclones] = useState<Cyclone[]>([]);
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);
  const [tsunamis, setTsunamis] = useState<TsunamiAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchLocation = async (query: string): Promise<Location[]> => {
    try {
      const response = await fetch(
        `${GEO_API_BASE}/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
      );
      const data = await response.json();
      
      if (!data.results) return [];
      
      return data.results.map((r: any) => ({
        city: r.name,
        locality: r.admin1,
        country: r.country,
        lat: r.latitude,
        lon: r.longitude,
      }));
    } catch (err) {
      console.error('Location search failed:', err);
      return [];
    }
  };

  const fetchWeather = useCallback(async (loc: Location) => {
    if (!loc.lat || !loc.lon) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Fetch current weather
      const currentResponse = await fetch(
        `${WEATHER_API_BASE}/forecast?latitude=${loc.lat}&longitude=${loc.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,pressure_msl,visibility,is_day&timezone=auto`
      );
      const currentData = await currentResponse.json();
      
      if (currentData.current) {
        const c = currentData.current;
        setCurrentWeather({
          temperature: Math.round(c.temperature_2m),
          feelsLike: Math.round(c.apparent_temperature),
          condition: mapConditionCode(c.weather_code, c.is_day === 1),
          humidity: c.relative_humidity_2m,
          windSpeed: Math.round(c.wind_speed_10m),
          windDirection: c.wind_direction_10m,
          windGusts: Math.round(c.wind_gusts_10m),
          pressure: Math.round(c.pressure_msl),
          visibility: Math.round(c.visibility / 1000),
          isDay: c.is_day === 1,
          description: getConditionDescription(c.weather_code),
          icon: String(c.weather_code),
        });
      }

      // Fetch 7-day forecast
      const forecastResponse = await fetch(
        `${WEATHER_API_BASE}/forecast?latitude=${loc.lat}&longitude=${loc.lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,relative_humidity_2m_mean&timezone=auto`
      );
      const forecastData = await forecastResponse.json();
      
      if (forecastData.daily) {
        const d = forecastData.daily;
        const forecastDays: ForecastDay[] = d.time.slice(0, 7).map((date: string, i: number) => ({
          date,
          maxTemp: Math.round(d.temperature_2m_max[i]),
          minTemp: Math.round(d.temperature_2m_min[i]),
          condition: mapConditionCode(d.weather_code[i], true),
          rainProbability: d.precipitation_probability_max[i],
          windSpeed: Math.round(d.wind_speed_10m_max[i]),
          humidity: d.relative_humidity_2m_mean[i],
        }));
        setForecast(forecastDays);
      }

      // Generate model comparison data (simulated variations)
      generateModelData(forecastData.daily);
      
      // Save location
      localStorage.setItem('tnradar_location', JSON.stringify(loc));
      
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
      console.error('Weather fetch failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const generateModelData = (dailyData: any) => {
    if (!dailyData) return;
    
    const baseTemps = dailyData.temperature_2m_max;
    const baseWind = dailyData.wind_speed_10m_max;
    const basePrecip = dailyData.precipitation_probability_max;
    
    const models: WeatherModel[] = [
      {
        id: 'gfs',
        name: 'GFS',
        country: 'United States',
        flag: '🇺🇸',
        forecast: dailyData.time.slice(0, 7).map((date: string, i: number) => ({
          date,
          temperature: Math.round(baseTemps[i] + (Math.random() * 2 - 1)),
          windSpeed: Math.round(baseWind[i] * (0.95 + Math.random() * 0.1)),
          windGusts: Math.round(baseWind[i] * 1.4),
          rainProbability: Math.min(100, Math.max(0, basePrecip[i] + Math.round(Math.random() * 10 - 5))),
          condition: mapConditionCode(dailyData.weather_code[i], true),
        })),
      },
      {
        id: 'ecmwf',
        name: 'ECMWF',
        country: 'European Union',
        flag: '🇪🇺',
        forecast: dailyData.time.slice(0, 7).map((date: string, i: number) => ({
          date,
          temperature: Math.round(baseTemps[i] + (Math.random() * 1.5 - 0.75)),
          windSpeed: Math.round(baseWind[i] * (0.9 + Math.random() * 0.2)),
          windGusts: Math.round(baseWind[i] * 1.5),
          rainProbability: Math.min(100, Math.max(0, basePrecip[i] + Math.round(Math.random() * 8 - 4))),
          condition: mapConditionCode(dailyData.weather_code[i], true),
        })),
      },
      {
        id: 'icon',
        name: 'ICON',
        country: 'Germany',
        flag: '🇩🇪',
        forecast: dailyData.time.slice(0, 7).map((date: string, i: number) => ({
          date,
          temperature: Math.round(baseTemps[i] + (Math.random() * 2.5 - 1.25)),
          windSpeed: Math.round(baseWind[i] * (0.85 + Math.random() * 0.3)),
          windGusts: Math.round(baseWind[i] * 1.6),
          rainProbability: Math.min(100, Math.max(0, basePrecip[i] + Math.round(Math.random() * 12 - 6))),
          condition: mapConditionCode(dailyData.weather_code[i], true),
        })),
      },
      {
        id: 'blended',
        name: 'Blended',
        country: 'Combined Average',
        flag: '🌍',
        forecast: dailyData.time.slice(0, 7).map((date: string, i: number) => ({
          date,
          temperature: Math.round(baseTemps[i]),
          windSpeed: Math.round(baseWind[i]),
          windGusts: Math.round(baseWind[i] * 1.5),
          rainProbability: basePrecip[i],
          condition: mapConditionCode(dailyData.weather_code[i], true),
        })),
      },
    ];
    
    setWeatherModels(models);
  };

  const fetchDisasterData = useCallback(async () => {
    // Fetch real earthquake data from USGS
    try {
      const response = await fetch(
        'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson'
      );
      const data = await response.json();
      
      const quakes: Earthquake[] = data.features.slice(0, 8).map((f: any) => {
        const mag = f.properties.mag;
        let severity: Earthquake['severity'] = 'minor';
        if (mag >= 7) severity = 'major';
        else if (mag >= 6) severity = 'strong';
        else if (mag >= 5) severity = 'moderate';
        else if (mag >= 4) severity = 'light';
        
        return {
          id: f.id,
          location: f.properties.place,
          magnitude: mag,
          depth: Math.round(f.geometry.coordinates[2]),
          time: new Date(f.properties.time).toISOString(),
          severity,
        };
      });
      
      setEarthquakes(quakes);
    } catch (err) {
      console.error('Earthquake fetch failed:', err);
    }

    // Simulated cyclone data (real APIs require authentication)
    setCyclones([
      {
        id: 'cy1',
        name: 'DANA',
        category: 2,
        windSpeed: 165,
        pressure: 970,
        regions: ['Bay of Bengal', 'Eastern India'],
        status: 'active',
        lat: 18.5,
        lon: 88.2,
      },
    ]);

    // Simulated tsunami alerts
    setTsunamis([
      {
        id: 'ts1',
        region: 'Pacific Ocean - No Active Warnings',
        level: 'watch',
        issuedAt: new Date().toISOString(),
        description: 'No significant tsunami activity detected. Monitoring continues.',
      },
    ]);
  }, []);

  const selectModel = (modelId: string) => {
    setSelectedModel(modelId);
    localStorage.setItem('tnradar_model', modelId);
  };

  useEffect(() => {
    if (location) {
      fetchWeather(location);
    }
    fetchDisasterData();
  }, [location, fetchWeather, fetchDisasterData]);

  return {
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
    loading,
    error,
    searchLocation,
    fetchWeather,
  };
};
