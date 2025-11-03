import React from 'react';
import { useGeolocation } from '../hooks/useGeolocation';
import { calculateDeliveryFee } from '../utils/location';
import { CloseIcon } from './Icons';

interface LocationSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSave: (position: GeolocationCoordinates) => void;
  currentPosition: GeolocationCoordinates | null;
}

const LocationSettings: React.FC<LocationSettingsProps> = ({ isOpen, onClose, onLocationSave, currentPosition }) => {
  const { position, loading, error, getLocation } = useGeolocation();

  // The active position is the newly fetched one, otherwise the one from app state
  const activePosition = position || currentPosition;
  const deliveryFee = calculateDeliveryFee(activePosition);

  const handleSave = () => {
    if (position) { // Only save if a new position was fetched in this modal
      onLocationSave(position);
    }
    onClose();
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="location-settings-title">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
            <h2 id="location-settings-title" className="text-2xl font-bold text-amber-900">Delivery Location</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800" aria-label="Close location settings">
              <CloseIcon className="h-6 w-6" />
            </button>
        </div>
        
        <div className="p-6">
            <div className="bg-gray-100 p-4 rounded-lg">
                {activePosition ? (
                  <div className="text-green-700">
                    <p className="font-semibold">Current Location Pinned!</p>
                    <p className="text-xs">Lat: {activePosition.latitude.toFixed(5)}, Lon: {activePosition.longitude.toFixed(5)}</p>
                    <p className="font-semibold mt-2">Estimated Delivery Fee: ₱{deliveryFee.toFixed(2)}</p>
                  </div>
                ) : (
                  <p className="text-gray-600">
                    {loading ? 'Getting your location...' : 'Please pin your location to calculate delivery fees.'}
                  </p>
                )}
                {error && <p className="text-red-500 mt-2">Error: {error.message}</p>}
                <button onClick={getLocation} disabled={loading} className="mt-4 w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition-colors">
                  {loading ? 'Loading...' : (activePosition ? 'Update My Location' : 'Pin My Current Location')}
                </button>
            </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-b-xl">
           <button 
             onClick={handleSave}
             className="w-full bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 transition-colors text-lg"
           >
             {position ? 'Save New Location' : 'Done'}
           </button>
        </div>
      </div>
    </div>
  );
};

export default LocationSettings;