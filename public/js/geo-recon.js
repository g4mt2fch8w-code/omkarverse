/**
 * OMKARVERSE Tactical IP Geolocation & Aesthetic Radar Map Widget
 * 
 * - Silent background IP fetch (zero navigator.geolocation popups)
 * - Free zero-auth endpoint (ipwho.is with fallback)
 * - Fallback to TARU CORE (20.246° N, 79.312° E)
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

  // Slippy map tile calculations
  function getTileUrl(lat, lon, zoom) {
    const n = Math.pow(2, zoom);
    const x = Math.floor(((lon + 180) / 360) * n);
    const latRad = (lat * Math.PI) / 180;
    const y = Math.floor(((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n);
    return {
      url: `https://basemaps.cartocdn.com/dark_all/${zoom}/${x}/${y}.png`,
      exactX: ((lon + 180) / 360) * n,
      exactY: ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n,
      tileX: x,
      tileY: y,
    };
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
      card.setAttribute('title', `Recon: ${cityName} [${coordsText}]`);
    }

    // Update map tile background
    if (mapImg && typeof data.latitude === 'number' && typeof data.longitude === 'number') {
      const zoom = 13;
      const tileInfo = getTileUrl(data.latitude, data.longitude, zoom);

      // Preload image
      const img = new Image();
      img.onload = function () {
        mapImg.src = tileInfo.url;
        mapImg.classList.add('loaded');
        // Center the exact coordinate within the 96px card
        const subX = (tileInfo.exactX - tileInfo.tileX) * 256;
        const subY = (tileInfo.exactY - tileInfo.tileY) * 256;
        // The card is 96x96, tile is 256x256. Center point is (48, 48)
        const offsetX = 48 - subX;
        const offsetY = 48 - subY;
        mapImg.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      };
      img.onerror = function () {
        // Fallback to high-contrast tactical SVG grid
        mapImg.style.display = 'none';
      };
      img.src = tileInfo.url;
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
