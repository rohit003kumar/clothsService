import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, X, Navigation, Loader2 } from 'lucide-react';

interface Location {
  lat: number;
  lng: number;
  address: string;
}

interface ManualAddressInputProps {
  onLocationSelect: (location: Location) => void;
  onClose: () => void;
  currentLocation?: Location | null;
}

interface PlaceSuggestion {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  importance: number;
}

const ManualAddressInput: React.FC<ManualAddressInputProps> = ({
  onLocationSelect,
  onClose,
  currentLocation
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isGeocodingAddress, setIsGeocodingAddress] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus on input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Debounced search for address suggestions
  useEffect(() => {
    if (searchQuery.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      await searchAddresses(searchQuery);
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const searchAddresses = async (query: string) => {
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      // Using Nominatim (OpenStreetMap) for address search - free alternative to Google Places
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(query)}&countrycodes=in`
      );
      
      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data: PlaceSuggestion[] = await response.json();
      
      // Filter and sort results by importance
      const filteredResults = data
        .filter(place => place.importance > 0.3) // Filter out less relevant results
        .sort((a, b) => b.importance - a.importance)
        .slice(0, 5);

      setSuggestions(filteredResults);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Address search error:', error);
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSuggestionSelect = async (suggestion: PlaceSuggestion) => {
    const location: Location = {
      lat: parseFloat(suggestion.lat),
      lng: parseFloat(suggestion.lon),
      address: suggestion.display_name
    };

    setSelectedLocation(location);
    setSearchQuery(suggestion.display_name);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleManualAddressSubmit = async () => {
    if (!searchQuery.trim()) {
      alert('Please enter an address');
      return;
    }

    // If we have a selected location from suggestions, use it
    if (selectedLocation) {
      onLocationSelect(selectedLocation);
      return;
    }

    // Otherwise, geocode the entered address
    setIsGeocodingAddress(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(searchQuery)}&countrycodes=in`
      );
      
      if (!response.ok) {
        throw new Error('Geocoding failed');
      }

      const data: PlaceSuggestion[] = await response.json();
      
      if (data.length === 0) {
        alert('Address not found. Please try a different address or be more specific.');
        return;
      }

      const result = data[0];
      const location: Location = {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        address: result.display_name
      };

      onLocationSelect(location);
    } catch (error) {
      console.error('Geocoding error:', error);
      alert('Failed to find the address. Please check your internet connection and try again.');
    } finally {
      setIsGeocodingAddress(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (currentLocation) {
      onLocationSelect(currentLocation);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSelectedLocation(null);
    setSuggestions([]);
    setShowSuggestions(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <MapPin className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Enter Your Address</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Current Location Option */}
          {currentLocation && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Navigation className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Use Current Location</span>
                </div>
                <button
                  onClick={handleUseCurrentLocation}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Use This
                </button>
              </div>
              <p className="text-xs text-blue-700 mt-1 ml-6">
                {currentLocation.address.length > 50 
                  ? `${currentLocation.address.substring(0, 50)}...` 
                  : currentLocation.address}
              </p>
            </div>
          )}

          {/* Search Input */}
          <div className="relative mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter your full address..."
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleManualAddressSubmit();
                  }
                }}
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Loading indicator */}
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
              </div>
            )}

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.place_id}
                    onClick={() => handleSuggestionSelect(suggestion)}
                    className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                  >
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {suggestion.display_name.split(',')[0]}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {suggestion.display_name}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Helper Text */}
          <p className="text-sm text-gray-600 mb-6">
            💡 <strong>Tip:</strong> Enter your complete address including area, city, and state for better results.
          </p>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleManualAddressSubmit}
              disabled={!searchQuery.trim() || isGeocodingAddress}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
            >
              {isGeocodingAddress ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Finding...</span>
                </>
              ) : (
                <span>Find Services</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualAddressInput;
