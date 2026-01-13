import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { User, Ruler, Weight, Activity, Cigarette, Wine, MoveRight, ChevronLeft, Check, Loader2, HeartPulse, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageTransition from "../components/PageTransition";

export default function Predict() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", age: 45, height: 170, weight: 75, ap_hi: 120, ap_lo: 80,
    cholesterol: 1, gluc: 1, smoke: 0, alco: 0, active: 1
  });

  const updateForm = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 3));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  useEffect(() => {
    axios.get("https://alive-production-5dc1.up.railway.app/").catch(() => { });
  }, []);

  const submitPrediction = async () => {
    setLoading(true);
    try {
      const payload = { ...form };
      delete payload.name;
      // Artificial delay for UX
      await new Promise(r => setTimeout(r, 2000));

      const res = await axios.post("https://alive-production-5dc1.up.railway.app/predict", payload);

      const resultData = {
        ...res.data,
        ...form,
        name: form.name || 'Guest',
        date: new Date().toISOString().split('T')[0],
        timestamp: Date.now()
      };

      sessionStorage.setItem('predictionResult', JSON.stringify(resultData));
      const history = JSON.parse(localStorage.getItem('cardio_history') || '[]');
      history.unshift({ date: resultData.date, risk: resultData.risk_probability, risk_category: resultData.risk_category, ...resultData });
      localStorage.setItem('cardio_history', JSON.stringify(history));

      navigate('/result');
    } catch (e) {
      console.error(e);
      // Demo Fallback
      const demoData = {
        ...form, name: form.name || "Guest User", risk_probability: 0.12, risk_category: "Low Risk",
        note: "Demo prediction due to API error.", advice: ["Exercise more", "Eat healthy"], timestamp: Date.now(), date: new Date().toISOString().split('T')[0]
      };
      sessionStorage.setItem('predictionResult', JSON.stringify(demoData));
      const history = JSON.parse(localStorage.getItem('cardio_history') || '[]');
      history.unshift(demoData);
      localStorage.setItem('cardio_history', JSON.stringify(history));
      navigate('/result');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition className="container max-w-4xl mx-auto px-4 py-8 min-h-screen flex flex-col justify-center">

      {/* Progress Header */}
      <div className="mb-12">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Health Assessment</h1>
            <p className="text-slate-400">Step {step} of 3</p>
          </div>
          <div className="hidden sm:flex gap-1">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-1.5 w-12 rounded-full transition-all duration-500 ${step >= i ? 'bg-indigo-500 shadow-[0_0_10px_#6366f1]' : 'bg-slate-800'}`}></div>
            ))}
          </div>
        </div>
        <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden relative">
          <motion.div
            className="absolute top-0 left-0 h-full bg-indigo-500 shadow-[0_0_15px_#6366f1]"
            initial={{ width: 0 }}
            animate={{ width: `${(step / 3) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </div>

      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="glass-panel p-8 md:p-12 relative overflow-hidden"
      >
        {/* Background glow for the card */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <h2 className="text-2xl font-bold text-white mb-8 border-b border-white/5 pb-4 flex items-center gap-3">
          {step === 1 && <User className="text-indigo-400" />}
          {step === 2 && <Activity className="text-indigo-400" />}
          {step === 3 && <HeartPulse className="text-indigo-400" />}
          {step === 1 && "Personal Information"}
          {step === 2 && "Vitals & Measurements"}
          {step === 3 && "Lifestyle & Habits"}
        </h2>

        {step === 1 && (
          <div className="space-y-8">
            <div className="space-y-4">
              <label className="label-modern">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                <input
                  className="input-modern !pl-12"
                  placeholder="Ex. John Doe"
                  value={form.name}
                  onChange={e => updateForm("name", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <label className="label-modern">Age</label>
                <div className="text-2xl font-bold text-indigo-400 bg-indigo-500/10 px-4 py-1 rounded-lg border border-indigo-500/20">
                  {form.age} <span className="text-sm text-slate-400 font-normal">Years</span>
                </div>
              </div>
              <AdvancedSlider min={18} max={100} value={form.age} onChange={v => updateForm("age", v)} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <div className="flex justify-between items-center"><label className="label-modern">Height</label><span className="text-lg font-bold text-indigo-400">{form.height} cm</span></div>
                <AdvancedSlider min={140} max={210} value={form.height} onChange={v => updateForm("height", v)} />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center"><label className="label-modern">Weight</label><span className="text-lg font-bold text-indigo-400">{form.weight} kg</span></div>
                <AdvancedSlider min={40} max={150} value={form.weight} onChange={v => updateForm("weight", v)} />
              </div>
            </div>

            <div className="bg-slate-950/30 p-8 rounded-3xl border border-white/5 relative overflow-hidden">
              <div className="absolute inset-0 bg-rose-500/5 blur-2xl"></div>
              <h3 className="font-bold text-slate-200 mb-8 flex items-center gap-2 relative z-10">
                <Activity className="text-rose-500" size={20} /> Blood Pressure
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                <div className="space-y-4">
                  <div className="flex justify-between items-center"><label className="text-sm font-medium text-slate-400 uppercase tracking-wide">Systolic</label><span className="text-lg font-bold text-rose-500">{form.ap_hi}</span></div>
                  <AdvancedSlider min={90} max={200} value={form.ap_hi} onChange={v => updateForm("ap_hi", v)} color="rose" />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center"><label className="text-sm font-medium text-slate-400 uppercase tracking-wide">Diastolic</label><span className="text-lg font-bold text-rose-500">{form.ap_lo}</span></div>
                  <AdvancedSlider min={50} max={130} value={form.ap_lo} onChange={v => updateForm("ap_lo", v)} color="rose" />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <ToggleCard active={form.smoke === 1} onClick={() => updateForm("smoke", form.smoke ? 0 : 1)} icon={<Cigarette />} label="Smoker" />
              <ToggleCard active={form.alco === 1} onClick={() => updateForm("alco", form.alco ? 0 : 1)} icon={<Wine />} label="Alcohol" />
              <ToggleCard active={form.active === 1} onClick={() => updateForm("active", form.active ? 0 : 1)} icon={<Activity />} label="Active" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="label-modern">Cholesterol Level</label>
                <LevelSelector value={form.cholesterol} onChange={v => updateForm("cholesterol", v)} />
              </div>
              <div className="space-y-3">
                <label className="label-modern">Glucose Level</label>
                <LevelSelector value={form.gluc} onChange={v => updateForm("gluc", v)} />
              </div>
            </div>
          </div>
        )}
      </motion.div>

      <div className="flex justify-between items-center mt-10 px-2">
        <button
          onClick={prevStep}
          disabled={step === 1}
          className={`flex items-center gap-2 font-semibold text-slate-500 hover:text-white transition-colors ${step === 1 ? 'opacity-0 pointer-events-none' : ''}`}
        >
          <ChevronLeft size={18} /> Back
        </button>

        {step < 3 ? (
          <button onClick={nextStep} className="btn-primary">Continue <MoveRight size={18} /></button>
        ) : (
          <button onClick={submitPrediction} disabled={loading} className="btn-primary !bg-gradient-to-r !from-emerald-500 !to-teal-500 !shadow-[0_0_20px_#10b981] !border-emerald-500/30">
            {loading ? <Loader2 className="animate-spin" /> : <>Analyze Health <Zap size={18} className="fill-current" /></>}
          </button>
        )}
      </div>
    </PageTransition>
  );
}

function AdvancedSlider({ value, min, max, onChange, color = "indigo" }) {
  const percentage = ((value - min) / (max - min)) * 100;
  const activeColor = color === 'rose' ? 'bg-rose-500' : 'bg-indigo-500';
  const shadowColor = color === 'rose' ? 'shadow-[0_0_15px_#f43f5e]' : 'shadow-[0_0_15px_#6366f1]';

  return (
    <div className="relative w-full h-8 flex items-center group cursor-pointer group">
      <div className="absolute w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full ${activeColor} ${shadowColor} transition-all duration-150 ease-out`} style={{ width: `${percentage}%` }}></div>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={e => onChange(Number(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
      <div
        className={`absolute h-6 w-6 bg-slate-900 rounded-full shadow-lg border-2 ${color === 'rose' ? 'border-rose-500' : 'border-indigo-500'} transform -translate-x-1/2 pointer-events-none transition-all duration-150 ease-out z-10 group-hover:scale-110`}
        style={{ left: `${percentage}%` }}
      >
        <div className={`w-2 h-2 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${activeColor}`}></div>
      </div>
    </div>
  )
}

function ToggleCard({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center justify-center p-6 rounded-2xl border transition-all duration-300 gap-4 w-full group relative overflow-hidden ${active ? "border-indigo-500 bg-indigo-500/20 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]" : "border-white/5 bg-white/5 text-slate-500 hover:border-white/10 hover:bg-white/10 hover:text-slate-300"}`}>
      {active && <div className="absolute inset-0 bg-indigo-500/10 blur-xl"></div>}
      <div className={`relative z-10 p-3 rounded-xl transition-all ${active ? "bg-indigo-500 text-white" : "bg-slate-800 text-slate-500 group-hover:bg-slate-700 group-hover:text-slate-300"}`}>
        {icon}
      </div>
      <span className="text-sm font-bold relative z-10 tracking-wide uppercase">{label}</span>
    </button>
  )
}

function LevelSelector({ value, onChange }) {
  const levels = [{ val: 1, label: "Normal", color: "text-emerald-400 bg-emerald-500/20 border-emerald-500/50" }, { val: 2, label: "Elevated", color: "text-amber-400 bg-amber-500/20 border-amber-500/50" }, { val: 3, label: "High", color: "text-rose-400 bg-rose-500/20 border-rose-500/50" }];
  return (
    <div className="flex p-1.5 bg-slate-950/50 rounded-xl border border-white/5 relative">
      {levels.map((l) => (
        <button key={l.val} onClick={() => onChange(l.val)} className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all relative z-10 ${value === l.val ? `${l.color} shadow-lg border` : "text-slate-500 hover:text-slate-300"}`}>
          {l.label}
        </button>
      ))}
    </div>
  )
}