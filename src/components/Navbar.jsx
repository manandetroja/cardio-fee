import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Activity, LayoutGrid, ClipboardList, BookOpen, Clock, Menu, X, ChevronRight, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AliveLogo from "./AliveLogo";

export default function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isActive = (path) => location.pathname === path;

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when route changes
  const handleLinkClick = () => setIsOpen(false);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-slate-950/80 backdrop-blur-xl border-b border-white/5 py-4" : "bg-transparent py-6"
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group relative z-50">
            <div className={`p-2 rounded-xl transition-all duration-300 bg-indigo-600/20 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white border border-indigo-500/30`}>
              <AliveLogo className="w-6 h-6" color="currentColor" />
            </div>
            <span className="text-xl font-bold font-['Outfit'] tracking-tight flex items-baseline gap-0.5 text-white">
              ALIVE<span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse ml-0.5 shadow-[0_0_10px_#6366f1]"></span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 p-1.5 rounded-full border border-white/10 bg-black/20 backdrop-blur-md">
            <NavLink to="/" icon={<LayoutGrid size={16} />} label="Home" active={isActive("/")} />
            <NavLink to="/predict" icon={<Activity size={16} />} label="Predict" active={isActive("/predict")} />
            <NavLink to="/history" icon={<Clock size={16} />} label="History" active={isActive("/history")} />
            <NavLink to="/insights" icon={<BookOpen size={16} />} label="Insights" active={isActive("/insights")} />
            <NavLink to="/about" icon={<ClipboardList size={16} />} label="About" active={isActive("/about")} />
          </div>

          {/* CTA & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <Link to="/predict" className="hidden md:flex btn-primary !py-2 !px-5 !text-sm !rounded-full">
              Check Health <ChevronRight size={16} />
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-slate-300 hover:bg-slate-800 rounded-xl transition-colors relative z-50"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 z-40 bg-slate-950/90 md:hidden pt-28 px-4"
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              className="bg-slate-900 rounded-3xl shadow-2xl border border-white/10 overflow-hidden"
            >
              <div className="p-2 space-y-1">
                <NavLink to="/" icon={<LayoutGrid size={18} />} label="Home" active={isActive("/")} onClick={handleLinkClick} mobile />
                <NavLink to="/predict" icon={<Activity size={18} />} label="Predict" active={isActive("/predict")} onClick={handleLinkClick} mobile />
                <NavLink to="/history" icon={<Clock size={18} />} label="History" active={isActive("/history")} onClick={handleLinkClick} mobile />
                <NavLink to="/insights" icon={<BookOpen size={18} />} label="Insights" active={isActive("/insights")} onClick={handleLinkClick} mobile />
                <NavLink to="/about" icon={<ClipboardList size={18} />} label="About" active={isActive("/about")} onClick={handleLinkClick} mobile />
              </div>
              <div className="p-4 bg-slate-950/50 border-t border-white/5">
                <Link
                  to="/predict"
                  onClick={handleLinkClick}
                  className="flex items-center justify-center gap-2 w-full btn-primary"
                >
                  Start Assessment <Zap size={18} />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavLink({ to, icon, label, active, onClick, mobile }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 relative overflow-hidden group tracking-wide
        ${mobile ? "w-full py-4 text-base rounded-xl" : ""}
        ${active
          ? "text-white"
          : "text-slate-400 hover:text-white hover:bg-white/5"
        }
      `}
    >
      <span className="relative z-10 flex items-center gap-2">
        {icon}
        {label}
      </span>
      {active && !mobile && (
        <motion.div layoutId="nav-bg" className="absolute inset-0 bg-white/10 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.1)] -z-0" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
      )}
    </Link>
  );
}