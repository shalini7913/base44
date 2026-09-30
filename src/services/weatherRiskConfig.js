/**
 * =============================================================================
 * Centralized Weather Risk Monitoring & Threshold Configuration
 * =============================================================================
 * Defines all safety, warning, and critical thresholds for disaster monitoring.
 * Multi-factor evaluation classifies conditions into:
 *   - NORMAL: Safe/current conditions
 *   - LOW RISK: Minor potentially concerning conditions
 *   - HIGH RISK: Conditions requiring elevated caution/alert
 *   - CRITICAL: Severe conditions triggering immediate emergency siren & red alert
 */

// Default automatic telemetry refresh interval in milliseconds (30 seconds)
export const DEFAULT_WEATHER_REFRESH_INTERVAL = 30000;

export const WEATHER_REFRESH_INTERVAL = 
  Number(import.meta.env.VITE_WEATHER_REFRESH_INTERVAL) || DEFAULT_WEATHER_REFRESH_INTERVAL;

export const WEATHER_RISK_LEVELS = {
  NORMAL: 'NORMAL',
  LOW_RISK: 'LOW RISK',
  HIGH_RISK: 'HIGH RISK',
  CRITICAL: 'CRITICAL',
};

export const WEATHER_RISK_CONFIG = {
  // Rainfall thresholds in millimeters (24h or current precipitation rate)
  rainfall: {
    moderateThresholdMm: 15,    // > 15mm: Moderate rain -> LOW RISK
    heavyThresholdMm: 45,       // > 45mm: Heavy rainfall -> HIGH RISK
    criticalThresholdMm: 75,    // > 75mm: Torrential downpour / flash flood hazard -> CRITICAL
  },

  // Wind speed thresholds in km/h
  windSpeed: {
    moderateThresholdKph: 35,   // > 35 km/h: Gusty breeze -> LOW RISK
    highThresholdKph: 60,       // > 60 km/h: Gale force winds -> HIGH RISK
    criticalThresholdKph: 85,   // > 85 km/h: Storm / hurricane-level winds -> CRITICAL
  },

  // Extreme Temperature thresholds in °C
  temperature: {
    extremeColdWarningC: 2,     // <= 2°C: Freezing warning -> LOW/HIGH RISK
    extremeColdCriticalC: -8,   // <= -8°C: Severe frostbite & freezing emergency -> CRITICAL
    extremeHeatWarningC: 38,    // >= 38°C: High heat advisory -> HIGH RISK
    extremeHeatCriticalC: 44,   // >= 44°C: Life-threatening heatwave emergency -> CRITICAL
  },

  // Relative Humidity thresholds in %
  humidity: {
    warningThresholdPercent: 90,  // >= 90%: Near-saturation, high risk of sudden flash downpours
  },

  // Visibility minimum thresholds in km
  visibility: {
    lowVisibilityKm: 1.5,       // <= 1.5 km: Thick fog/storm -> LOW RISK
    criticalVisibilityKm: 0.5,  // <= 0.5 km: Near-zero visibility hazard -> HIGH RISK
  },

  // Severe weather keywords (case-insensitive substring search in API condition text)
  severeConditions: {
    critical: [
      'tornado',
      'cyclone',
      'hurricane',
      'typhoon',
      'flash flood',
      'torrential',
      'violent storm',
      'severe thunderstorm',
      'blizzard',
      'extreme rain',
      'derecho',
      'tsunami',
    ],
    high: [
      'thunderstorm',
      'heavy rain',
      'tropical storm',
      'squall',
      'gale',
      'hail',
      'freezing rain',
      'sandstorm',
      'dust storm',
      'heavy snow',
    ],
    low: [
      'moderate rain',
      'light rain',
      'showers',
      'drizzle',
      'fog',
      'dense mist',
      'windy',
    ],
  },

  // Multi-factor escalation rules:
  // If 2 or more distinct HIGH RISK factors exist simultaneously, automatically escalate to CRITICAL
  multiFactorEscalation: {
    highFactorsToEscalateToCritical: 2,
  },
};

