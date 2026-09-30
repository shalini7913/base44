import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import UserDashboard from '@/pages/app/UserDashboard';
import SOSPage from '@/pages/app/sospage';
import SafeRoutes from '@/pages/app/safeRoutes';
import Alerts from '@/pages/app/Alerts';
import EmergencyContact from '@/pages/app/Emergencycontact';
import Hospitals from '@/pages/app/Hospitals';
import Resources from '@/pages/app/Resources';
import Risk from '@/pages/app/Risk';
import Agents from '@/pages/app/Agents';
import Profile from '@/pages/app/profile';
import WeatherPage from '@/pages/app/Weather';
import ResetPassword from '@/api/components/Resetpassword';
import Rcommand from '@/pages/rescue/Rcommand';
import RMap from '@/pages/rescue/RMap';
import Rdevices from '@/pages/rescue/Rdevices';
import RRegions from '@/pages/rescue/RRegions';
import RResources from '@/pages/rescue/RResources';
import LoginPage from '@/pages/auth/LoginPage';
import AuthLayout from '@/components/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShieldAlert, KeyRound, Phone, MapPin, Mail, Radio, ArrowRight } from 'lucide-react';

function ForgotPasswordPage() {
  const [sent, setSent] = React.useState(false);
  return (
    <AuthLayout icon={KeyRound} title="Request Password Reset" subtitle="Enter your email to receive a password reset link">
      {sent ? (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium text-center">
          Reset email sent! <Link to="/reset-password?token=demo-token" className="underline font-bold text-emerald-950">Click here to test Reset Password page</Link>
        </div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Email Address</label>
            <Input type="email" placeholder="alex.mercer@resq.org" required />
          </div>
          <Button type="submit" className="w-full text-xs h-11 font-bold bg-sky-600 text-white hover:bg-sky-700">
            Send Reset Link
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 selection:bg-sky-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 pb-16">
        <Routes>
          {/* App User Routes */}
          <Route path="/" element={<UserDashboard />} />
          <Route path="/sos" element={<SOSPage />} />
          <Route path="/routes" element={<SafeRoutes />} />
          <Route path="/map" element={<RMap />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/contacts" element={<EmergencyContact />} />
          <Route path="/hospitals" element={<Hospitals />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/risk" element={<Risk />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/weather" element={<WeatherPage />} />
          <Route path="/profile" element={<Profile />} />

          {/* Rescue Ops Command Routes */}
          <Route path="/rescue/command" element={<Rcommand />} />
          <Route path="/rescue/map" element={<RMap />} />
          <Route path="/rescue/devices" element={<Rdevices />} />
          <Route path="/rescue/regions" element={<RRegions />} />
          <Route path="/rescue/resources" element={<RResources />} />

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Fallback Catch-all */}
          <Route path="*" element={<UserDashboard />} />
        </Routes>
      </main>

      {/* FOOTER - Clean Blue Footer as specified */}
      <footer className="bg-sky-900 text-sky-100 mt-auto border-t border-sky-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Column 1: Brand & Description (2 cols on lg) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white text-sky-800 flex items-center justify-center shadow-sm">
                  <ShieldAlert className="w-6 h-6 text-sky-700" />
                </div>
                <div>
                  <span className="font-extrabold text-2xl text-white tracking-tight">RESQ</span>
                  <span className="text-xs font-mono px-2 py-0.5 ml-2 rounded-full bg-sky-800 text-sky-200 border border-sky-700 font-semibold">AI NETWORK</span>
                </div>
              </div>

              <p className="text-sm text-sky-200 leading-relaxed max-w-sm">
                Real-time AI-assisted disaster response, satellite emergency SOS broadcasting, safe evacuation corridors, and rapid rescue team coordination.
              </p>

              <div className="pt-2 text-xs text-sky-300 space-y-1">
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-sky-400" /> Central Emergency Command, Metro District
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-sky-400" /> Direct Support: 1070 / 911 (Toll-Free 24/7)
                </p>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-2 text-xs font-medium text-sky-200">
                <li><Link to="/" className="hover:text-white transition-colors">Home Portal</Link></li>
                <li><Link to="/sos" className="hover:text-red-400 transition-colors font-bold">Emergency SOS</Link></li>
                <li><Link to="/routes" className="hover:text-white transition-colors">Evacuation Routes</Link></li>
                <li><Link to="/map" className="hover:text-white transition-colors">Disaster Map</Link></li>
                <li><Link to="/weather" className="hover:text-white transition-colors">Weather Radar</Link></li>
                <li><Link to="/alerts" className="hover:text-white transition-colors">Live Warnings</Link></li>
              </ul>
            </div>

            {/* Column 3: Emergency Services */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Services</h4>
              <ul className="space-y-2 text-xs font-medium text-sky-200">
                <li><Link to="/rescue/command" className="hover:text-white transition-colors">Rescue Squads</Link></li>
                <li><Link to="/hospitals" className="hover:text-white transition-colors">Trauma Hospitals</Link></li>
                <li><Link to="/resources" className="hover:text-white transition-colors">Relief Logistics</Link></li>
                <li><Link to="/risk" className="hover:text-white transition-colors">Vulnerability Meter</Link></li>
                <li><Link to="/agents" className="hover:text-white transition-colors">AI Dispatch Agents</Link></li>
                <li><Link to="/profile" className="hover:text-white transition-colors">Safety Profile</Link></li>
              </ul>
            </div>

            {/* Column 4: Contact & Hotlines */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Contact & Legal</h4>
              <ul className="space-y-2 text-xs font-medium text-sky-200">
                <li><Link to="/contacts" className="hover:text-white transition-colors font-bold">Official Hotlines</Link></li>
                <li><a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#terms" className="hover:text-white transition-colors">Terms of Public Service</a></li>
                <li><a href="#disclaimer" className="hover:text-white transition-colors">Disaster Disclaimer</a></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Responder Portal</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright Strip */}
          <div className="border-t border-sky-800/80 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-sky-300">
            <p>© 2026 Base44 RESQ AI Disaster Response. All emergency services operational.</p>
            <div className="flex items-center gap-6">
              <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Grid Online
              </span>
              <a href="#terms" className="hover:text-white">Terms</a>
              <a href="#privacy" className="hover:text-white">Privacy</a>
              <a href="tel:911" className="hover:text-white font-bold text-white">Emergency Call: 911</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
