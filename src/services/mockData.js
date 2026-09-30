export const CITY_CENTER = [18.5204, 73.8567]; // Pune Metro Disaster Zone

export const DISASTER_TYPES = [
  { id: 'flood', name: 'Flash Flood Warning', icon: '🌊', color: '#06b6d4', severity: 'Critical' },
  { id: 'earthquake', name: 'Earthquake Tremor', icon: '⚡', color: '#f59e0b', severity: 'High' },
  { id: 'fire', name: 'Industrial Wildfire', icon: '🔥', color: '#ef4444', severity: 'Extreme' },
  { id: 'cyclone', name: 'Severe Cyclone', icon: '🌪️', color: '#a855f7', severity: 'High' },
  { id: 'landslide', name: 'Hillside Landslide', icon: '⛰️', color: '#84cc16', severity: 'Medium' },
];

export const MOCK_ALERTS = [
  {
    id: 'ALT-101',
    type: 'flood',
    title: 'Severe River Inundation Alert - Sector 4',
    location: 'Mula River Basin North',
    severity: 'Critical',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    description: 'Water level risen 3.4 meters above safety threshold. High current flow towards Lowland Colony.',
    actionRequired: 'Evacuate to Sector 4 Community Shelter immediately. Avoid underpasses.',
    impactedPeople: '~14,200',
    status: 'ACTIVE',
  },
  {
    id: 'ALT-102',
    type: 'fire',
    title: 'Chemical Tanker Explosion & Smoke Cloud',
    location: 'Industrial Zone Phase 2',
    severity: 'Extreme',
    timestamp: new Date(Date.now() - 42 * 60000).toISOString(),
    description: 'Hazardous gas leak spreading Eastward at 18 km/h. Toxic air index 410.',
    actionRequired: 'Seal windows, turn off air ducts. Respirators required within 2km radius.',
    impactedPeople: '~8,500',
    status: 'ACTIVE',
  },
  {
    id: 'ALT-103',
    type: 'landslide',
    title: 'Ghat Road Hill Collapse Risk',
    location: 'Western Bypass Highway KM 14',
    severity: 'Medium',
    timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
    description: 'Debris flow blocked 2 lanes. Structural instability detected on hillside.',
    actionRequired: 'Use alternative Express Bypass Route B. Rescue crews clearing debris.',
    impactedPeople: '~3,100',
    status: 'MONITORING',
  },
  {
    id: 'ALT-104',
    type: 'earthquake',
    title: 'Magnitude 4.8 Seismic Aftershock',
    location: 'Eastern Faultline Belt',
    severity: 'High',
    timestamp: new Date(Date.now() - 210 * 60000).toISOString(),
    description: 'Tremors felt across 12 residential blocks. Minor structural cracks reported.',
    actionRequired: 'Inspect gas pipelines. Stay clear of elevated bridges and glass facades.',
    impactedPeople: '~32,000',
    status: 'ACTIVE',
  },
];

export const MOCK_DEVICES = [
  {
    id: 'TEAM-ALPHA',
    name: 'Alpha Search & Rescue Unit',
    type: 'Rescue Crew',
    status: 'sos', // safe, assistance, sos, offline
    location: [18.5280, 73.8520],
    battery: 88,
    personnel: 8,
    vehicle: 'Amphibious All-Terrain Truck',
    assignedZone: 'Sector 4 Riverbank',
    contact: '+1 (800) 555-0199',
    lastPing: '2 mins ago',
  },
  {
    id: 'DRONE-01',
    name: 'SkyScout Thermal Drone #1',
    type: 'UAV Aerial Recon',
    status: 'assistance',
    location: [18.5140, 73.8620],
    battery: 64,
    altitude: '120m',
    sensor: 'FLIR Thermal + Gas Detector',
    assignedZone: 'Industrial Zone Phase 2',
    contact: 'Telemetry Mesh 915MHz',
    lastPing: '30 sec ago',
  },
  {
    id: 'TEAM-BRAVO',
    name: 'Bravo Paramedic Squad',
    type: 'Medical Response',
    status: 'safe',
    location: [18.5350, 73.8450],
    battery: 95,
    personnel: 5,
    vehicle: 'Mobile Intensive Care Van',
    assignedZone: 'North Emergency Camp',
    contact: '+1 (800) 555-0144',
    lastPing: '1 min ago',
  },
  {
    id: 'BOAT-03',
    name: 'AquaSwift Power Boat #3',
    type: 'Water Rescue',
    status: 'sos',
    location: [18.5220, 73.8480],
    battery: 72,
    personnel: 4,
    vehicle: 'High-speed Rigid Inflatable',
    assignedZone: 'Mula Bridge Submerged Area',
    contact: '+1 (800) 555-0182',
    lastPing: 'Just now',
  },
  {
    id: 'BEACON-88',
    name: 'Community SOS Beacon #88',
    type: 'Fixed IoT Node',
    status: 'offline',
    location: [18.5080, 73.8400],
    battery: 12,
    personnel: 0,
    vehicle: 'Solar Relay Post',
    assignedZone: 'Old Town Square',
    contact: 'LoRa Gateway',
    lastPing: '45 mins ago',
  }
];

