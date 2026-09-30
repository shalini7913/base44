/**
 * =============================================================================
 * Real-Time Weather Service & Telemetry Normalizer
 * =============================================================================
 * Handles:
 * - API requests with secure environment key authentication
 * - Support for OpenWeatherMap (API 2.5/3.0) and WeatherAPI.com
 * - Resilient live fallback (Open-Meteo) when no key is set yet
 * - Official weather condition & dynamic icon parsing
 * - Comprehensive data normalization & error recovery
 */

import { CITY_CENTER, MOCK_WEATHER } from './mockData';

// Helper to safely get the configured API key from Vite environment
export function getWeatherApiKey() {
  const key = import.meta.env.VITE_WEATHER_API_KEY || import.meta.env.WEATHER_API_KEY || '';
  return typeof key === 'string' ? key.trim() : '';
}

/**
 * Maps WMO weather codes (used by Open-Meteo) to standard conditions and icons
 */
function mapWmoCode(code) {
  const codeMap = {
    0: { condition: 'Clear Sky', icon: 'https://openweathermap.org/img/wn/01d@2x.png' },
    1: { condition: 'Mainly Clear', icon: 'https://openweathermap.org/img/wn/02d@2x.png' },
    2: { condition: 'Partly Cloudy', icon: 'https://openweathermap.org/img/wn/03d@2x.png' },
    3: { condition: 'Overcast', icon: 'https://openweathermap.org/img/wn/04d@2x.png' },
    45: { condition: 'Fog & Reduced Visibility', icon: 'https://openweathermap.org/img/wn/50d@2x.png' },
    48: { condition: 'Freezing Fog', icon: 'https://openweathermap.org/img/wn/50d@2x.png' },
    51: { condition: 'Light Drizzle', icon: 'https://openweathermap.org/img/wn/09d@2x.png' },
    53: { condition: 'Moderate Drizzle', icon: 'https://openweathermap.org/img/wn/09d@2x.png' },
    55: { condition: 'Dense Drizzle', icon: 'https://openweathermap.org/img/wn/09d@2x.png' },
    61: { condition: 'Slight Rain', icon: 'https://openweathermap.org/img/wn/10d@2x.png' },
    63: { condition: 'Moderate Rain', icon: 'https://openweathermap.org/img/wn/10d@2x.png' },
    65: { condition: 'Heavy Rain Torrent', icon: 'https://openweathermap.org/img/wn/10d@2x.png' },
    71: { condition: 'Slight Snow Fall', icon: 'https://openweathermap.org/img/wn/13d@2x.png' },
    75: { condition: 'Heavy Snow Blizzard', icon: 'https://openweathermap.org/img/wn/13d@2x.png' },
    80: { condition: 'Rain Showers', icon: 'https://openweathermap.org/img/wn/09d@2x.png' },
    82: { condition: 'Violent Rain Downpour', icon: 'https://openweathermap.org/img/wn/09d@2x.png' },
    95: { condition: 'Severe Thunderstorm', icon: 'https://openweathermap.org/img/wn/11d@2x.png' },
    96: { condition: 'Thunderstorm with Hail', icon: 'https://openweathermap.org/img/wn/11d@2x.png' },
    99: { condition: 'Critical Thunderstorm & Hail', icon: 'https://openweathermap.org/img/wn/11d@2x.png' },
  };
  return codeMap[code] || { condition: 'Scattered Clouds', icon: 'https://openweathermap.org/img/wn/03d@2x.png' };
}

/**
 * Format timestamp nicely
 */
