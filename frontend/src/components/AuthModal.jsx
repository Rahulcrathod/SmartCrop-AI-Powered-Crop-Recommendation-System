import React, { useState, useEffect } from 'react';
import { 
  X, 
  Smartphone, 
  Mail, 
  ShieldCheck, 
  User, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  RefreshCw, 
  Sparkles,
  Lock,
  PhoneCall
} from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [authMode, setAuthMode] = useState('otp'); // 'otp' or 'guest'
  const [identifier, setIdentifier] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('Punjab');
  const [step, setStep] = useState('input'); // 'input' or 'verify'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [maskedIdentifier, setMaskedIdentifier] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isRegistered, setIsRegistered] = useState(true);
  const [isLiveGateway, setIsLiveGateway] = useState(false);
  const [devOtp, setDevOtp] = useState(null);
  const [gatewayInfo, setGatewayInfo] = useState('');

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  if (!isOpen) return null;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Please enter a phone number or email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to send OTP');

      setIsRegistered(data.is_registered);
      if (data.existing_user_name) {
        setName(data.existing_user_name);
      }
      setMaskedIdentifier(data.masked_identifier || identifier);
      setIsLiveGateway(Boolean(data.is_live_gateway));
      setDevOtp(data.dev_otp);
      setGatewayInfo(data.gateway || '');
      setResendCooldown(30);
      setStep('verify');
    } catch (err) {
      setError(err.message || 'Error sending OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpCode.trim()) {
      setError('Please enter the 6-digit OTP code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier,
          otp: otpCode,
          name: name.trim() || "Farmer",
          location: location.trim() || "Punjab"
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to verify OTP');

      onLoginSuccess(data.user);
      onClose();
    } catch (err) {
      setError(err.message || 'Invalid OTP code');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async (role = 'farmer') => {
    setLoading(true);
    try {
      if (role === 'admin') {
        const adminUser = {
          id: 2,
          name: "Dr. Anita Verma (Agronomist & Admin)",
          email: "admin@smartcrop.ai",
          role: "admin",
          location: "ICAR Agricultural Research Station"
        };
        onLoginSuccess(adminUser);
        onClose();
      } else {
        const res = await fetch('/api/auth/guest', { method: 'POST' });
        const data = await res.json();
        onLoginSuccess(data.user);
        onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-green-400 flex items-center justify-center text-slate-950 font-bold">
              🌱
            </div>
            <div>
              <h3 className="font-extrabold text-base">SmartCrop AI Access</h3>
              <p className="text-[11px] text-emerald-400">Farmer Sign In & Registration</p>
            </div>
          </div>

          <button 
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button
            type="button"
            onClick={() => { setAuthMode('otp'); setStep('input'); setError(''); }}
            className={`flex-1 py-3 text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              authMode === 'otp'
                ? 'bg-white text-emerald-700 border-b-2 border-emerald-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Smartphone className="w-4 h-4 text-emerald-600" />
            <span>Mobile / Email (OTP)</span>
          </button>

          <button
            type="button"
            onClick={() => { setAuthMode('guest'); setError(''); }}
            className={`flex-1 py-3 text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              authMode === 'guest'
                ? 'bg-white text-emerald-700 border-b-2 border-emerald-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Demo / Guest Mode</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-4">
          
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <span className="font-bold">Error:</span> {error}
            </div>
          )}

          {/* TAB 1: OTP AUTHENTICATION */}
          {authMode === 'otp' && (
            <div>
              {step === 'input' ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      Phone Number or Email ID
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        autoFocus
                        required
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="e.g. 9876543210 or farmer@example.com"
                        className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1.5">
                      We will send a 6-digit verification OTP code. No password required.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md shadow-emerald-900/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Sending Verification Code...</span>
                      </>
                    ) : (
                      <>
                        <span>Send 6-Digit OTP</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Step 2: VERIFY OTP */
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  
                  {/* SMS Gateway Status Banner */}
                  {isLiveGateway ? (
                    <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs space-y-1.5 shadow-sm">
                      <div className="flex items-center gap-2 font-bold text-emerald-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>OTP Dispatched via Cellular SMS</span>
                      </div>
                      <p className="text-[11px] text-slate-700 leading-relaxed">
                        A 6-digit verification code was transmitted to your phone: <strong className="font-mono text-slate-900 bg-white px-2 py-0.5 rounded border border-emerald-200">{maskedIdentifier}</strong>.
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Please check your SMS inbox on your mobile phone and type the 6 digits below.
                      </p>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs space-y-2 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-bold flex items-center gap-1.5 text-amber-900">
                          <Smartphone className="w-4 h-4 text-amber-700" />
                          {gatewayInfo || "Cellular SMS Gateway Setup"}
                        </span>
                        <span className="text-[9px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-bold uppercase">
                          Local Dev
                        </span>
                      </div>
                      <p className="text-[11px] text-amber-900 leading-relaxed">
                        To receive physical SMS directly on your phone handset, link a verified SMS API key (Fast2SMS / Twilio). For testing right now:
                      </p>
                      <div className="bg-white/95 p-2.5 rounded-xl border border-amber-200 flex items-center justify-between">
                        <span className="text-[11px] text-slate-600">
                          Your verification code for <strong>{maskedIdentifier}</strong>:
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-sm tracking-widest text-slate-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                            {devOtp}
                          </span>
                          <button
                            type="button"
                            onClick={() => setOtpCode(devOtp || '')}
                            className="text-[10px] bg-amber-200 hover:bg-amber-300 px-2 py-0.5 rounded font-bold transition text-amber-900 cursor-pointer"
                          >
                            Fill
                          </button>
                        </div>
                      </div>
                      <p className="text-[10px] text-amber-800">
                        Tip: Universal demo master code <code className="bg-amber-200/80 px-1.5 py-0.5 rounded font-bold text-slate-900">123456</code> is also accepted.
                      </p>
                    </div>
                  )}

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-slate-700 uppercase">
                        Enter 6-Digit Code
                      </label>
                      <button
                        type="button"
                        onClick={() => setStep('input')}
                        className="text-[11px] text-emerald-700 hover:underline"
                      >
                        Change ({identifier})
                      </button>
                    </div>

                    <input
                      type="text"
                      maxLength={6}
                      autoFocus
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="• • • • • •"
                      className="w-full text-center tracking-widest text-lg font-black rounded-xl border border-slate-300 bg-slate-50 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  {/* If new farmer, show profile registration fields */}
                  {!isRegistered && (
                    <div className="space-y-3 pt-2 border-t border-slate-100">
                      <p className="text-[11px] font-bold uppercase text-emerald-700">
                        ✨ Welcome New Farmer! Complete Profile:
                      </p>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Gurpreet Singh"
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Farm Location / District</label>
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="e.g. Amritsar, Punjab"
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50"
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || otpCode.length < 6}
                    className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Verify & Continue to Farm</span>
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      disabled={resendCooldown > 0 || loading}
                      onClick={handleSendOtp}
                      className="text-[11px] text-slate-500 hover:text-emerald-700 font-semibold disabled:opacity-50 transition cursor-pointer"
                    >
                      {resendCooldown > 0 
                        ? `Didn't receive SMS? Resend in ${resendCooldown}s` 
                        : "Didn't receive SMS? Resend OTP"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: GUEST / DEMO LOGIN */}
          {authMode === 'guest' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600 leading-relaxed">
                Test all capabilities instantly without entering phone or email credentials.
              </p>

              <div className="space-y-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => handleGuestLogin('farmer')}
                  disabled={loading}
                  className="w-full p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-left transition flex items-center justify-between group"
                >
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 group-hover:text-emerald-800">
                      👨‍🌾 Continue as Lead Farmer (Rahul Sharma)
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Pre-configured with Punjab 6.5-acre alluvial plot and prediction history.
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-emerald-600 shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() => handleGuestLogin('admin')}
                  disabled={loading}
                  className="w-full p-3.5 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-left transition flex items-center justify-between group"
                >
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 group-hover:text-amber-800">
                      🔬 Continue as Agri-Admin (Dr. Anita Verma)
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Access model performance metrics, dataset analytics, and audit logs.
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-amber-600 shrink-0" />
                </button>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500">
                🔒 Guest sessions allow running crop recommendations, calculating yield, inspecting soil health, and running plant disease diagnostics freely.
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
