export interface Location {
  city: string;
  locality?: string;
  country: string;
  lat?: number;
  lon?: number;
}

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  condition: WeatherCondition;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  pressure: number;
  visibility: number;
  isDay: boolean;
  description: string;
  icon: string;
}

export type WeatherCondition = 
  | 'sunny' 
  | 'cloudy' 
  | 'rainy' 
  | 'stormy' 
  | 'snowy' 
  | 'windy' 
  | 'hot' 
  | 'cold'
  | 'partly-cloudy'
  | 'fog';

export interface ForecastDay {
  date: string;
  maxTemp: number;
  minTemp: number;
  condition: WeatherCondition;
  rainProbability: number;
  windSpeed: number;
  humidity: number;
}

export interface WeatherModel {
  id: 'gfs' | 'ecmwf' | 'icon' | 'blended';
  name: string;
  country: string;
  flag: string;
  forecast: ModelForecast[];
}

export interface ModelForecast {
  date: string;
  temperature: number;
  windSpeed: number;
  windGusts: number;
  rainProbability: number;
  condition: WeatherCondition;
}

export interface Cyclone {
  id: string;
  name: string;
  category: number;
  windSpeed: number;
  pressure: number;
  regions: string[];
  status: 'active' | 'weakening' | 'strengthening';
  lat: number;
  lon: number;
}

export interface Earthquake {
  id: string;
  location: string;
  magnitude: number;
  depth: number;
  time: string;
  severity: 'minor' | 'light' | 'moderate' | 'strong' | 'major';
}

export interface TsunamiAlert {
  id: string;
  region: string;
  level: 'watch' | 'advisory' | 'warning';
  issuedAt: string;
  description: string;
}

export interface WindAlert {
  severity: 'normal' | 'strong' | 'extreme';
  speed: number;
  gusts: number;
  message: string;
}

export interface AirQuality {
  aqi: number;
  aqiCategory: 'good' | 'fair' | 'moderate' | 'poor' | 'very-poor' | 'hazardous';
  pm25: number;
  pm10: number;
  no2: number;
  o3: number;
  so2: number;
  co: number;
  usAqi: number;
  europeanAqi: number;
}
