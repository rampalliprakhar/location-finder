import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon, LatLng } from 'leaflet';
import 'leaflet-defaulticon-compatibility';
import { Location } from '@/types';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-hot-toast';

const LocationMarker = () => {
  const [position, setPosition] = useState<LatLng | null>(null);
  const map = useMap();

  useEffect(() => {
    map.locate().on("locationfound", (e) => {
      setPosition(e.latlng);
      map.flyTo(e.latlng, 16);
    });
  }, [map]);

  return position ? (
    <Circle center={position} radius={200} color="blue" />
  ) : null;
};

export default function Map({ locations }: { locations: Location[] }) {
  const visibleLocations = locations.slice(0, 1000);

  const getMarkerIcon = (category: string) => {
    return new Icon({
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      shadowSize: [41, 41]
    });
  };

  const handleFavorite = async (location: Location) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error('Please sign in to save favorites');
      return;
    }
  
    const { data, error } = await supabase
      .from('favorites')
      .insert({ 
        location_id: location.id,
        name: location.name,
        category: location.category,
        latitude: location.latitude,
        longitude: location.longitude,
        user_id: user.id 
      });
  
    if (error) {
      toast.error('Failed to save favorite');
      console.error(error);
    } else {
      toast.success('Added to favorites!');
    }
  };

  return (
    <div className="relative h-full">
      <MapContainer
        center={[40.7128, -74.0060]}
        zoom={13}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <LocationMarker />
        {visibleLocations.map((location) => (
          <Marker
            key={location.id}
            position={[location.latitude, location.longitude]}
            icon={getMarkerIcon(location.category)}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold">{location.name}</h3>
                <p>{location.category}</p>
              </div>
              <button 
                onClick={() => {
                  handleFavorite(location);
                }}
                className="bg-blue-500 text-white px-2 py-1 rounded mt-2"
              >
                ⭐ Save
              </button>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}