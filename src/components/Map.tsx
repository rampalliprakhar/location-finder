import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, LayerGroup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon, LatLng } from 'leaflet';
import L from 'leaflet';
import 'leaflet-defaulticon-compatibility';
import 'leaflet.markercluster';
// import { MarkerClusterGroup } from 'react-leaflet-markercluster';
// import 'react-leaflet-markercluster/dist/styles.min.css';
import { Location } from '@/types';
import { SearchBox } from './SearchBox';

interface MapProps {
  locations: Location[];
  onSelectLocation: React.Dispatch<React.SetStateAction<Location | null>>;
}

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

export default function Map({ locations, onSelectLocation }: MapProps) {
  console.log("Locations in Map:", locations);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const getMarkerIcon = (category: string) => {
    return new Icon({
      iconUrl: `/markers/${category.toLowerCase()}-marker.png`,
      iconSize: [25, 41],
      iconAnchor: [12, 41]
    });
  };

  return (
    <div className="relative h-full">
      <SearchBox locations={locations} onSelect={setSelectedLocation} />
      
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
        
        <LayerGroup>
          {locations.map((location) => (
            <Marker
              key={location.id}
              position={[location.latitude, location.longitude]}
              icon={getMarkerIcon(location.category)}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-lg">{location.name}</h3>
                  <p>Category: {location.category}</p>
                  <p>Rating: {location.rating}⭐</p>
                  <p>Capacity: {location.current_capacity}/{location.total_capacity}</p>
                  <p>Price Range: {'$'.repeat(location.price_range)}</p>
                  <p>Hours: {location.operating_hours}</p>
                  <button 
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                    onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`)}
                  >
                    Navigate Here
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </LayerGroup>
      </MapContainer>
    </div>
  );
}
