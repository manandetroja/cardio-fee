import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Calendar, ChevronRight, TrendingUp } from "lucide-react";
import PageTransition from "../components/PageTransition";

export default function History() {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const stored = localStorage.getItem('cardio_history');
        if (stored) {
            setHistory(JSON.parse(stored));
        }
    }, []);

    return (
        <PageTransition className="container max-w-5xl mx-auto px-4 py-8">

            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-white font-['Outfit']">Health History</h1>
                    <p className="text-slate-400 mt-1">Track your progress and risk assessments over time.</p>
                </div>
                <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400 hidden md:block">
                    <TrendingUp size={24} />
                </div>
            </div>

            {/* Chart Section */}
            <div className="glass-panel p-6 md:p-8 mb-8 border border-white/5">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-lg font-bold text-slate-200">Risk Trend Analysis</h2>
                </div>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={[...history].reverse()}>
                            <defs>
                                <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                            <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                            <YAxis domain={[0, 1]} stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${Math.round(val * 100)}%`} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '16px', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.5)', color: '#f8fafc' }}
                                itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                                formatter={(value) => [`${(value * 100).toFixed(1)}%`, "Risk Probability"]}
                                labelStyle={{ color: '#94a3b8', marginBottom: '8px' }}
                            />
                            <Area type="monotone" dataKey="risk" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorRisk)" activeDot={{ r: 6, strokeWidth: 0, fill: '#6366f1' }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Table Section */}
            <div className="glass-panel overflow-hidden border border-white/5">
                <div className="p-6 border-b border-white/5">
                    <h3 className="font-bold text-slate-200">Past Assessments</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-950/30">
                            <tr>
                                <th className="p-4 pl-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Risk Category</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Probability</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {history.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="p-8 text-center text-slate-500">No history available yet.</td>
                                </tr>
                            ) : (
                                history.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4 pl-6 text-slate-300 font-medium whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={16} className="text-slate-500" /> {item.date}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <StatusBadge risk={item.risk} label={item.risk_category} />
                                        </td>
                                        <td className="p-4 font-bold text-indigo-400">
                                            {(item.risk * 100).toFixed(1)}%
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </PageTransition>
    );
}

function StatusBadge({ risk, label }) {
    const isHigh = risk > 0.5;
    const isMed = risk > 0.2;

    let styles = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]";

    if (isHigh) {
        styles = "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.2)]";
    } else if (isMed) {
        styles = "bg-amber-500/10 text-amber-400 border-amber-500/20";
    }

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles}`}>
            {label || (isHigh ? "High Risk" : "Normal")}
        </span>
    )
}
