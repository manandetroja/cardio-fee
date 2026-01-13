import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RefreshCw, FileText, CheckCircle, AlertTriangle, ArrowRight, Gauge } from "lucide-react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { PDFDownloadLink } from '@react-pdf/renderer';
import MedicalReportPDF from "../components/MedicalReportPDF";
import PageTransition from "../components/PageTransition";

export default function Result() {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [comparison, setComparison] = useState(null);

  // Time Machine State
  const [simAge, setSimAge] = useState(0);
  const [simSmoke, setSimSmoke] = useState(false);
  const [simActive, setSimActive] = useState(false);
  const [simRisk, setSimRisk] = useState(0);

  useEffect(() => {
    const stored = sessionStorage.getItem("predictionResult");
    if (stored) {
      const data = JSON.parse(stored);
      setResult(data);

      setSimAge(data.age);
      setSimSmoke(Boolean(data.smoke));
      setSimActive(Boolean(data.active));
      setSimRisk(data.risk_probability);

      const history = JSON.parse(localStorage.getItem('cardio_history') || '[]');
      const previous = history.find(h =>
        h.name.toLowerCase() === data.name.toLowerCase() &&
        h.timestamp !== data.timestamp
      );

      if (previous) {
        const riskDiff = (previous.risk_probability * 100) - (data.risk_probability * 100);
        setComparison({
          prevDate: previous.date,
          diff: riskDiff.toFixed(1),
          isImprovement: riskDiff > 0
        });
      }

      if (data.risk_category === "Low Risk") {
        confetti({
          particleCount: 150, spread: 70, origin: { y: 0.6 },
          colors: ['#4338ca', '#6366f1', '#ffffff']
        });
      }
    } else {
      // Redirect if no result
      navigate('/predict');
    }
  }, [navigate]);

  useEffect(() => {
    if (!result) return;
    let risk = result.risk_probability;
    const ageDiff = simAge - result.age;
    risk += (ageDiff * 0.008);
    if (result.smoke && !simSmoke) risk -= 0.15;
    if (!result.smoke && simSmoke) risk += 0.15;
    if (result.active && !simActive) risk += 0.10;
    if (!result.active && simActive) risk -= 0.10;
    risk = Math.max(0.01, Math.min(0.99, risk));
    setSimRisk(risk);
  }, [simAge, simSmoke, simActive, result]);

  if (!result) return null;

  const isHighRisk = result.risk_probability > 0.5;
  const riskPercent = (result.risk_probability * 100).toFixed(1);
  const colorClass = isHighRisk ? 'text-rose-500' : 'text-emerald-400';
  const bgClass = isHighRisk ? 'bg-rose-500/10 border-rose-500/20' : 'bg-emerald-500/10 border-emerald-500/20';
  const glowClass = isHighRisk ? 'shadow-[0_0_30px_rgba(244,63,94,0.4)]' : 'shadow-[0_0_30px_rgba(52,211,153,0.4)]';

  return (
    <PageTransition className="container max-w-5xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 pb-8 border-b border-white/5">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 font-['Outfit']">Analysis Report</h1>
          <p className="text-slate-400 font-medium">Prepared for <span className="text-white font-bold">{result.name}</span> on {result.date}</p>
        </div>
        <div className={`mt-4 md:mt-0 px-4 py-2 rounded-full font-bold border flex items-center gap-2 ${bgClass} ${colorClass}`}>
          <Gauge size={18} /> {result.risk_category} Status
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Main Result Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="lg:col-span-2 glass-panel p-8 md:p-10 relative overflow-hidden"
        >
          <div className={`absolute top-0 right-0 p-32 rounded-full filter blur-[100px] opacity-20 pointer-events-none ${isHighRisk ? 'bg-rose-600' : 'bg-emerald-600'}`}></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="relative w-56 h-56 flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="112" cy="112" r="100" stroke="#1e293b" strokeWidth="12" fill="transparent" />
                <circle cx="112" cy="112" r="100" stroke="currentColor" strokeWidth="12" fill="transparent"
                  className={`${colorClass} transition-all duration-1000 ease-out drop-shadow-xl`}
                  strokeDasharray={2 * Math.PI * 100}
                  strokeDashoffset={2 * Math.PI * 100 * (1 - result.risk_probability)}
                  strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-5xl font-extrabold ${colorClass} ${glowClass}`}>{riskPercent}%</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Probability</span>
              </div>
            </div>

            <div className="space-y-6 text-center md:text-left flex-1">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Clinical Assessment</h2>
                <p className="text-slate-300 leading-relaxed text-lg">{result.note}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Blood Pressure</div>
                  <div className="text-xl font-bold text-white">{result.ap_hi}/{result.ap_lo}</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">BMI Index</div>
                  <div className="text-xl font-bold text-white">{(result.weight / ((result.height / 100) ** 2)).toFixed(1)}</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recommendations */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="glass-panel p-6 h-full border border-white/10 bg-slate-900/40">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <FileText size={20} className="text-indigo-400" /> Action Plan
            </h3>
            <ul className="space-y-4">
              {(result.advice || []).map((tip, i) => (
                <li key={i} className="flex gap-3 text-sm font-medium text-slate-300 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  {isHighRisk ? <AlertTriangle className="text-rose-500 shrink-0" size={18} /> : <CheckCircle className="text-emerald-500 shrink-0" size={18} />}
                  {tip}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>

      {/* HEALTH TIME MACHINE */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        className="glass-panel border border-indigo-500/20 relative overflow-hidden mb-12"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-amber-500"></div>
        <div className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="flex-1 space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                  Health Time Machine <RefreshCw className="text-indigo-400 animate-spin-slow" />
                </h2>
                <p className="text-slate-400">Simulate how lifestyle adjustments could impact your heart health over time.</p>
              </div>

              <div className="space-y-6 max-w-md">
                <div className="space-y-2">
                  <div className="flex justify-between font-bold text-slate-300">
                    <span>Future Age</span>
                    <span className="text-indigo-400">+{simAge - result.age} Years</span>
                  </div>
                  <input type="range" min={result.age} max={result.age + 20} value={simAge} onChange={e => setSimAge(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setSimSmoke(!simSmoke)} className={`flex-1 p-3 rounded-xl font-bold border transition-all ${!simSmoke ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'}`}>
                    {simSmoke ? 'Smoking' : 'Smoke-Free'}
                  </button>
                  <button onClick={() => setSimActive(!simActive)} className={`flex-1 p-3 rounded-xl font-bold border transition-all ${simActive ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                    {simActive ? 'Active Lifestyle' : 'Sedentary'}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-950/50 rounded-2xl border border-white/5 text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Projected Risk Probability</span>
              <div className="text-5xl font-extrabold text-white mb-2">{(simRisk * 100).toFixed(1)}%</div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider 
                             ${simRisk < result.risk_probability ? 'bg-emerald-500/20 text-emerald-400' : simRisk > result.risk_probability ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-700 text-slate-400'}`}>
                {simRisk < result.risk_probability ? 'Improving Trend' : simRisk > result.risk_probability ? 'Worsening Trend' : 'No Change'}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex justify-center gap-4 py-8">
        <PDFDownloadLink document={<MedicalReportPDF data={result} />} fileName={`ALIVE_Report_${result.name}.pdf`} className="btn-secondary">
          {({ loading }) => loading ? 'Generating...' : <><FileText size={18} /> Download Full Report</>}
        </PDFDownloadLink>
        <button onClick={() => navigate('/predict')} className="btn-primary">
          Start New Assessment <ArrowRight size={18} />
        </button>
      </div>
    </PageTransition>
  );
}