import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useDisaster } from '@/services/DisasterContext';
import { 
  ShieldAlert, 
  Radio, 
  Map, 
  Navigation, 
  Bell, 
  PhoneCall, 
  Building2, 
  CloudRain, 
  Users, 
  LayoutDashboard, 
  User, 
  Menu, 
  X,
  Phone,
  LogIn,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const { sosActive, triggerSOS, alerts, currentUser, logoutUser } = useDisaster();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeAlertCount = alerts.filter(a => a.status === 'ACTIVE').length;

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Dashboard', path: '/#dashboard' },
    { label: 'SOS Alert', path: '/sos' },
    { label: 'Evacuation Routes', path: '/routes' },
    { label: 'Disaster Map', path: '/map' },
    { label: 'Live Alerts', path: '/alerts', badge: activeAlertCount },
    { label: 'Rescue Teams', path: '/rescue/command' },
    { label: 'Weather', path: '/weather' },
    { label: 'Contacts', path: '/contacts' },
  ];

  const handleNavClick = (path) => {
    setMobileMenuOpen(false);
    if (path.startsWith('/#')) {
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const el = document.getElementById(path.replace('/#', ''));
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        const el = document.getElementById(path.replace('/#', ''));
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(path);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-sky-600 text-white shadow-md">
      {/* Top Emergency Phone Bar */}
      <div className="bg-sky-700/90 border-b border-sky-500/40 text-xs py-1 px-4 text-sky-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
          <span className="font-semibold text-white">Emergency Response Mesh Active</span>
          <span className="hidden sm:inline text-sky-200">• Real-Time Citizen Protection Network</span>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold text-white">
          <span className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-sky-200" /> 24/7 Helpline: <strong>1070 / 911</strong>
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left Side: Logo & Subtitle */}
        <div 
          onClick={() => navigate('/')} 
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-white text-sky-600 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <ShieldAlert className="w-6 h-6 text-sky-600" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-extrabold text-xl tracking-tight text-white">RESQ</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-500/50 text-white font-bold border border-sky-400/40">AI</span>
            </div>
            <p className="text-[11px] text-sky-100 font-medium tracking-wide mt-0.5">AI Disaster Response</p>
          </div>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = link.path.startsWith('/#') 
              ? location.hash === link.path.replace('/', '') 
              : location.pathname === link.path;

            return (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.path)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all relative flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-sky-700 text-white shadow-xs'
                    : 'text-sky-100 hover:text-white hover:bg-sky-500/50'
                }`}
              >
                <span>{link.label}</span>
                {link.badge > 0 && (
                  <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-red-500 text-white">
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Side: Logins, Profile & Emergency SOS button */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Rescue Team Commander Badge if logged in as rescue */}
          {currentUser?.role === 'RESCUE_TEAM' && (
            <button
              onClick={() => navigate('/rescue/command')}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-700/80 hover:bg-red-800 text-white text-xs font-bold border border-red-400/40 transition-colors shadow-xs"
              title="Rescue Command Operations"
            >
              <Radio className="w-3.5 h-3.5 text-red-200 animate-pulse" />
              <span>{currentUser.name || 'Rescue Squad'}</span>
            </button>
          )}

          {/* User Profile Button */}
          {currentUser?.role !== 'RESCUE_TEAM' && (
            <button
              onClick={() => navigate('/profile')}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-xs font-semibold border border-sky-500/40 transition-colors shadow-xs"
              title="User Profile & Safety Data"
            >
              <User className="w-4 h-4 text-sky-200" />
              <span className="hidden md:inline">{currentUser?.name?.split(' ')[0] || 'Profile'}</span>
            </button>
          )}

          {/* Dedicated Sign In Dropdown (Citizen vs Rescue Team) */}
          <div className="relative group">
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all shadow-xs"
              title="Sign In Portal"
            >
              <LogIn className="w-3.5 h-3.5 text-sky-200" />
              <span className="hidden sm:inline">Sign In</span>
            </button>

            {/* Hover Dropdown */}
            <div className="absolute right-0 top-full mt-1.5 w-52 bg-white text-slate-900 rounded-2xl shadow-xl border border-slate-200 py-2 hidden group-hover:block transition-all z-50 animate-fadeIn">
              <div className="px-3.5 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Select Portal
              </div>
              <button
                onClick={() => navigate('/login?type=user')}
                className="w-full text-left px-3.5 py-2 text-xs font-semibold hover:bg-sky-50 text-slate-800 flex items-center gap-2.5 transition-colors"
              >
                <div className="w-6 h-6 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                  <User className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Citizen User Login</div>
                  <div className="text-[10px] text-slate-500 font-normal">Personal safety & SOS</div>
                </div>
              </button>

              <button
                onClick={() => navigate('/login?type=rescue')}
                className="w-full text-left px-3.5 py-2 text-xs font-semibold hover:bg-red-50 text-slate-800 flex items-center gap-2.5 transition-colors border-t border-slate-100"
              >
                <div className="w-6 h-6 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                  <Radio className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Rescue Team Login</div>
                  <div className="text-[10px] text-slate-500 font-normal">SAR Command & Radar</div>
                </div>
              </button>

              {currentUser && (
                <button
                  onClick={logoutUser}
                  className="w-full text-left px-3.5 py-2 text-xs font-semibold hover:bg-slate-100 text-slate-600 flex items-center gap-2.5 transition-colors border-t border-slate-100"
                >
                  <LogOut className="w-3.5 h-3.5 text-slate-400" />
                  <span>Sign Out ({currentUser.name})</span>
                </button>
              )}
            </div>
          </div>

          {sosActive ? (
            <button
              onClick={() => navigate('/sos')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md animate-pulse"
            >
              <Radio className="w-4 h-4 animate-spin" />
              <span>SOS ACTIVE</span>
            </button>
          ) : (
            <button
              onClick={() => {
                triggerSOS('NAVBAR_TRIGGER', 'Instant Emergency Signal');
                navigate('/sos');
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 active:bg-red-700 text-white text-xs font-extrabold shadow-md transition-all hover:scale-[1.02]"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>TRIGGER SOS</span>
            </button>
          )}

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl bg-sky-700 hover:bg-sky-800 text-white focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Collapsible Navigation Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-sky-700 border-t border-sky-500/50 px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.path)}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-sky-100 hover:text-white hover:bg-sky-600 transition-colors flex items-center justify-between"
            >
              <span>{link.label}</span>
              {link.badge > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-red-500 text-white">
                  {link.badge}
                </span>
              )}
            </button>
          ))}

          <div className="pt-2 border-t border-sky-600 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/login?type=user');
                }}
                className="w-full py-2 px-3 rounded-lg bg-sky-800 hover:bg-sky-900 text-xs font-semibold text-center text-white flex items-center justify-center gap-1.5"
              >
                <User className="w-3.5 h-3.5" />
                Citizen Login
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/login?type=rescue');
                }}
                className="w-full py-2 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-xs font-semibold text-center text-white flex items-center justify-center gap-1.5"
              >
                <Radio className="w-3.5 h-3.5" />
                Rescue Team
              </button>
            </div>
            {currentUser && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logoutUser();
                }}
                className="w-full py-1.5 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-center text-sky-100 flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out ({currentUser.name})
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
