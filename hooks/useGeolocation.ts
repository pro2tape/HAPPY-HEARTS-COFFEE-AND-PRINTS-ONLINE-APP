import { useState, useCallback } from 'react';

interface GeolocationState {
  loading: boolean;
  error: GeolocationPositionError | null;
  position: GeolocationCoordinates | null;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    loading: false,
    error: null,
    position: null,
  });

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setState((prevState) => ({ ...prevState, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          loading: false,
          error: null,
          position: position.coords,
        });
      },
      (error) => {
        setState({
          loading: false,
          error: error,
          position: null,
        });
      }
    );
  }, []);

  return { ...state, getLocation };
};