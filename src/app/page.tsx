"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import dynamic from "next/dynamic";
import { toast } from "react-hot-toast";
import { Location } from '@/types';
import { fetchLocations } from '@/lib/osmClient';
import { transformOsmData } from '@/utils/osmTransform';

const MapComponent = dynamic(() => import("@/components/Map"), { 
  ssr: false 
});

export default function Home() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'all',
    minRating: 0,
    maxPrice: 5,
    features: [] as string[]
  });

  useEffect(() => {
    const fetchOsmData = async () => {
      try {
        setLoading(true);
        const bbox = '40.7,-74,40.8,-73.9'; // NYC area
        const osmData = await fetchLocations(bbox);
        console.log('OSM Data:', osmData);
        
        const transformedLocations = transformOsmData(osmData);
        console.log('Transformed Locations:', transformedLocations);
        
        setLocations(transformedLocations);
      } catch (error) {
        console.error('Error fetching locations:', error);
        toast.error('Failed to load locations');
      } finally {
        setLoading(false);
      }
    };
  
    fetchOsmData();
  }, []);

  return (
    <div className="h-screen p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">📍 Location Finder</h1>
        <div className="flex gap-2">
          <select 
            className="border rounded px-3 py-2"
            onChange={(e) => setFilters({...filters, category: e.target.value})}
          >
            <option value="all">All Categories</option>
            <option value="restaurant">Restaurants</option>
            <option value="park">Parks</option>
            <option value="shopping">Shopping</option>
            <option value="charging">Charging Stations</option>
            <option value="bike">Bike Stations</option>
          </select>
        </div>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center h-[600px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
        </div>
      ) : (
        <div className="h-[calc(100vh-120px)]">
          <MapComponent locations={locations} onSelectLocation={setSelectedLocation} />
        </div>
      )}
    </div>
  );
}