const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function fetchAlerts() {
  try {
    const res = await fetch(`${API_BASE}/alerts`);
    if (!res.ok) throw new Error('Failed to fetch alerts');
    return await res.json();
  } catch (err) {
    console.warn('API offline, using fallback state:', err);
    return null;
  }
}

export async function createAlert(alertData) {
  try {
    const res = await fetch(`${API_BASE}/alerts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(alertData),
    });
    return await res.json();
  } catch (err) {
    console.error('Failed to post alert:', err);
  }
}

export async function fetchDevices() {
  try {
    const res = await fetch(`${API_BASE}/devices`);
    if (!res.ok) throw new Error('Failed to fetch devices');
    return await res.json();
  } catch (err) {
    console.warn('API offline, using fallback state:', err);
    return null;
  }
}

export async function updateDevice(id, data) {
  try {
    const res = await fetch(`${API_BASE}/devices/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    console.error('Failed to update device:', err);
  }
}

export async function fetchHospitals() {
  try {
    const res = await fetch(`${API_BASE}/hospitals`);
    if (!res.ok) throw new Error('Failed to fetch hospitals');
    return await res.json();
  } catch (err) {
    console.warn('API offline, using fallback state:', err);
    return null;
  }
}

export async function fetchResources() {
  try {
    const res = await fetch(`${API_BASE}/resources`);
    if (!res.ok) throw new Error('Failed to fetch resources');
    return await res.json();
  } catch (err) {
    console.warn('API offline, using fallback state:', err);
    return null;
  }
}

export async function requestResource(data) {
  try {
    const res = await fetch(`${API_BASE}/resources/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    console.error('Failed to request resource:', err);
  }
}

export async function triggerSOSApi(sosData) {
  try {
    const res = await fetch(`${API_BASE}/sos/trigger`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sosData),
    });
    return await res.json();
  } catch (err) {
    console.error('Failed to trigger SOS via API:', err);
  }
}

export async function cancelSOSApi(id) {
  try {
    const res = await fetch(`${API_BASE}/sos/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    return await res.json();
  } catch (err) {
    console.error('Failed to cancel SOS via API:', err);
  }
}

export async function loginApi(credentials) {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('API login request error, using client fallback:', err);
  }

  // Resilient fallback for local testing
  const isRescue = credentials.role === 'RESCUE_TEAM' || Boolean(credentials.badgeId);
  return {
    success: true,
    user: isRescue
      ? {
          id: credentials.badgeId || 'SAR-ALPHA-01',
          name: credentials.unit || 'Alpha Search & Rescue Squad',
          role: 'RESCUE_TEAM',
          email: credentials.email || 'alpha.commander@rescue.resq.org',
          sector: credentials.sector || 'Sector 4 - Lowland Basin',
          badgeId: credentials.badgeId || 'SAR-ALPHA-01',
          title: 'Tactical Squad Commander',
        }
      : {
          id: 'u-123',
          name: credentials.email ? credentials.email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Alex Mercer',
          role: 'CITIZEN',
          email: credentials.email || 'alex.mercer@resq.org',
          phone: '+1 (555) 019-2834',
          bloodType: 'O Positive',
          status: 'SAFE',
        },
    token: `mock-token-${Date.now()}`,
    redirectUrl: isRescue ? '/rescue/command' : '/',
  };
}

