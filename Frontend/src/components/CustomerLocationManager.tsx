import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Globe, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { EnhancedAddressInput } from './EnhancedAddressInput';
import axios from '../utilss/axios';

interface Location {
  lat: number;
  lng: number;
  address?: string;
}

interface CustomerLocationManagerProps {
  onLocationChange: (location: Location) => void;
  onServicesFiltered: (services: any[]) => void;
  className?: string;
}

const CustomerLocationManager: React.FC<CustomerLocationManagerProps> = ({
  onLocationChange,
  onServicesFiltered,
  className = ''
}) => {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [showAddressInput, setShowAddressInput] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isFiltering, setIsFiltering] = useState(false);
  const [locationStatus, setLocationStatus] = useState<'none' | 'detecting' | 'manual' | 'success' | 'error'>('none');

  // Check if geolocation is available
  const isGeolocationSupported = 'geolocation' in navigator;

  // Detect current location
  const detectCurrentLocation = async () => {
    if (!isGeolocationSupported) {
      setLocationError('Geolocation is not supported in your browser');
      setLocationStatus('error');
      return;
    }

    setIsDetecting(true);
    setLocationStatus('detecting');
    setLocationError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        });
      });

      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      // Get address from coordinates using reverse geocoding
      const address = await getAddressFromCoordinates(lat, lng);
      
      const location: Location = { lat, lng, address };
      
      setCurrentLocation(location);
      setSelectedLocation(location);
      setLocationStatus('success');
      
      // Update parent component
      onLocationChange(location);
      
      // Filter services based on new location
      await filterServicesByLocation(location);
      
    } catch (error: any) {
      console.error('Location detection failed:', error);
      let errorMessage = 'Failed to detect location';
      
      if (error.code === 1) {
        errorMessage = 'Location access denied. Please enable location permissions.';
      } else if (error.code === 2) {
        errorMessage = 'Location unavailable. Please try again.';
      } else if (error.code === 3) {
        errorMessage = 'Location request timed out. Please try again.';
      }
      
      setLocationError(errorMessage);
      setLocationStatus('error');
    } finally {
      setIsDetecting(false);
    }
  };

  // Get address from coordinates using Nominatim
  const getAddressFromCoordinates = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      
      if (!response.ok) {
        throw new Error('Geocoding service unavailable');
      }
      
      const data = await response.json();
      return data.display_name || 'Unknown location';
    } catch (error) {
      console.warn('Reverse geocoding failed:', error);
      return 'Unknown location';
    }
  };

  // Filter services based on location
  const filterServicesByLocation = async (location: Location) => {
    setIsFiltering(true);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        // If no token, user is not logged in, show all services
        onServicesFiltered([]);
        return;
      }

      // Call the backend API to get nearby services
      const response = await axios.get('/api/location/customer/nearby-services', {
        headers: { Authorization: `Bearer ${token}` },
        params: { lat: location.lat, lng: location.lng }
      });

      if (response.data && Array.isArray(response.data)) {
        onServicesFiltered(response.data);
      } else {
        console.warn('No services found in your area');
        onServicesFiltered([]);
      }
      
    } catch (error) {
      console.error('Failed to filter services:', error);
      // On error, show all services as fallback
      onServicesFiltered([]);
    } finally {
      setIsFiltering(false);
    }
  };

  // Handle manual address selection
  const handleAddressSelect = async (address: any) => {
    if (address.coordinates) {
      const location: Location = {
        lat: address.coordinates.lat,
        lng: address.coordinates.lng,
        address: address.fullAddress
      };
      
      setSelectedLocation(location);
      setLocationStatus('manual');
      
      // Update parent component
      onLocationChange(location);
      
      // Filter services based on new location
      await filterServicesByLocation(location);
    }
    
    setShowAddressInput(false);
  };

  // Handle manual address input
  const handleManualAddressInput = () => {
    setShowAddressInput(true);
  };

  // Clear location and show all services
  const clearLocation = () => {
    setSelectedLocation(null);
    setCurrentLocation(null);
    setLocationStatus('none');
    setLocationError(null);
    onLocationChange({ lat: 0, lng: 0 });
    onServicesFiltered([]);
  };

  // Auto-detect location on component mount if supported
  useEffect(() => {
    if (isGeolocationSupported && !selectedLocation) {
      detectCurrentLocation();
    }
  }, []);

  return (
    <div className={`customer-location-manager ${className}`}>
      {/* Location Status Display */}
      <div className="location-status-container mb-4 p-4 bg-white rounded-lg shadow-sm border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {locationStatus === 'none' && <MapPin className="w-5 h-5 text-gray-400" />}
            {locationStatus === 'detecting' && <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />}
            {locationStatus === 'manual' && <Globe className="w-5 h-5 text-green-500" />}
            {locationStatus === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
            {locationStatus === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
            
            <div>
              <h3 className="font-medium text-gray-900">
                {locationStatus === 'none' && 'Location not set'}
                {locationStatus === 'detecting' && 'Detecting location...'}
                {locationStatus === 'manual' && 'Manual location set'}
                {locationStatus === 'success' && 'Current location detected'}
                {locationStatus === 'error' && 'Location error'}
              </h3>
              
              {selectedLocation && (
                <p className="text-sm text-gray-600 mt-1">
                  📍 {selectedLocation.address || `${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}`}
                </p>
              )}
            </div>
          </div>

          {isFiltering && (
            <div className="flex items-center space-x-2 text-sm text-blue-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Filtering services...</span>
            </div>
          )}
        </div>

        {/* Error Message */}
        {locationError && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-700">{locationError}</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-4">
        {isGeolocationSupported && (
          <button
            onClick={detectCurrentLocation}
            disabled={isDetecting}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isDetecting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Navigation className="w-4 h-4" />
            )}
            <span>{isDetecting ? 'Detecting...' : 'Use Current Location'}</span>
          </button>
        )}

        <button
          onClick={handleManualAddressInput}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Globe className="w-4 h-4" />
          <span>Enter Address Manually</span>
        </button>

        {selectedLocation && (
          <button
            onClick={clearLocation}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Clear Location
          </button>
        )}
      </div>

      {/* Location Info */}
      {selectedLocation && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-900">Location Set Successfully!</h4>
              <p className="text-sm text-green-700 mt-1">
                We'll now show you only the washerman services available in your area.
                {selectedLocation.address && (
                  <span className="block mt-1">
                    📍 <strong>Address:</strong> {selectedLocation.address}
                  </span>
                )}
                <span className="block mt-1">
                  📊 <strong>Coordinates:</strong> {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Manual Address Input Modal */}
      {showAddressInput && (
        <EnhancedAddressInput
          onAddressSelect={handleAddressSelect}
          onClose={() => setShowAddressInput(false)}
          title="Enter Your Address"
          showDeliveryOptions={false}
        />
      )}
    </div>
  );
};

export default CustomerLocationManager;
