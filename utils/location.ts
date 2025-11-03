export const STORE_LOCATION = { latitude: 16.1194375, longitude: 120.4034375 };

// Haversine formula to calculate distance between two lat/lon points in km
export const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

export const calculateDeliveryFee = (position: GeolocationCoordinates | null): number => {
    if (!position) return 0;

    const distance = getDistance(
        STORE_LOCATION.latitude,
        STORE_LOCATION.longitude,
        position.latitude,
        position.longitude
    );
    // Delivery fee logic: P40 base fee for first 3km, then P10 for each additional km.
    if (distance <= 3) {
        return 40;
    } else {
        return 40 + Math.round((distance - 3) * 10);
    }
};