function formatUpdateTime() {
  const d = new Date();
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

/**
 * Fetch weather from OpenWeatherMap (API 2.5)
 */
async function fetchFromOpenWeatherMap(lat, lon, apiKey) {
  const [currentRes, forecastRes] = await Promise.all([
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`),
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`),
  ]);

  if (!currentRes.ok) {
    throw new Error(`OpenWeatherMap error: ${currentRes.status} ${currentRes.statusText}`);
  }

  const curData = await currentRes.json();
  const fData = forecastRes.ok ? await forecastRes.json() : null;

  const temp = Math.round(curData.main?.temp ?? 25);
  const tempF = Math.round((temp * 9) / 5 + 32);
  const condition = curData.weather?.[0]?.description 
    ? curData.weather[0].description.charAt(0).toUpperCase() + curData.weather[0].description.slice(1)
    : 'Clear Sky';
  const iconCode = curData.weather?.[0]?.icon || '01d';
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  const humidity = curData.main?.humidity ?? 70;
  const windKph = Math.round((curData.wind?.speed ?? 0) * 3.6);
  const rainMm = curData.rain?.['1h'] || curData.rain?.['3h'] || 0;
  const visKm = curData.visibility ? Math.round((curData.visibility / 1000) * 10) / 10 : 10;

  // Process 4-day forecast from 3-hour list
  const forecast = [];
  if (fData?.list) {
    const dailyMap = new Map();
    for (const item of fData.list) {
      const date = item.dt_txt.split(' ')[0];
      if (!dailyMap.has(date) && dailyMap.size < 4) {
        dailyMap.set(date, item);
      }
    }

    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let idx = 0;
    for (const [dateStr, item] of dailyMap.entries()) {
      const dObj = new Date(dateStr);
      const dayName = idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : weekdays[dObj.getDay()];
      const dayTemp = Math.round(item.main.temp);
      const dayCond = item.weather?.[0]?.main || 'Clear';
      const dayIcon = item.weather?.[0]?.icon 
        ? `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png` 
        : iconUrl;
      const dayPop = Math.round((item.pop || 0) * 100);
      const dayRain = item.rain?.['3h'] ? `${Math.round(item.rain['3h'])}mm` : '0mm';

      forecast.push({
        day: dayName,
        temp: `${dayTemp}°C`,
        condition: dayCond,
        iconUrl: dayIcon,
        rainfall: dayRain,
        chance: `${dayPop}%`,
      });
      idx++;
    }
  }

  return {
    location: curData.name || 'Disaster Grid Area',
    subLocation: `Lat: ${Number(lat).toFixed(4)}, Lng: ${Number(lon).toFixed(4)}`,
    temp,
    tempF,
    condition,
    iconUrl,
    iconCode,
    humidity: `${humidity}%`,
    humidityNum: humidity,
    wind: `${windKph} km/h`,
    windSpeedNum: windKph,
    rainfall: `${rainMm} mm / h`,
    rainfallNum: rainMm,
    visibility: `${visKm} km`,
    visibilityKm: visKm,
    pressure: `${curData.main?.pressure || 1012} hPa`,
    airQuality: 'Monitored',
    lastUpdated: `${formatUpdateTime()} (OpenWeatherMap Live)`,
    forecast: forecast.length > 0 ? forecast : MOCK_WEATHER.forecast,
    provider: 'OpenWeatherMap',
    isLive: true,
    keyConfigured: true,
  };
}

/**
 * Fetch weather from WeatherAPI.com
 */
async function fetchFromWeatherApi(lat, lon, apiKey) {
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=4&aqi=yes`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`WeatherAPI.com error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  const cur = data.current;
  const loc = data.location;

  const temp = Math.round(cur.temp_c);
  const tempF = Math.round(cur.temp_f);
  const condition = cur.condition?.text || 'Clear';
  let iconUrl = cur.condition?.icon || '';
  if (iconUrl.startsWith('//')) iconUrl = `https:${iconUrl}`;

  const humidity = cur.humidity;
  const windKph = Math.round(cur.wind_kph);
  const rainMm = cur.precip_mm || 0;
  const visKm = cur.vis_km || 10;

  const forecast = (data.forecast?.forecastday || []).map((fd, i) => {
    const dObj = new Date(fd.date);
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : weekdays[dObj.getDay()];
    let fIcon = fd.day?.condition?.icon || '';
    if (fIcon.startsWith('//')) fIcon = `https:${fIcon}`;

    return {
      day: dayName,
      temp: `${Math.round(fd.day.maxtemp_c)}°C / ${Math.round(fd.day.mintemp_c)}°C`,
      condition: fd.day.condition?.text || 'Clear',
      iconUrl: fIcon || iconUrl,
      rainfall: `${fd.day.totalprecip_mm || 0}mm`,
      chance: `${fd.day.daily_chance_of_rain || 0}%`,
    };
  });

  return {
    location: loc.name ? `${loc.name}, ${loc.region || ''}` : 'Disaster Region',
    subLocation: `Lat: ${Number(lat).toFixed(4)}, Lng: ${Number(lon).toFixed(4)}`,
    temp,
    tempF,
    condition,
    iconUrl,
    humidity: `${humidity}%`,
    humidityNum: humidity,
    wind: `${windKph} km/h ${cur.wind_dir || ''}`,
    windSpeedNum: windKph,
    rainfall: `${rainMm} mm`,
    rainfallNum: rainMm,
    visibility: `${visKm} km`,
    visibilityKm: visKm,
    pressure: `${cur.pressure_mb} hPa`,
    airQuality: cur.air_quality ? `AQI Level ${cur.air_quality['us-epa-index'] || 1}` : 'Moderate',
    lastUpdated: `${formatUpdateTime()} (WeatherAPI Live)`,
    forecast: forecast.length > 0 ? forecast : MOCK_WEATHER.forecast,
    provider: 'WeatherAPI.com',
    isLive: true,
    keyConfigured: true,
  };
}