export const MOCK_HOSPITALS = [
  {
    id: 'HOSP-01',
    name: 'Apex Trauma & Disaster Medical Center',
    address: '102 Emergency Ave, Central District',
    distance: '1.4 km',
    bedsAvailable: 34,
    icuBeds: 8,
    oxygenLevel: '98%',
    bloodBank: 'O+ A+ B+ AB- In Stock',
    traumaLevel: 'Level 1 Emergency Care',
    phone: '+1 (800) 911-APEX',
    status: 'OPERATIONAL',
    coords: [18.5250, 73.8610],
  },
  {
    id: 'HOSP-02',
    name: 'Metro General Red Cross Hospital',
    address: '45 Relief Boulevard, East Division',
    distance: '3.2 km',
    bedsAvailable: 12,
    icuBeds: 2,
    oxygenLevel: '85%',
    bloodBank: 'Critical Need O-',
    traumaLevel: 'Level 2 Emergency Care',
    phone: '+1 (800) 911-METRO',
    status: 'HIGH OCCUPANCY',
    coords: [18.5120, 73.8710],
  },
  {
    id: 'HOSP-03',
    name: 'Field Medical Emergency Unit #4',
    address: 'Sector 4 High School Ground Base',
    distance: '0.8 km',
    bedsAvailable: 50,
    icuBeds: 10,
    oxygenLevel: '100%',
    bloodBank: 'Emergency Plasma Stock',
    traumaLevel: 'Mobile Field Surgery',
    phone: '+1 (800) 911-FIELD4',
    status: 'DISASTER FIELD BASE',
    coords: [18.5310, 73.8490],
  },
];

export const MOCK_SAFE_ROUTES = [
  {
    id: 'RTE-1',
    title: 'North Evacuation Corridor Alpha',
    destination: 'Sector 4 High School Field Shelter',
    distance: '2.8 km',
    estTime: '18 mins (Walking)',
    safetyScore: '96% SAFE',
    color: '#10b981',
    hazardAvoided: 'Avoids Submerged Mula Bridge & Gas Leak Zone',
    waypoints: [
      [18.5204, 73.8567],
      [18.5250, 73.8530],
      [18.5290, 73.8510],
      [18.5310, 73.8490]
    ]
  },
  {
    id: 'RTE-2',
    title: 'East Bypass Relief Track',
    destination: 'Stadium Emergency Assembly Point',
    distance: '4.1 km',
    estTime: '35 mins (Vehicle)',
    safetyScore: '84% MODERATE',
    color: '#f59e0b',
    hazardAvoided: 'Clears Hillside Debris but expect slow traffic',
    waypoints: [
      [18.5204, 73.8567],
      [18.5180, 73.8640],
      [18.5140, 73.8690],
      [18.5120, 73.8710]
    ]
  }
];

