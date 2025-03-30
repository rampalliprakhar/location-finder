import { useState } from 'react';
import { Location } from '@/types';

interface SearchBoxProps {
  locations: Location[];
  onSelect: React.Dispatch<React.SetStateAction<Location | null>>;
}

export function SearchBox({ locations, onSelect }: SearchBoxProps) {
  const [search, setSearch] = useState('');

  const filteredLocations = locations.filter(location => 
    location.name.toLowerCase().includes(search.toLowerCase()) ||
    location.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="absolute top-4 left-4 z-[1000] bg-white rounded-lg shadow-lg p-4">
      <input
        type="text"
        placeholder="Search locations..."
        className="w-64 px-4 py-2 border rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {search && (
        <div className="mt-2 max-h-48 overflow-auto">
          {filteredLocations.map(location => (
            <div
              key={location.id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => onSelect(location)}
            >
              <p className="font-bold">{location.name}</p>
              <p className="text-sm text-gray-600">
                {location.category} | {location.rating}⭐
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
