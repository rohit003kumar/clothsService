import React from 'react';
import { MapPin, Home, Building, Globe, Navigation } from 'lucide-react';

interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  landmark?: string;
  fullAddress: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface AddressDisplayProps {
  address: Address;
  title?: string;
  type?: 'pickup' | 'delivery';
  showIcon?: boolean;
  className?: string;
}

const AddressDisplay: React.FC<AddressDisplayProps> = ({
  address,
  title,
  type = 'pickup',
  showIcon = true,
  className = ''
}) => {
  const getTypeIcon = () => {
    switch (type) {
      case 'pickup':
        return <Home className="w-4 h-4 text-blue-600" />;
      case 'delivery':
        return <Navigation className="w-4 h-4 text-green-600" />;
      default:
        return <MapPin className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'pickup':
        return 'text-blue-600';
      case 'delivery':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'pickup':
        return 'Pickup Address';
      case 'delivery':
        return 'Delivery Address';
      default:
        return 'Address';
    }
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center space-x-2 mb-3">
        {showIcon && getTypeIcon()}
        <h3 className={`font-semibold text-sm ${getTypeColor()}`}>
          {title || getTypeLabel()}
        </h3>
      </div>

      {/* Address Content */}
      <div className="space-y-2">
        {/* Street Address */}
        {address.street && (
          <div className="flex items-start space-x-2">
            <Home className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-gray-900 font-medium">
              {address.street}
            </span>
          </div>
        )}

        {/* Landmark */}
        {address.landmark && (
          <div className="flex items-start space-x-2 ml-6">
            <MapPin className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
            <span className="text-xs text-gray-600">
              Near {address.landmark}
            </span>
          </div>
        )}

        {/* City, State, ZIP */}
        <div className="flex items-start space-x-2 ml-6">
          <Building className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-gray-700">
            <span className="font-medium">{address.city}</span>
            {address.state && (
              <>
                , <span className="font-medium">{address.state}</span>
              </>
            )}
            {address.zip && (
              <>
                {' '}
                <span className="font-medium">{address.zip}</span>
              </>
            )}
          </div>
        </div>

        {/* Full Address (fallback) */}
        {!address.street && address.fullAddress && (
          <div className="flex items-start space-x-2">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-gray-700">
              {address.fullAddress}
            </span>
          </div>
        )}

        {/* Coordinates (if available) */}
        {address.coordinates && (
          <div className="flex items-center space-x-2 ml-6 mt-2">
            <Globe className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-500">
              {address.coordinates.lat.toFixed(6)}, {address.coordinates.lng.toFixed(6)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressDisplay;

