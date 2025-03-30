"use client";

import { useEffect, useState } from "react";
import { Session } from '@supabase/supabase-js';
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabaseClient";
import dynamic from "next/dynamic";
import { toast, Toaster } from "react-hot-toast";
import { Location } from '@/types';
import { fetchLocations } from '@/lib/osmClient';
import { transformOsmData } from '@/utils/osmTransform';

const MapComponent = dynamic(() => import("@/components/Map"), { 
  ssr: false 
});

const AuthComponent = dynamic(
  () => import('@supabase/auth-ui-react').then(mod => mod.Auth),
  { ssr: false }
);

export default function Home() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  const filteredLocations = locations.filter(location => 
    selectedCategory === 'all' || location.category === selectedCategory
  );

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const fetchOsmData = async () => {
      try {
        setLoading(true);
        // Get user's location
        navigator.geolocation.getCurrentPosition(async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          // Create a bounding box around user's location
          const bbox = `${lat - 0.02},${lon - 0.02},${lat + 0.02},${lon + 0.02}`;
          const osmData = await fetchLocations(bbox);
          const transformedLocations = transformOsmData(osmData);
          setLocations(transformedLocations);
          setLoading(false);
        });
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to load locations');
        setLoading(false);
      }
    };
  
    fetchOsmData();
  }, []);

  return (
    <div className="h-screen p-4">
      <Toaster position="top-right"/>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">📍 Location Finder</h1>
        <select 
          className="border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          onChange={(e) => setSelectedCategory(e.target.value)}
          value={selectedCategory}
        >
          <option value="all">All Categories</option>
          <option value="restaurant">Restaurants</option>
          <option value="park">Parks</option>
          <option value="shop">Shopping</option>
          <option value="charging_station">Charging Stations</option>
          <option value="bicycle_rental">Bike Stations</option>
          <option value="doctors">Doctors</option>
          <option value="social_facility">Social Facility</option> 
          <option value="community_centre">Community Center</option>
          <option value="restaurant">Restaurant</option>
          <option value="library">Library</option>
          <option value="post_office">Post Office</option> 
          <option value="fire_station">Fire Station</option>
          <option value="place_of_worship">Place of Worship</option>
          <option value="parking">Parking</option>
          <option value="events_venue">Events Venue</option> 
          <option value="courthouse">Courthouse</option>
          <option value="police">Police</option>
          <option value="hospital">Hospital</option>
          <option value="bicycle_parking">Bicycle Parking</option> 
          <option value="bench">Bench</option>
          <option value="research_institute">Research Institute</option>
          <option value="drinking_water">Drinking Water</option>
          <option value="theatre">Theatre</option> 
          <option value="dormitory">Dormitory</option>
          <option value="cinema">Cinema</option>
          <option value="ice_cream">Ice Cream</option>
          <option value="arts_centre">Arts Center</option> 
          <option value="clinic">Clinic</option>
          <option value="university">University</option>
          <option value="fast_food">Fast Food</option>
          <option value="college">College</option> 
          <option value="school">School</option>
        </select>
      </div>

      {!session ? (
        <div className="max-w-md mx-auto mt-10">
          <AuthComponent
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={['google', 'github']}
          />
        </div>
      ) : (
        loading ? (
          <div className="flex items-center justify-center h-[600px]">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
          </div>
        ) : (
          <div className="h-[calc(100vh-120px)]">
            <MapComponent locations={filteredLocations} />
          </div>
        )
      )}
    </div>
  );
}