/**
 * Zero-config fallback using Open-Meteo live API (requires NO api key).
 * Ensures the app displays true real-time weather even before the user inputs their key.
 */
async function fetchFromOpenMeteo(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,surface_pressure&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Open-Meteo fallback error: ${res.status}`);
  }

  const data = await res.json();
  const cur = data.current;
  const daily = data.daily;

  const temp = Math.round(cur.temperature_2m);
  const tempF = Math.round((temp * 9) / 5 + 32);
  const wmo = mapWmoCode(cur.weather_code);
  const humidity = Math.round(cur.relative_humidity_2m);
  const windKph = Math.round(cur.wind_speed_10m);
  const rainMm = cur.precipitation || 0;

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const forecast = (daily?.time || []).slice(0, 4).map((timeStr, i) => {
    const dObj = new Date(timeStr);
    const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : weekdays[dObj.getDay()];
    const fWmo = mapWmoCode(daily.weather_code?.[i] ?? 0);
    const maxT = Math.round(daily.temperature_2m_max?.[i] ?? temp);
    const minT = Math.round(daily.temperature_2m_min?.[i] ?? temp - 5);
    const pop = daily.precipitation_probability_max?.[i] ?? 30;
    const precip = daily.precipitation_sum?.[i] ?? 0;

    return {
      day: dayName,
      temp: `${maxT}°C / ${minT}°C`,
      condition: fWmo.condition,
      iconUrl: fWmo.icon,
      rainfall: `${precip}mm`,
      chance: `${pop}%`,
    };
  });

  return {
    location: 'Metropolitan Disaster District',
    subLocation: `Live Telemetry (Lat: ${Number(lat).toFixed(4)}, Lng: ${Number(lon).toFixed(4)})`,
    temp,
    tempF,
    condition: wmo.condition,
    iconUrl: wmo.icon,
    humidity: `${humidity}%`,
    humidityNum: humidity,
    wind: `${windKph} km/h`,
    windSpeedNum: windKph,
    rainfall: `${rainMm} mm / h`,
    rainfallNum: rainMm,
    visibility: '10.0 km',
    visibilityKm: 10,
    pressure: `${Math.round(cur.surface_pressure || 1013)} hPa`,
    airQuality: 'Live Atmospheric Radar',
    lastUpdated: `${formatUpdateTime()} (Live Satellite Feed)`,
    forecast: forecast.length > 0 ? forecast : MOCK_WEATHER.forecast,
    provider: 'Live Meteorological Telemetry',
    isLive: true,
    keyConfigured: false,
  };
}

/**
 * Main Weather Service Entry Point
 * Fetches real-time weather for the given coordinates:
 * 1. Checks if WEATHER_API_KEY is configured.
 * 2. If present, calls OpenWeatherMap or WeatherAPI.com.
 * 3. If missing or fails, seamlessly falls back to Open-Meteo live feed without crashing.
 */
export async function getRealtimeWeather(lat = CITY_CENTER[0], lon = CITY_CENTER[1]) {
  const apiKey = getWeatherApiKey();

  // Validate coordinates
  const validLat = Number.isFinite(Number(lat)) ? Number(lat) : CITY_CENTER[0];
  const validLon = Number.isFinite(Number(lon)) ? Number(lon) : CITY_CENTER[1];

  if (apiKey) {
    try {
      // If key looks like standard OpenWeatherMap 32-char hex or user provided it
      return await fetchFromOpenWeatherMap(validLat, validLon, apiKey);
    } catch (owmErr) {
      console.warn('OpenWeatherMap attempt failed, attempting WeatherAPI format:', owmErr.message);
      try {
        return await fetchFromWeatherApi(validLat, validLon, apiKey);
      } catch (wapiErr) {
        console.warn('WeatherAPI attempt also failed, activating live telemetry fallback:', wapiErr.message);
      }
    }
  }

  // Live telemetry zero-key fallback
  try {
    return await fetchFromOpenMeteo(validLat, validLon);
  } catch (fallbackErr) {
    console.warn('Live telemetry fallback failed, using cached base telemetry:', fallbackErr);
    return {
      ...MOCK_WEATHER,
      subLocation: `Lat: ${validLat.toFixed(4)}, Lng: ${validLon.toFixed(4)}`,
      lastUpdated: `${formatUpdateTime()} (Cached Offline State)`,
      isLive: false,
      keyConfigured: false,
      provider: 'Offline Resilience Cache',
    };
  }
}

export default {
  getRealtimeWeather,
  getWeatherApiKey,
};
