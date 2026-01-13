import { useNavigate } from "react-router-dom";
import { ArrowRight, Activity, ShieldCheck, Zap, Heart, Brain, Lock, Stethoscope, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import PageTransition from "../components/PageTransition";

export default function Home() {
  const navigate = useNavigate();

  return (
    <PageTransition className="min-h-screen">

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden min-h-[90vh] flex items-center">
        {/* Background Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-sm text-indigo-300 text-sm font-semibold shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
                </span>
                Next-Gen AI Diagnostics
              </div>

              <h1 className="text-5xl md:text-7xl font-bold font-['Outfit'] text-white tracking-tight leading-[1.1]">
                Redefining <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400 animate-pulse-glow">
                  Cardiac Health
                </span>
              </h1>

              <p className="text-lg md:text-xl text-slate-400 max-w-lg leading-relaxed font-medium">
                Experience the future of healthcare with our advanced neural network. Instant, accurate cardiovascular risk analysis powered by artificial intelligence.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={() => navigate("/predict")}
                  className="btn-primary text-lg px-8 py-4 shadow-indigo-500/30 border-t border-white/20"
                >
                  Start Analysis
                  <Zap size={20} className="ml-1 fill-current" />
                </button>
                <button
                  onClick={() => navigate("/about")}
                  className="btn-glass text-lg px-8 py-4"
                >
                  Learn Technology
                </button>
              </div>

              <div className="pt-8 flex items-center gap-8 text-sm font-semibold text-slate-500">
                <div className="flex items-center gap-2 text-emerald-400">
                  <ShieldCheck size={20} /> <span className="text-slate-400">99.8% Accuracy</span>
                </div>
                <div className="flex items-center gap-2 text-indigo-400">
                  <Lock size={20} /> <span className="text-slate-400">Secure & Private</span>
                </div>
              </div>
            </motion.div>

            {/* Visual / Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateY: 30 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative perspective-1000"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-sky-500/20 rounded-full blur-[100px] animate-pulse-glow"></div>

              {/* Glass Card UI */}
              <div className="glass-card p-8 relative z-10 transform transition-transform hover:scale-[1.02] duration-500 border border-white/10 bg-slate-900/60 ">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.3)] border border-indigo-500/30">
                      <Heart size={28} fill="currentColor" strokeWidth={0} className="animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Live Monitoring</h3>
                      <p className="text-slate-400 text-sm">System Operational</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 uppercase tracking-wide">
                    Active
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-4 rounded-xl bg-slate-950/50 border border-white/5">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-slate-400">Prediction Confidence</span>
                      <span className="text-sm font-bold text-indigo-400">98.4%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full w-[98.4%] shadow-[0_0_15px_#6366f1]"></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <StatCard icon={<Activity />} label="Processing" value="< 0.5s" />
                    <StatCard icon={<Brain />} label="Model Nodes" value="2.5M+" />
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-sky-500/20 rounded-full blur-2xl animate-float"></div>
              <div className="absolute -bottom-8 -left-12 w-40 h-40 bg-fuchsia-500/20 rounded-full blur-2xl animate-float" style={{ animationDelay: "2s" }}></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold font-['Outfit'] text-white">
              Why Choose <span className="text-indigo-400">Cardio AI?</span>
            </h2>
            <p className="text-slate-400 text-lg">
              Merging elite medical research with state-of-the-art deep learning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Brain className="text-indigo-400" size={32} />}
              title="Neural Network"
              desc="Trained on massive datasets to identify even the most subtle patterns in cardiovascular data that humans might miss."
            />
            <FeatureCard
              icon={<Zap className="text-amber-400" size={32} />}
              title="Instant Verdict"
              desc="Receive a comprehensive, medically-relevant risk profile in milliseconds. No waiting rooms, just answers."
            />
            <FeatureCard
              icon={<ShieldCheck className="text-emerald-400" size={32} />}
              title="Encrypted & Safe"
              desc="Your biometric data is processed with military-grade encryption. We prioritize your anonymity and security."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-black/20 backdrop-blur-lg">
        <div className="container max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm font-medium">
            &copy; 2026 ALIVE AI. Engineered for Humanity.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-slate-500">
            <span></span>
            <span className="text-white bg-white/5 px-3 py-1 rounded-full border border-white/10 hover:bg-white/10 transition-colors cursor-default">
              
            </span>
          </div>
        </div>
      </footer>

    </PageTransition>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3 hover:bg-white/10 transition-colors">
      <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300">
        {icon}
      </div>
      <div>
        <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">{label}</div>
        <div className="text-white font-bold">{value}</div>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, desc }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="glass-panel p-8 hover:border-indigo-500/30 transition-all duration-300 group"
    >
      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 shadow-inner border border-white/5 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">{title}</h3>
      <p className="text-slate-400 leading-relaxed font-medium">
        {desc}
      </p>
    </motion.div>
  )
}