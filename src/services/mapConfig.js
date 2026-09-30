/**
 * =============================================================================
 * Map API Configuration & Tile Layer Adapter
 * =============================================================================
 * Seamlessly connects Leaflet to the configured Map API provider using the secure
 * environment variable MAP_API_KEY / VITE_MAP_API_KEY.
 *
 * Supported Map Providers:
 * - Mapbox (token starts with 'pk.')
 * - MapTiler
 * - Stadia Maps
 * - OpenWeatherMap Weather Radar Overlay
 * - High-speed CartoDB Voyager / OpenStreetMap (Default fallback)
 */

export function getMapApiKey() {
  const key = import.meta.env.VITE_MAP_API_KEY || import.meta.env.MAP_API_KEY || '';
  return typeof key === 'string' ? key.trim() : '';
}

export function getMapTileConfig() {
  const key = getMapApiKey();

  // 1. Google Maps API (keys start with AIzaSy)
  if (key.startsWith('AIzaSy')) {
    return {
      provider: 'Google Maps',
      hasKey: true,
      url: `https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&key=${key}`,
      subdomains: ['0', '1', '2', '3'],
      attribution: '&copy; <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer">Google Maps</a>',
      maxZoom: 20,
    };
  }

  // 2. Mapbox Vector/Raster Tile API (tokens start with pk.)
  if (key.startsWith('pk.')) {
    return {
      provider: 'Mapbox',
      hasKey: true,
      url: `https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/{z}/{x}/{y}?access_token=${key}`,
      attribution: '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
      tileSize: 512,
      zoomOffset: -1,
    };
  }

  // 2. MapTiler API
  if (key && (key.toLowerCase().includes('maptiler') || (key.length >= 16 && key.length <= 26 && /^[a-zA-Z0-9]+$/.test(key)))) {
    return {
      provider: 'MapTiler',
      hasKey: true,
      url: `https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=${key}`,
      attribution: '&copy; <a href="https://www.maptiler.com/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    };
  }

  // 3. Stadia Maps API
  if (key && key.includes('stadia')) {
    return {
      provider: 'Stadia Maps',
      hasKey: true,
      url: `https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key=${key}`,
      attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a>',
      maxZoom: 20,
    };
  }

  // 4. Default high-reliability CartoDB Voyager & OpenStreetMap
  return {
    provider: 'OpenStreetMap & CartoDB',
    hasKey: Boolean(key),
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors & CartoDB',
    maxZoom: 19,
  };
}

/**
 * Returns weather radar precipitation tile layer configuration if a compatible key is available
 */
export function getWeatherRadarTileConfig(weatherKey = '') {
  const key = weatherKey || getMapApiKey();
  if (key && /^[a-f0-9]{32}$/i.test(key)) {
    return {
      active: true,
      url: `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${key}`,
      attribution: '&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a> Precipitation Radar',
      opacity: 0.65,
    };
  }
  return { active: false };
}
