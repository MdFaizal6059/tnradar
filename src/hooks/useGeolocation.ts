import { useState, useCallback } from 'react';
import { Location } from '@/types/weather';

interface GeolocationState {
  loading: boolean;
  error: string | null;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    loading: false,
    error: null,
  });

  const getCurrentLocation = useCallback((): Promise<Location> => {
    return new Promise((resolve, reject) => {
      setState({ loading: true, error: null });

      if (!navigator.geolocation) {
        const error = 'Geolocation is not supported by your browser';
        setState({ loading: false, error });
        reject(new Error(error));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Reverse geocoding to get location name
            const response = await fetch(
              `https://geocoding-api.open-meteo.com/v1/search?name=&latitude=${latitude}&longitude=${longitude}&count=1&language=en&format=json`
            );
            
            // Use reverse geocoding API
            const reverseResponse = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
            );
            
            let city = 'Current Location';
            let locality = '';
            let country = '';
            
            if (reverseResponse.ok) {
              const reverseData = await reverseResponse.json();
              city = reverseData.address?.city || 
                     reverseData.address?.town || 
                     reverseData.address?.village || 
                     reverseData.address?.municipality ||
                     reverseData.address?.county ||
                     'Current Location';
              locality = reverseData.address?.state || reverseData.address?.region || '';
              country = reverseData.address?.country || '';
            }

            const location: Location = {
              city,
              locality,
              country,
              lat: latitude,
              lon: longitude,
            };

            setState({ loading: false, error: null });
            resolve(location);
          } catch (err) {
            // If reverse geocoding fails, still return coordinates
            const location: Location = {
              city: 'Current Location',
              locality: '',
              country: '',
              lat: latitude,
              lon: longitude,
            };
            setState({ loading: false, error: null });
            resolve(location);
          }
        },
        (error) => {
          let errorMessage = 'Failed to get your location';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied. Please enable location access in your browser settings.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable. Please try again.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out. Please try again.';
              break;
          }
          
          setState({ loading: false, error: errorMessage });
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // Cache for 5 minutes
        }
      );
    });
  }, []);

  return {
    getCurrentLocation,
    loading: state.loading,
    error: state.error,
  };
};