/**
 * Extracts a numeric value from string representations like "68 mm / 24h", "34 km/h", "88%"
 */
export function parseNumericMetric(val) {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  const match = String(val).match(/-?\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : 0;
}

/**
 * Evaluates real-time weather against centralized thresholds and returns:
 * - level: 'NORMAL' | 'LOW RISK' | 'HIGH RISK' | 'CRITICAL'
 * - reasons: array of specific trigger descriptions
 * - summary: formatted label (e.g. "CRITICAL — Extremely heavy rainfall + high wind speed")
 * - isCritical: boolean
 * - isHighRisk: boolean
 */
export function evaluateWeatherRisk(weatherData) {
  if (!weatherData) {
    return {
      level: WEATHER_RISK_LEVELS.NORMAL,
      reasons: [],
      summary: 'Safe conditions (Waiting for telemetry)',
      severityNotice: 'Normal environmental parameters',
      isCritical: false,
      isHighRisk: false,
      factors: {},
    };
  }

  // Allow manual simulation override if specified for testing
  if (weatherData.simulatedRiskLevel) {
    const simLevel = weatherData.simulatedRiskLevel;
    const isCrit = simLevel === WEATHER_RISK_LEVELS.CRITICAL;
    const isHigh = isCrit || simLevel === WEATHER_RISK_LEVELS.HIGH_RISK;
    return {
      level: simLevel,
      reasons: weatherData.simulatedReasons || [`Simulated ${simLevel} state for testing`],
      summary: `${simLevel} — ${weatherData.simulatedNotice || 'Active monitoring'}`,
      severityNotice: weatherData.simulatedNotice || `Environmental alert (${simLevel})`,
      isCritical: isCrit,
      isHighRisk: isHigh,
      factors: { simulated: true },
    };
  }

  const { rainfall, windSpeed, temperature, humidity, visibility, severeConditions, multiFactorEscalation } = WEATHER_RISK_CONFIG;

  const temp = typeof weatherData.temp === 'number' ? weatherData.temp : parseNumericMetric(weatherData.temp);
  const rain = typeof weatherData.rainfallNum === 'number' ? weatherData.rainfallNum : parseNumericMetric(weatherData.rainfall);
  const wind = typeof weatherData.windSpeedNum === 'number' ? weatherData.windSpeedNum : parseNumericMetric(weatherData.wind);
  const hum = typeof weatherData.humidityNum === 'number' ? weatherData.humidityNum : parseNumericMetric(weatherData.humidity);
  const vis = typeof weatherData.visibilityKm === 'number' ? weatherData.visibilityKm : parseNumericMetric(weatherData.visibility);
  const conditionLower = (weatherData.condition || '').toLowerCase();

  const criticalReasons = [];
  const highReasons = [];
  const lowReasons = [];

  // 1. Evaluate Rainfall
  if (rain >= rainfall.criticalThresholdMm) {
    criticalReasons.push(`Extremely heavy rainfall (${rain} mm)`);
  } else if (rain >= rainfall.heavyThresholdMm) {
    highReasons.push(`Heavy rainfall detected (${rain} mm)`);
  } else if (rain >= rainfall.moderateThresholdMm) {
    lowReasons.push(`Moderate precipitation (${rain} mm)`);
  }

  // 2. Evaluate Wind Speed
  if (wind >= windSpeed.criticalThresholdKph) {
    criticalReasons.push(`Extreme storm-force wind speed (${wind} km/h)`);
  } else if (wind >= windSpeed.highThresholdKph) {
    highReasons.push(`High wind warning (${wind} km/h)`);
  } else if (wind >= windSpeed.moderateThresholdKph) {
    lowReasons.push(`Gusty wind conditions (${wind} km/h)`);
  }

  // 3. Evaluate Temperature Extremes
  if (temp >= temperature.extremeHeatCriticalC) {
    criticalReasons.push(`Critical heatwave emergency (${temp}°C)`);
  } else if (temp >= temperature.extremeHeatWarningC) {
    highReasons.push(`Extreme temperature advisory (${temp}°C)`);
  } else if (temp <= temperature.extremeColdCriticalC) {
    criticalReasons.push(`Dangerous freezing temperatures (${temp}°C)`);
  } else if (temp <= temperature.extremeColdWarningC) {
    highReasons.push(`Freezing ground conditions (${temp}°C)`);
  }

  // 4. Evaluate Humidity & Visibility
  if (hum >= humidity.warningThresholdPercent && rain >= rainfall.moderateThresholdMm) {
    highReasons.push(`Air saturation critical (${hum}%) with rain`);
  }
  if (vis > 0 && vis <= visibility.criticalVisibilityKm) {
    highReasons.push(`Hazardous near-zero visibility (${vis} km)`);
  } else if (vis > 0 && vis <= visibility.lowVisibilityKm) {
    lowReasons.push(`Reduced visibility (${vis} km)`);
  }

  // 5. Evaluate Severe Condition Keywords from API
  for (const keyword of severeConditions.critical) {
    if (conditionLower.includes(keyword)) {
      criticalReasons.push(`Severe condition detected: ${weatherData.condition}`);
      break;
    }
  }
  if (criticalReasons.length === 0) {
    for (const keyword of severeConditions.high) {
      if (conditionLower.includes(keyword)) {
        highReasons.push(`Severe weather advisory: ${weatherData.condition}`);
        break;
      }
    }
  }
  if (criticalReasons.length === 0 && highReasons.length === 0) {
    for (const keyword of severeConditions.low) {
      if (conditionLower.includes(keyword)) {
        lowReasons.push(`Minor weather disturbance: ${weatherData.condition}`);
        break;
      }
    }
  }

  // Multi-factor escalation: If multiple high-risk factors trigger together, escalate to CRITICAL
  if (criticalReasons.length === 0 && highReasons.length >= multiFactorEscalation.highFactorsToEscalateToCritical) {
    criticalReasons.push(`Multi-hazard convergence: ${highReasons.join(' + ')}`);
  }

  // Final classification
  if (criticalReasons.length > 0) {
    const combinedReasons = [...criticalReasons, ...highReasons];
    return {
      level: WEATHER_RISK_LEVELS.CRITICAL,
      reasons: combinedReasons,
      summary: `CRITICAL — ${criticalReasons.join(' + ')}`,
      severityNotice: `CRITICAL ALERT: ${criticalReasons[0]}`,
      isCritical: true,
      isHighRisk: true,
      factors: { temp, rain, wind, hum, vis },
    };
  }

  if (highReasons.length > 0) {
    return {
      level: WEATHER_RISK_LEVELS.HIGH_RISK,
      reasons: highReasons,
      summary: `HIGH RISK — ${highReasons.join(' + ')}`,
      severityNotice: `WARNING: ${highReasons[0]}`,
      isCritical: false,
      isHighRisk: true,
      factors: { temp, rain, wind, hum, vis },
    };
  }

  if (lowReasons.length > 0) {
    return {
      level: WEATHER_RISK_LEVELS.LOW_RISK,
      reasons: lowReasons,
      summary: `LOW RISK — ${lowReasons.join('; ')}`,
      severityNotice: `Advisory: ${lowReasons[0]}`,
      isCritical: false,
      isHighRisk: false,
      factors: { temp, rain, wind, hum, vis },
    };
  }

  return {
    level: WEATHER_RISK_LEVELS.NORMAL,
    reasons: ['All parameters within safe operating thresholds'],
    summary: 'NORMAL — Weather conditions are currently safe',
    severityNotice: 'Weather conditions are currently safe',
    isCritical: false,
    isHighRisk: false,
    factors: { temp, rain, wind, hum, vis },
  };
}
