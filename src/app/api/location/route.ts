import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const query = searchParams.get('query');
  const action = searchParams.get('action');

  // 1. IP Geolocation Fallback
  if (action === 'ip') {
    try {
      const res = await fetch('http://ip-api.com/json/', { cache: 'no-store' });
      const data = await res.json();
      if (data.status === 'success') {
        return NextResponse.json({
          success: true,
          city: data.city || 'Bengaluru',
          region: data.regionName || 'Karnataka',
          country: data.country || 'India',
          lat: data.lat,
          lng: data.lon,
          locality: `${data.city}, ${data.regionName}`,
        });
      }
    } catch (err) {
      console.warn('IP location fetch failed:', err);
    }

    // Default India centroid fallback
    return NextResponse.json({
      success: true,
      city: 'Bengaluru',
      region: 'Karnataka',
      country: 'India',
      lat: 12.9716,
      lng: 77.5946,
      locality: 'Bengaluru, Karnataka',
    });
  }

  // 2. Reverse Geocoding (Lat/Lng -> Locality Name)
  if (lat && lng) {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}&zoom=16&addressdetails=1`;
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'SwasthyaSaathi/1.0 (Health Companion; contact@swasthyasaathi.in)',
          'Accept-Language': 'en',
        },
      });

      if (res.ok) {
        const data = await res.json();
        const addr = data.address || {};
        const neighbourhood = addr.suburb || addr.neighbourhood || addr.residential || addr.quarter || '';
        const city = addr.city || addr.town || addr.village || addr.city_district || addr.county || 'Local Area';
        const state = addr.state || '';
        const postcode = addr.postcode || '';

        const localityParts = [neighbourhood, city].filter(Boolean);
        const locality = localityParts.length > 0 ? localityParts.join(', ') : data.display_name.split(',').slice(0, 2).join(', ');

        return NextResponse.json({
          success: true,
          locality,
          city,
          state,
          postcode,
          fullAddress: data.display_name,
          lat: parseFloat(lat),
          lng: parseFloat(lng),
        });
      }
    } catch (err) {
      console.warn('Reverse geocoding error:', err);
    }

    return NextResponse.json({
      success: true,
      locality: `GPS Coordinates (${parseFloat(lat).toFixed(3)}, ${parseFloat(lng).toFixed(3)})`,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
    });
  }

  // 3. Search Indian Cities, Districts, Towns, Pincodes
  if (query && query.trim()) {
    try {
      const cleanQuery = query.trim();
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cleanQuery)}&countrycodes=in&limit=5&addressdetails=1`;
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'SwasthyaSaathi/1.0 (Health Companion; contact@swasthyasaathi.in)',
          'Accept-Language': 'en',
        },
      });

      if (res.ok) {
        const data = await res.json();
        const results = data.map((item: any) => {
          const addr = item.address || {};
          const city = addr.city || addr.town || addr.village || addr.state_district || item.name;
          const state = addr.state || '';
          return {
            name: `${city}${state ? ', ' + state : ''}`,
            displayName: item.display_name,
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
          };
        });
        return NextResponse.json({ success: true, results });
      }
    } catch (err) {
      console.warn('Location query error:', err);
    }
    return NextResponse.json({ success: true, results: [] });
  }

  return NextResponse.json({ error: 'Missing parameters. Provide lat/lng, query, or action=ip.' }, { status: 400 });
}
