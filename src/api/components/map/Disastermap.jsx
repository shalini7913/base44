import React, { useMemo } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { CITY_CENTER, DISASTER_TYPES } from '@/services/mockData';
import { useDisaster } from '@/services/DisasterContext';
import { Button } from '@/components/ui/button';
import { Phone, Navigation, ShieldAlert, Battery, Users, CloudRain, MapPin } from 'lucide-react';
import { getMapTileConfig, getWeatherRadarTileConfig } from '@/services/mapConfig';

// Interactive map click listener component for Leaflet
function MapLocationClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      if (onLocationSelect && e.latlng) {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

// Custom clean pin factory for light theme
function makeIcon(emoji, color, pulse = false) {
  return L.divIcon({
    className: 'resq-marker',
    html: `<div style="position:relative;width:38px;height:38px;display:flex;align-items:center;justify-content:center;">
      ${pulse ? `<div style="position:absolute;inset:0;border-radius:9999px;background:${color};opacity:0.35;animation:pulse-ring 2s infinite;"></div>` : ''}
      <div style="position:relative;width:32px;height:32px;border-radius:9999px;background:#ffffff;border:2.5px solid ${color};box-shadow:0 4px 14px rgba(0,0,0,0.15);display:flex;align-items:center;justify-content:center;font-size:16px;">${emoji}</div>
    </div>`,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
  });
}

const deviceIcon = (status) => {
  const map = {
    safe: ['🟢', '#16a34a', false],
    assistance: ['🟡', '#d97706', true],
    sos: ['🔴', '#dc2626', true],
    offline: ['⚪', '#94a3b8', false],
  };
  const [emoji, color, pulse] = map[status] || map.safe;
  return makeIcon(emoji, color, pulse);
};

const hospitalIcon = () => makeIcon('🏥', '#0284c7', false);
const userIcon = () => makeIcon('📍', '#db2777', true);

export default function DisasterMap({ selectedRoute, activeFilter = 'all' }) {
  const { devices, hospitals, userLocation, setMapLocation, sosActive, weather, weatherRisk } = useDisaster();

  // Dynamic Tile Layer config resolved from MAP_API_KEY environment variable
  const tileConfig = useMemo(() => getMapTileConfig(), []);
  const radarConfig = useMemo(() => getWeatherRadarTileConfig(), []);

  // Filtered devices
  const filteredDevices = devices.filter(d => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'sos') return d.status === 'sos';
    if (activeFilter === 'crews') return d.type === 'Rescue Crew';
    if (activeFilter === 'drones') return d.type.includes('Drone') || d.type.includes('UAV');
    return true;
  });

  const handleLocationClick = (lat, lng) => {
    setMapLocation(lat, lng, `Selected Coordinate (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
  };

  return (
    <div className="w-full h-full min-h-[420px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative bg-slate-100">
      <MapContainer
        center={CITY_CENTER}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        {/* Dynamic Map API Tile Layer */}
        <TileLayer
          key={tileConfig.url}
          attribution={tileConfig.attribution}
          url={tileConfig.url}
          maxZoom={tileConfig.maxZoom || 19}
          subdomains={tileConfig.subdomains || ['a', 'b', 'c']}
        />

        {/* Optional Weather Radar Precipitation Overlay (if supported by key) */}
        {radarConfig.active && (
          <TileLayer
            key={radarConfig.url}
            attribution={radarConfig.attribution}
            url={radarConfig.url}
            opacity={radarConfig.opacity}
          />
        )}

        {/* Real-time Map Click Location Detector */}
        <MapLocationClickHandler onLocationSelect={handleLocationClick} />

        {/* Hazard Epicenter Circles */}
        <Circle
          center={[18.5204, 73.8567]}
          radius={1200}
          pathOptions={{ color: '#dc2626', fillColor: '#ef4444', fillOpacity: 0.18, weight: 2, dashArray: '6, 6' }}
        />
        <Circle
          center={[18.5140, 73.8620]}
          radius={800}
          pathOptions={{ color: '#d97706', fillColor: '#f59e0b', fillOpacity: 0.15, weight: 2 }}
        />

        {/* User Current / Selected Location Marker */}
        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon()}>
          <Popup>
            <div className="p-1 space-y-1.5 min-w-[180px]">
              <div className="font-bold text-slate-900 flex items-center justify-between text-sm">
                <span>📍 Telemetry Point</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 font-bold">
                  {weather?.temp}°C
                </span>
              </div>
              <p className="text-xs text-slate-600">{userLocation.address}</p>
              
              {/* Real-Time Micro Weather Badge inside Popup */}
              <div className="text-[11px] p-1.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                <span className="font-medium text-slate-700">{weather?.condition}</span>
                <span className={`font-bold ${
                  weatherRisk?.isCritical ? 'text-red-600' : weatherRisk?.isHighRisk ? 'text-amber-600' : 'text-emerald-600'
                }`}>
                  {weatherRisk?.level}
                </span>
              </div>

              {sosActive && (
                <div className="mt-1 text-xs font-bold text-red-700 bg-red-50 p-1.5 rounded-lg border border-red-200">
                  🚨 ACTIVE SOS BROADCAST
                </div>
              )}
            </div>
          </Popup>
        </Marker>

        {/* Rescue Devices & Teams */}
        {filteredDevices.map(device => (
          <Marker key={device.id} position={device.location} icon={deviceIcon(device.status)}>
            <Popup>
              <div className="p-2 space-y-2 max-w-xs">
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
                  <span className="font-bold text-slate-900 text-sm">{device.name}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase font-bold ${
                    device.status === 'sos' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {device.status}
                  </span>
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  <p className="flex items-center justify-between">
                    <span className="text-slate-500">Zone:</span>
                    <span className="font-medium text-slate-900">{device.assignedZone}</span>
                  </p>
                  {device.personnel > 0 && (
                    <p className="flex items-center justify-between">
                      <span className="text-slate-500">Personnel:</span>
                      <span className="font-medium text-slate-900 flex items-center gap-1">
                        <Users className="w-3 h-3 text-slate-700" /> {device.personnel} responders
                      </span>
                    </p>
                  )}
                  <p className="flex items-center justify-between">
                    <span className="text-slate-500">Battery:</span>
                    <span className="font-medium text-slate-900 flex items-center gap-1">
                      <Battery className="w-3 h-3 text-emerald-600" /> {device.battery}%
                    </span>
                  </p>
                </div>
                <Button size="sm" variant="default" className="w-full text-xs h-8 mt-1 bg-slate-900 text-white">
                  <Phone className="w-3 h-3 mr-1" /> Contact Unit
                </Button>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Emergency Hospitals */}
        {hospitals.map(hosp => (
          <Marker key={hosp.id} position={hosp.coords} icon={hospitalIcon()}>
            <Popup>
              <div className="p-2 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">{hosp.name}</h4>
                <p className="text-xs text-slate-600">{hosp.address}</p>
                <div className="grid grid-cols-2 gap-1 text-[11px] font-mono bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <div>Beds: <span className="text-emerald-700 font-bold">{hosp.bedsAvailable}</span></div>
                  <div>ICU: <span className="text-amber-700 font-bold">{hosp.icuBeds}</span></div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Evacuation Route Polyline */}
        {selectedRoute && (
          <Polyline
            positions={selectedRoute.waypoints}
            pathOptions={{ color: selectedRoute.color || '#16a34a', weight: 5, opacity: 0.85, dashArray: '8, 8' }}
          />
        )}
      </MapContainer>

      {/* Floating Map Control Bar - Clean White Style */}
      <div className="absolute bottom-3 left-3 z-[400] bg-white/95 px-3.5 py-2 rounded-xl border border-slate-200 shadow-md text-xs flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> <span className="text-slate-700 font-medium">Hazard Zone</span></div>
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> <span className="text-slate-700 font-medium">Rescue Units</span></div>
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-sky-500" /> <span className="text-slate-700 font-medium">Hospitals</span></div>
        
        {/* Real-time telemetry summary & Map API indicator */}
        <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200 text-[11px]">
          <span className="flex items-center gap-1 text-slate-700 font-medium">
            <CloudRain className="w-3.5 h-3.5 text-sky-600" />
            {weather?.temp}°C ({weatherRisk?.level})
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
            {tileConfig.provider}
          </span>
        </div>
      </div>
    </div>
  );
}
