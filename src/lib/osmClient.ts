const OVERPASS_API = 'https://overpass-api.de/api/interpreter';

export async function fetchLocations(bbox: string) {
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"](${bbox});
      way["amenity"](${bbox});
      relation["amenity"](${bbox});
    );
    out body;
    >;
    out skel qt;
  `;
  
  const response = await fetch(OVERPASS_API, {
    method: 'POST',
    body: query
  });
  
  return response.json();
}