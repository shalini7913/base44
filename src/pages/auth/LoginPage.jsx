import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useDisaster } from '@/services/DisasterContext';
import { loginApi } from '@/services/api';
import { 
  User, 
  ShieldAlert, 
  Radio, 
  KeyRound, 
  Lock, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Cpu,
  BadgeCheck,
  Compass
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginUser, currentUser } = useDisaster();

  // Tab state: 'user' (Citizen) or 'rescue' (Rescue Team)
  const initialTab = searchParams.get('type') === 'rescue' ? 'rescue' : 'user';
  const [activeTab, setActiveTab] = useState(initialTab);

  // Citizen Form State
  const [userEmail, setUserEmail] = useState('alex.mercer@resq.org');
  const [userPassword, setUserPassword] = useState('password123');

  // Rescue Team Form State
  const [badgeId, setBadgeId] = useState('SAR-ALPHA-01');
  const [unitName, setUnitName] = useState('Alpha Search & Rescue Squad');
  const [sector, setSector] = useState('Sector 4 - Lowland Riverbank');
  const [rescuePasscode, setRescuePasscode] = useState('clearance-9942');

  // Loading & Feedback
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleCitizenSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await loginApi({
        email: userEmail,
        password: userPassword,
        role: 'CITIZEN',
      });

      if (res?.user) {
        loginUser(res.user);
        setSuccessMsg(`Welcome back, ${res.user.name}! Redirecting to Safety Portal...`);
        setTimeout(() => navigate('/'), 800);
      } else {
        setErrorMsg('Invalid login credentials. Please check and try again.');
      }
    } catch (err) {
      setErrorMsg('Login failed. Please verify your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleRescueSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await loginApi({
        badgeId,
        unit: unitName,
        sector,
        password: rescuePasscode,
        role: 'RESCUE_TEAM',
      });

      if (res?.user) {
        loginUser(res.user);
        setSuccessMsg(`Operational clearance granted for ${res.user.name}. Opening Tactical Command...`);
        setTimeout(() => navigate('/rescue/command'), 800);
      } else {
        setErrorMsg('Authentication error. Invalid badge ID or clearance code.');
      }
    } catch (err) {
      setErrorMsg('Rescue authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCitizen = () => {
    setUserEmail('alex.mercer@resq.org');
    setUserPassword('citizen2026');
  };

  const fillDemoRescue = () => {
    setBadgeId('SAR-ALPHA-01');
    setUnitName('Alpha Search & Rescue Squad');
    setSector('Sector 4 - Lowland Riverbank');
    setRescuePasscode('delta-responder-77');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-xl space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-600 text-white shadow-lg shadow-sky-500/20 mb-2">
            <ShieldAlert className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            ResQ Access Portal
          </h1>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Choose your login type to enter either the Citizen Safety Portal or First Responder Tactical Operations.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => { setActiveTab('user'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'user'
                ? 'bg-white text-sky-700 shadow-sm border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4 text-sky-600" />
            <span>Citizen User Login</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('rescue'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'rescue'
                ? 'bg-white text-red-700 shadow-sm border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Radio className="w-4 h-4 text-red-600" />
            <span>Rescue Team Login</span>
          </button>
        </div>

        {/* Feedback alerts */}
        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white p-7 sm:p-9 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/40 relative overflow-hidden">
          {activeTab === 'user' ? (
            /* ============================================================ */
            /* 1. CITIZEN USER LOGIN FORM */
            /* ============================================================ */
            <form onSubmit={handleCitizenSubmit} className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <User className="w-4 h-4 text-sky-600" /> Citizen Portal Sign In
                  </h3>
                  <p className="text-xs text-slate-500">Access personal emergency alerts, SOS dispatch & safe routes</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                  Citizen
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                  <span>Email or Registered Mobile</span>
                  <button 
                    type="button" 
                    onClick={fillDemoCitizen} 
                    className="text-[11px] text-sky-600 hover:text-sky-800 font-normal underline"
                  >
                    Load Demo Data
                  </button>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    type="text"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="alex.mercer@resq.org"
                    className="pl-9 h-11 text-xs rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">Account Password</label>
                  <Link to="/forgot-password" className="text-[11px] text-slate-500 hover:text-slate-800 underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    type="password"
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-9 h-11 text-xs rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {loading ? 'Authenticating...' : (
                    <>
                      <span>Sign In as Citizen User</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>

              <div className="pt-2 text-center text-xs text-slate-500">
                <span>Looking for field responder console? </span>
                <button
                  type="button"
                  onClick={() => setActiveTab('rescue')}
                  className="text-red-600 hover:text-red-700 font-bold underline"
                >
                  Switch to Rescue Team
                </button>
              </div>
            </form>
          ) : (
            /* ============================================================ */
            /* 2. RESCUE TEAM LOGIN FORM */
            /* ============================================================ */
            <form onSubmit={handleRescueSubmit} className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Radio className="w-4 h-4 text-red-600" /> First Responder Squad Login
                  </h3>
                  <p className="text-xs text-slate-500">Authorized command grid, live unit dispatch & radar maps</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                  Rescue Squad
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Responder Badge / ID</label>
                  <div className="relative">
                    <BadgeCheck className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input
                      type="text"
                      value={badgeId}
                      onChange={(e) => setBadgeId(e.target.value)}
                      placeholder="SAR-ALPHA-01"
                      className="pl-9 h-11 text-xs rounded-xl font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Tactical Squad / Unit</label>
                  <div className="relative">
                    <Cpu className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input
                      type="text"
                      value={unitName}
                      onChange={(e) => setUnitName(e.target.value)}
                      placeholder="Alpha Search & Rescue Squad"
                      className="pl-9 h-11 text-xs rounded-xl"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Assigned Operational Sector</label>
                <div className="relative">
                  <Compass className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    type="text"
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    placeholder="Sector 4 - Lowland Riverbank"
                    className="pl-9 h-11 text-xs rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">Clearance Passcode / Security Key</label>
                  <button 
                    type="button" 
                    onClick={fillDemoRescue} 
                    className="text-[11px] text-red-600 hover:text-red-800 font-normal underline"
                  >
                    Load Demo Credentials
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    type="password"
                    value={rescuePasscode}
                    onChange={(e) => setRescuePasscode(e.target.value)}
                    placeholder="••••••••"
                    className="pl-9 h-11 text-xs rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {loading ? 'Validating Clearance...' : (
                    <>
                      <span>Enter Rescue Command Operations</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>

              <div className="pt-2 text-center text-xs text-slate-500">
                <span>Not a first responder? </span>
                <button
                  type="button"
                  onClick={() => setActiveTab('user')}
                  className="text-sky-600 hover:text-sky-700 font-bold underline"
                >
                  Switch to Citizen User
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Security / System Footer */}
        <div className="text-center text-[11px] text-slate-400 space-y-1">
          <p>National Emergency Broadcast & Rescue Network • Encrypted 256-bit SSL Session</p>
          <p>
            <Link to="/" className="text-slate-500 hover:text-slate-700 underline">
              Return to Front Page
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
