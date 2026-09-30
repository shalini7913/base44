import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { MOCK_ALERTS, MOCK_DEVICES, MOCK_HOSPITALS, MOCK_RESOURCES, MOCK_AGENTS, CITY_CENTER, MOCK_WEATHER } from './mockData';
import { fetchAlerts, fetchDevices, fetchHospitals, fetchResources, triggerSOSApi, cancelSOSApi, updateDevice } from './api';
import { socket } from './socket';
import { getRealtimeWeather } from './weatherService';
import { evaluateWeatherRisk, WEATHER_REFRESH_INTERVAL, WEATHER_RISK_LEVELS } from './weatherRiskConfig';
import sirenService from './sirenService';

const DisasterContext = createContext();

export function DisasterProvider({ children }) {
  const [alerts, setAlerts] = useState(MOCK_ALERTS);
  const [devices, setDevices] = useState(MOCK_DEVICES);
  const [hospitals, setHospitals] = useState(MOCK_HOSPITALS);
  const [resources, setResources] = useState(MOCK_RESOURCES);
  const [agents, setAgents] = useState(MOCK_AGENTS);
  
  // Real-time Weather & Risk State
  const [weather, setWeather] = useState(MOCK_WEATHER);
  const [weatherRisk, setWeatherRisk] = useState(() => evaluateWeatherRisk(MOCK_WEATHER));
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState(null);
  const [sirenActive, setSirenActive] = useState(false);
  const [audioBlocked, setAudioBlocked] = useState(false);
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [simulatedRisk, setSimulatedRisk] = useState(null);
  
  // User SOS & Location State
  const [sosActive, setSosActive] = useState(false);
  const [sosDetails, setSosDetails] = useState(null);
  const [userLocation, setUserLocation] = useState({
    lat: CITY_CENTER[0],
    lng: CITY_CENTER[1],
    address: 'Central ResQ Grid 4',
  });
  const [selectedMapLocation, setSelectedMapLocation] = useState(null);

  // Transition tracking ref to prevent repeated siren triggers on refresh
  const previousRiskLevelRef = useRef(WEATHER_RISK_LEVELS.NORMAL);

  // User Profile State
  const [userProfile, setUserProfile] = useState({
    name: 'Alex Mercer',
    phone: '+1 (555) 019-2834',
    bloodType: 'O Positive',
    medicalConditions: 'Asthma (Carries Inhaler)',
    allergies: 'Penicillin',
    emergencyContacts: [
      { name: 'Sarah Mercer (Spouse)', phone: '+1 (555) 987-6543', relation: 'Family' },
      { name: 'Dr. Robert Vance (Physician)', phone: '+1 (555) 444-2211', relation: 'Doctor' },
    ],
    status: 'SAFE',
  });

  // Authenticated User / Rescue Team Role State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('resq_user');
      return saved ? JSON.parse(saved) : {
        id: 'u-123',
        name: 'Alex Mercer',
        email: 'alex.mercer@resq.org',
        role: 'CITIZEN',
      };
    } catch {
      return { id: 'u-123', name: 'Alex Mercer', role: 'CITIZEN', email: 'alex.mercer@resq.org' };
    }
  });

  const loginUser = (userData) => {
    setCurrentUser(userData);
    try {
      localStorage.setItem('resq_user', JSON.stringify(userData));
    } catch (e) {
      console.warn('localStorage save failed:', e);
    }
    if (userData.role === 'CITIZEN') {
      setUserProfile(prev => ({
        ...prev,
        name: userData.name || prev.name,
        email: userData.email || prev.email,
      }));
    }
  };

  const logoutUser = () => {
    const defaultUser = {
      id: 'u-123',
      name: 'Alex Mercer',
      email: 'alex.mercer@resq.org',
      role: 'CITIZEN',
    };
    setCurrentUser(defaultUser);
    try {
      localStorage.removeItem('resq_user');
    } catch (e) {
      console.warn('localStorage clear failed:', e);
    }
  };

  // Initial Load from SQLite Backend
  useEffect(() => {
    async function loadBackendData() {
      const dbAlerts = await fetchAlerts();
      if (dbAlerts && dbAlerts.length > 0) setAlerts(dbAlerts);

      const dbDevices = await fetchDevices();
      if (dbDevices && dbDevices.length > 0) setDevices(dbDevices);

      const dbHospitals = await fetchHospitals();
      if (dbHospitals && dbHospitals.length > 0) setHospitals(dbHospitals);

      const dbResources = await fetchResources();
      if (dbResources && dbResources.length > 0) setResources(dbResources);
    }
    loadBackendData();
  }, []);

  // WebSockets Real-Time Event Listeners
  useEffect(() => {
    socket.on('sos:broadcast', (payload) => {
      console.log('🚨 Live WebSockets SOS Received:', payload);
      setSosActive(true);
      setSosDetails(payload);
    });

    socket.on('alert:created', (newAlert) => {
      setAlerts(prev => [newAlert, ...prev]);
    });

    socket.on('alert:updated', (updatedAlert) => {
      setAlerts(prev => prev.map(a => a.id === updatedAlert.id ? updatedAlert : a));
    });

    socket.on('device:updated', (updatedDevice) => {
      setDevices(prev => {
        const exists = prev.some(d => d.id === updatedDevice.id);
        if (exists) return prev.map(d => d.id === updatedDevice.id ? updatedDevice : d);
        return [updatedDevice, ...prev];
      });
    });

    return () => {
      socket.off('sos:broadcast');
      socket.off('alert:created');
      socket.off('alert:updated');
      socket.off('device:updated');
    };
  }, []);

  const triggerSOS = async (type = 'GENERAL_EMERGENCY', notes = '') => {
    const sosData = {
      type,
      notes,
      location: userLocation,
    };

    setSosActive(true);
    setUserProfile(prev => ({ ...prev, status: 'IN_DANGER' }));

    // Sound emergency siren immediately when user clicks the SOS button
    sirenService.startSiren();

    // Send to Backend API + WebSockets
    const apiResult = await triggerSOSApi(sosData);
    if (apiResult) {
      setSosDetails(apiResult);
    } else {
      const fallbackSos = {
        id: `SOS-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString(),
        type,
        notes,
        location: userLocation,
        status: 'DISPATCHING_RESCUE',
      };
      setSosDetails(fallbackSos);
    }

    socket.emit('sos:trigger', {
      type,
      notes,
      location: userLocation,
      timestamp: new Date().toISOString(),
    });
  };

  const cancelSOS = async () => {
    if (sosDetails?.id) {
      await cancelSOSApi(sosDetails.id);
    }
    setSosActive(false);
    setSosDetails(null);
    setUserProfile(prev => ({ ...prev, status: 'SAFE' }));
    sirenService.stopSiren();
  };

  const updateDeviceStatus = async (id, newStatus) => {
    setDevices(prev => prev.map(d => d.id === id ? { ...d, status: newStatus } : d));
    await updateDevice(id, { status: newStatus });
  };

  // Subscribe to siren service status
  useEffect(() => {
    const unsubscribe = sirenService.subscribe(({ isPlaying, isAudioBlocked }) => {
      setSirenActive(isPlaying);
      setAudioBlocked(isAudioBlocked);
    });
    return () => unsubscribe();
  }, []);

  // Weather fetch and risk evaluation function
  const fetchWeather = useCallback(async (coords = userLocation, forcedSimLevel = simulatedRisk) => {
    setWeatherLoading(true);
    setWeatherError(null);
    try {
      const data = await getRealtimeWeather(coords.lat, coords.lng);
      
      // Inject simulation if testing override is active
      const dataWithSim = forcedSimLevel ? {
        ...data,
        simulatedRiskLevel: forcedSimLevel,
        simulatedNotice: forcedSimLevel === WEATHER_RISK_LEVELS.CRITICAL 
          ? 'EMERGENCY: Extremely heavy rainfall & flash flood surge' 
          : forcedSimLevel === WEATHER_RISK_LEVELS.HIGH_RISK
          ? 'WARNING: Heavy rainfall & high wind detected'
          : 'Normal conditions active',
        simulatedReasons: forcedSimLevel === WEATHER_RISK_LEVELS.CRITICAL
          ? ['Extremely heavy rainfall (94 mm)', 'Critical wind gusts (88 km/h)']
          : forcedSimLevel === WEATHER_RISK_LEVELS.HIGH_RISK
          ? ['Heavy rainfall detected (52 mm)', 'High wind warning (62 km/h)']
          : ['All parameters within safe operating thresholds']
      } : data;

      const risk = evaluateWeatherRisk(dataWithSim);
      setWeather(dataWithSim);
      setWeatherRisk(risk);

      // Check risk transition for emergency siren trigger
      const previousLevel = previousRiskLevelRef.current;
      const currentLevel = risk.level;

      if (currentLevel === WEATHER_RISK_LEVELS.CRITICAL && previousLevel !== WEATHER_RISK_LEVELS.CRITICAL) {
        console.log(`🚨 Weather transitioned into CRITICAL (${previousLevel} -> ${currentLevel}). Triggering siren.`);
        setAlertDismissed(false);
        sirenService.startSiren();
      } else if (currentLevel !== WEATHER_RISK_LEVELS.CRITICAL && previousLevel === WEATHER_RISK_LEVELS.CRITICAL) {
        console.log(`Weather dropped below critical (${previousLevel} -> ${currentLevel}). Stopping siren.`);
        sirenService.stopSiren();
      }
      // Note: If currentLevel === CRITICAL and previousLevel === CRITICAL, repeated siren trigger is prevented.

      previousRiskLevelRef.current = currentLevel;
    } catch (err) {
      console.warn('Weather fetch encountered error:', err);
      setWeatherError(err.message || 'Unable to update weather telemetry');
    } finally {
      setWeatherLoading(false);
    }
  }, [userLocation, simulatedRisk]);

  // Initial weather load & automatic periodic refresh
  useEffect(() => {
    fetchWeather(userLocation, simulatedRisk);

    const intervalId = setInterval(() => {
      fetchWeather(userLocation, simulatedRisk);
    }, WEATHER_REFRESH_INTERVAL);

    return () => clearInterval(intervalId);
  }, [fetchWeather, userLocation, simulatedRisk]);

  // Handle map location selection: updates coordinates & immediately refetches weather
  const setMapLocation = useCallback((lat, lng, address = '') => {
    const newLocation = {
      lat: Number(lat),
      lng: Number(lng),
      address: address || `Grid Coordinates ${Number(lat).toFixed(4)}, ${Number(lng).toFixed(4)}`,
    };
    setSelectedMapLocation(newLocation);
    setUserLocation(newLocation);
  }, []);

  // Siren and alert action handlers
  const stopSiren = useCallback(() => {
    sirenService.stopSiren();
    setSirenActive(false);
  }, []);

  const enableAudio = useCallback(async () => {
    const unlocked = await sirenService.unlockAudio();
    if (unlocked && weatherRisk.isCritical && !alertDismissed) {
      sirenService.startSiren();
    }
  }, [weatherRisk.isCritical, alertDismissed]);

  const dismissAlert = useCallback(() => {
    setAlertDismissed(true);
    sirenService.stopSiren();
  }, []);

  const toggleSimulatedRisk = useCallback((level) => {
    setSimulatedRisk(prev => {
      const nextLevel = prev === level ? null : level;
      fetchWeather(userLocation, nextLevel);
      return nextLevel;
    });
  }, [fetchWeather, userLocation]);

  return (
    <DisasterContext.Provider
      value={{
        alerts,
        devices,
        hospitals,
        resources,
        agents,
        sosActive,
        sosDetails,
        userLocation,
        selectedMapLocation,
        setMapLocation,
        userProfile,
        setUserProfile,
        currentUser,
        loginUser,
        logoutUser,
        triggerSOS,
        cancelSOS,
        updateDeviceStatus,
        setResources,
        
        // Weather & Risk System
        weather,
        setWeather,
        weatherRisk,
        weatherLoading,
        weatherError,
        refreshWeather: () => fetchWeather(userLocation, simulatedRisk),
        
        // Siren & Red Alert Controls
        sirenActive,
        audioBlocked,
        alertDismissed,
        startSiren: () => sirenService.startSiren(),
        stopSiren,
        enableAudio,
        dismissAlert,
        simulatedRisk,
        toggleSimulatedRisk,
      }}
    >
      {children}
    </DisasterContext.Provider>
  );
}

export function useDisaster() {
  const context = useContext(DisasterContext);
  if (!context) {
    throw new Error('useDisaster must be used within a DisasterProvider');
  }
  return context;
}
