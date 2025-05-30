
import React, { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormMessage } from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';

declare global {
  interface Window {
    google: any;
    initGooglePlaces: () => void;
  }
}

interface AddressComponents {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface GooglePlacesAutocompleteProps {
  onAddressSelect: (address: AddressComponents) => void;
  placeholder?: string;
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  className?: string;
}

const GooglePlacesAutocomplete: React.FC<GooglePlacesAutocompleteProps> = ({
  onAddressSelect,
  placeholder = "Commencez à taper votre adresse...",
  label = "Adresse",
  value = "",
  onChange,
  error,
  className
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [apiKey, setApiKey] = useState<string>('');

  useEffect(() => {
    const getApiKey = async () => {
      try {
        // Get the Google Places API key from Supabase secrets
        const { data, error } = await supabase.functions.invoke('get-google-places-key');
        if (error) throw error;
        
        if (data?.apiKey) {
          setApiKey(data.apiKey);
          loadGooglePlaces(data.apiKey);
        } else {
          throw new Error('API key not found');
        }
      } catch (error) {
        console.error('Failed to get Google Places API key:', error);
        setLoadError(true);
        setIsLoading(false);
      }
    };

    getApiKey();
  }, []);

  const loadGooglePlaces = async (googleApiKey: string) => {
    try {
      // Check if Google Places is already loaded
      if (window.google && window.google.maps && window.google.maps.places) {
        initializeAutocomplete();
        setIsLoading(false);
        return;
      }

      // Create script element
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&libraries=places&callback=initGooglePlaces`;
      script.async = true;
      script.defer = true;

      // Set up callback
      window.initGooglePlaces = () => {
        initializeAutocomplete();
        setIsLoading(false);
      };

      script.onerror = () => {
        console.error('Failed to load Google Places API');
        setLoadError(true);
        setIsLoading(false);
      };

      document.head.appendChild(script);

      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
        delete window.initGooglePlaces;
      };
    } catch (error) {
      console.error('Error loading Google Places:', error);
      setLoadError(true);
      setIsLoading(false);
    }
  };

  const initializeAutocomplete = () => {
    if (!inputRef.current || !window.google) return;

    try {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['address'],
        componentRestrictions: { country: ['fr', 'be', 'ch', 'es', 'it', 'de', 'gb', 'us', 'ca'] }
      });

      autocompleteRef.current.addListener('place_changed', handlePlaceSelect);
    } catch (error) {
      console.error('Error initializing autocomplete:', error);
      setLoadError(true);
    }
  };

  const handlePlaceSelect = () => {
    if (!autocompleteRef.current) return;

    const place = autocompleteRef.current.getPlace();
    if (!place.address_components) return;

    const addressComponents = extractAddressComponents(place);
    onAddressSelect(addressComponents);
  };

  const extractAddressComponents = (place: any): AddressComponents => {
    const components = place.address_components;
    let address = '';
    let city = '';
    let postalCode = '';
    let country = '';

    // Extract street number and route for full address
    const streetNumber = components.find((c: any) => c.types.includes('street_number'))?.long_name || '';
    const route = components.find((c: any) => c.types.includes('route'))?.long_name || '';
    address = `${streetNumber} ${route}`.trim();

    // Extract other components
    const locality = components.find((c: any) => c.types.includes('locality'));
    const adminLevel2 = components.find((c: any) => c.types.includes('administrative_area_level_2'));
    const adminLevel1 = components.find((c: any) => c.types.includes('administrative_area_level_1'));
    
    city = locality?.long_name || adminLevel2?.long_name || adminLevel1?.long_name || '';
    
    const postalComponent = components.find((c: any) => c.types.includes('postal_code'));
    postalCode = postalComponent?.long_name || '';
    
    const countryComponent = components.find((c: any) => c.types.includes('country'));
    country = countryComponent?.short_name || '';

    return { address, city, postalCode, country };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (onChange) {
      onChange(newValue);
    }
  };

  if (loadError) {
    // Fallback to regular input if Google Places fails to load
    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          className={className}
        />
        {error && <FormMessage>{error}</FormMessage>}
        <p className="text-xs text-yellow-600">
          Autocomplétion d'adresse indisponible. Veuillez saisir manuellement.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        ref={inputRef}
        type="text"
        placeholder={isLoading ? "Chargement..." : placeholder}
        value={value}
        onChange={handleInputChange}
        disabled={isLoading}
        className={className}
      />
      {error && <FormMessage>{error}</FormMessage>}
      {isLoading && (
        <p className="text-xs text-gray-500">Chargement de l'autocomplétion...</p>
      )}
    </div>
  );
};

export default GooglePlacesAutocomplete;
