/**
 * OMKARVERSE Tactical IP Geolocation & Aesthetic Radar Map Widget
 * 
 * - Silent background IP fetch (zero navigator.geolocation popups)
 * - Free zero-auth endpoint (ipwho.is with fallback)
 * - Fallback to TARU CORE (20.2460° N, 79.3120° E)
 * - Zero-API Satellite Imagery (ArcGIS World Imagery public export / slippy tile)
 * - 96x96 Blinkit-style square radar card with jumping pin & radar ripple
 * - Docked telemetry pill: [ 🟢 RECON NODE: PUNE // 18.5204° N, 73.8567° E ]
 */

(function () {
  'use strict';

  const FALLBACK_DATA = {
    city: 'TARU CORE',
    plus_code: '87PX+7FV',
    latitude: 20.2460,
    longitude: 79.3120,
    coordinates: '20.2460° N, 79.3120° E',
    state: 'MAHARASHTRA 442903',
  };

  const STORAGE_KEY = 'omkarverse_recon_geo';

  function formatCoordinates(lat, lon) {
    const latStr = Math.abs(lat).toFixed(4) + (lat >= 0 ? '° N' : '° S');
    const lonStr = Math.abs(lon).toFixed(4) + (lon >= 0 ? '° E' : '° W');
    return `${latStr}, ${lonStr}`;
  }

  // Zero-API Public High-Res Satellite Imagery (ArcGIS World Imagery REST export)
  // Centers the resolved coordinates precisely in the middle of a 256x256 satellite crop
  function getSatelliteImageryUrl(lat, lon) {
    const delta = 0.012; // ~1.3km tactical bounding box for ideal reconnaissance zoom
    const minLon = (lon - delta).toFixed(5);
    const maxLon = (lon + delta).toFixed(5);
    const minLat = (lat - delta).toFixed(5);
    const maxLat = (lat + delta).toFixed(5);
    return `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?bbox=${minLon},${minLat},${maxLon},${maxLat}&bboxSR=4326&imageSR=4326&size=256,256&format=jpg&f=image`;
  }

  // Backup Zero-API Satellite Tile
  function getSatelliteTileBackup(lat, lon, zoom = 14) {
    const n = Math.pow(2, zoom);
    const x = Math.floor(((lon + 180) / 360) * n);
    const latRad = (lat * Math.PI) / 180;
    const y = Math.floor(((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n);
    return `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${zoom}/${y}/${x}`;
  }

  function updateWidgetUI(data) {
    const cityEl = document.getElementById('geoCity');
    const coordsEl = document.getElementById('geoCoords');
    const mapImg = document.getElementById('radarMapImg');
    const card = document.getElementById('radarCard');

    const cityName = (data.city || 'TARU CORE').toUpperCase();
    const coordsText = data.coordinates || formatCoordinates(data.latitude, data.longitude);

    if (cityEl) cityEl.textContent = cityName;
    if (coordsEl) coordsEl.textContent = coordsText;

    if (card) {
      card.setAttribute('title', `Recon Satellite: ${cityName} [${coordsText}]`);
    }

    // Load satellite imagery without any API key
    if (mapImg && typeof data.latitude === 'number' && typeof data.longitude === 'number') {
      const primaryUrl = getSatelliteImageryUrl(data.latitude, data.longitude);
      const backupUrl = getSatelliteTileBackup(data.latitude, data.longitude, 14);

      const img = new Image();
      img.onload = function () {
        mapImg.src = primaryUrl;
        mapImg.classList.add('loaded');
      };
      img.onerror = function () {
        // Fallback to slippy satellite tile
        const backupImg = new Image();
        backupImg.onload = function () {
          mapImg.src = backupUrl;
          mapImg.classList.add('loaded');
        };
        backupImg.onerror = function () {
          // Local cached satellite fallback
          mapImg.src = '/media/satellite-fallback.jpg';
          mapImg.classList.add('loaded');
        };
        backupImg.src = backupUrl;
      };
      img.src = primaryUrl;
    }
  }

  async function fetchIpLocation() {
    // Check localStorage cache first for zero-latency instant render
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.city && parsed.latitude) {
          updateWidgetUI(parsed);
        }
      }
    } catch (_) {}

    // Silent background fetch: Endpoint 1 (ipwho.is)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch('https://ipwho.is/', {
        signal: controller.signal,
        headers: { 'Accept': 'application/json' },
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        if (json && json.success !== false && json.city && json.latitude && json.longitude) {
          const result = {
            city: json.city,
            latitude: json.latitude,
            longitude: json.longitude,
            coordinates: formatCoordinates(json.latitude, json.longitude),
            state: json.region || 'CORE',
            country: json.country || '',
          };
          try { localStorage.setItem(STORAGE_KEY, JSON.stringify(result)); } catch (_) {}
          updateWidgetUI(result);
          return;
        }
      }
    } catch (e) {
      console.warn('[Recon Geolocation] Primary endpoint error, trying secondary:', e);
    }

    // Endpoint 2: ipapi.co (backup)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const res = await fetch('https://ipapi.co/json/', {
        signal: controller.signal,
        headers: { 'Accept': 'application/json' },
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        if (json && !json.error && json.city && json.latitude && json.longitude) {
          const result = {
            city: json.city,
            latitude: json.latitude,
            longitude: json.longitude,
            coordinates: formatCoordinates(json.latitude, json.longitude),
            state: json.region || 'CORE',
          };
          try { localStorage.setItem(STORAGE_KEY, JSON.stringify(result)); } catch (_) {}
          updateWidgetUI(result);
          return;
        }
      }
    } catch (_) {}

    // Offline / AdBlock / Localhost fallback
    updateWidgetUI(FALLBACK_DATA);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fetchIpLocation);
  } else {
    fetchIpLocation();
  }
})();