export const MOCK_RESOURCES = [
  { id: 'RES-01', category: 'Medical Kits', quantity: 450, unit: 'Boxes', status: 'Sufficient', location: 'Central Warehouse A' },
  { id: 'RES-02', category: 'Clean Drinking Water', quantity: 12000, unit: 'Liters', status: 'High Demand', location: 'Sector 4 Base' },
  { id: 'RES-03', category: 'Inflatable Life Boats', quantity: 18, unit: 'Vessels', status: 'Deployed', location: 'Riverfront Hub' },
  { id: 'RES-04', category: 'Diesel Power Generators', quantity: 24, unit: 'Units', status: 'Sufficient', location: 'Depot South' },
  { id: 'RES-05', category: 'Rations & Ready Meals', quantity: 8500, unit: 'Packs', status: 'Dispatching', location: 'Red Cross Center' },
  { id: 'RES-06', category: 'Thermal Blankets', quantity: 3200, unit: 'Units', status: 'Low Stock', location: 'Stadium Shelter' },
];

export const MOCK_AGENTS = [
  {
    id: 'AGENT-TRIAGE',
    name: 'SOS Emergency Triaging Agent',
    type: 'Autonomous AI Dispatcher',
    status: 'ACTIVE',
    processedCount: 142,
    accuracy: '99.4%',
    action: 'Prioritizing cardiac patients and trapped individuals in flooded Sector 4.',
  },
  {
    id: 'AGENT-NAV',
    name: 'Dynamic Route Optimizer Agent',
    type: 'AI Pathfinder',
    status: 'ACTIVE',
    processedCount: 890,
    accuracy: '98.1%',
    action: 'Rerouting evacuation traffic away from Chemical Leak Cloud on Highway 12.',
  },
  {
    id: 'AGENT-DRONE',
    name: 'SkyScout Thermal Fleet Controller',
    type: 'Autonomous UAV Swarm',
    status: 'PATROLLING',
    processedCount: 56,
    accuracy: '96.8%',
    action: 'Scanning thermal heat signatures under collapsed bridge structure.',
  },
  {
    id: 'AGENT-RESOURCE',
    name: 'Resource Matrix Auto-Allocator',
    type: 'Logistics Intelligence',
    status: 'ACTIVE',
    processedCount: 310,
    accuracy: '99.0%',
    action: 'Auto-dispatching 5,000L water and 200 medical kits to North Field Base.',
  }
];

export const MOCK_REGIONS = [
  { id: 'REG-1', name: 'Sector 1 - Central Downtown', riskLevel: 'Medium', evacuated: '82%', casualties: 0, shelters: 4, teamAssigned: 'Alpha Team' },
  { id: 'REG-2', name: 'Sector 4 - Mula River North', riskLevel: 'Critical', evacuated: '94%', casualties: 2, shelters: 6, teamAssigned: 'Alpha & Boat #3' },
  { id: 'REG-3', name: 'Industrial Phase 2', riskLevel: 'Extreme', evacuated: '98%', casualties: 1, shelters: 2, teamAssigned: 'Hazard Hazmat Unit' },
  { id: 'REG-4', name: 'Eastern Hills Belt', riskLevel: 'Low', evacuated: '60%', casualties: 0, shelters: 3, teamAssigned: 'Bravo Squad' },
];

export const MOCK_WEATHER = {
  location: 'Metropolitan District & River Basin',
  subLocation: 'Sector 4 Flood Plain Zone',
  temp: 27,
  tempF: 81,
  condition: 'Heavy Rainfall & Thunderstorm',
  severity: 'Warning',
  severityNotice: 'River Inundation & Flash Flood Watch',
  humidity: '88%',
  wind: '34 km/h NE (Gusts 52 km/h)',
  rainfall: '68 mm / 24h',
  pressure: '998 hPa',
  visibility: '3.2 km',
  airQuality: 'Moderate (AQI 115)',
  lastUpdated: 'Just now (Automated Doppler Feed)',
  forecast: [
    { day: 'Today', temp: '27°C / 22°C', condition: 'Heavy Rain', rainfall: '75mm', chance: '95%' },
    { day: 'Tomorrow', temp: '26°C / 21°C', condition: 'Thunderstorms', rainfall: '50mm', chance: '85%' },
    { day: 'Friday', temp: '28°C / 23°C', condition: 'Scattered Showers', rainfall: '20mm', chance: '60%' },
    { day: 'Saturday', temp: '30°C / 24°C', condition: 'Partly Cloudy', rainfall: '5mm', chance: '25%' },
  ]
};

