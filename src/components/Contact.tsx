import React from 'react';
import { 
  Mail, 
  MapPin, 
  Phone, 
  Globe, 
  Clock, 
  Github,
  Linkedin,
  ShieldCheck,
  Zap,
  MousePointer2
} from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div className="pb-24 font-sans text-slate-800 dark:text-slate-100">
      
      {/* Header Section */}
      <section className="py-24 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-2">
          <Globe className="h-3 w-3" /> Global Operations
        </div>
        <h1 className="text-5xl sm:text-7xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">Contact HQ</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto text-balance">
          Our technical support architects are stationed globally to ensure your workstation remains at peak performance. Reach out via our secure communication nodes.
        </p>
      </section>

      {/* Contact Grid */}
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Direct Channels */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] space-y-6 hover:border-emerald-500/30 transition-all group">
            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl w-fit group-hover:scale-110 transition-transform">
              <Mail className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Email Node</h3>
              <p className="text-lg font-black text-slate-900 dark:text-white">nextronix@gmail.com</p>
            </div>
            <p className="text-xs text-slate-500 leading-normal">Our primary encrypted link for all technical and logistics inquiries.</p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] space-y-6 hover:border-emerald-500/30 transition-all group">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl w-fit group-hover:scale-110 transition-transform">
              <Phone className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Voice Protocol</h3>
              <p className="text-lg font-black text-slate-900 dark:text-white">+91 9126271333</p>
            </div>
            <p className="text-xs text-slate-500 leading-normal">Direct audio frequency for urgent shipment support and escalations.</p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] space-y-6 hover:border-emerald-500/30 transition-all group">
            <div className="p-3 bg-purple-500/10 text-purple-500 rounded-2xl w-fit group-hover:scale-110 transition-transform">
              <MapPin className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">HQ Logistics</h3>
              <p className="text-lg font-black text-slate-900 dark:text-white">Kurnool</p>
            </div>
            <p className="text-xs text-slate-500 leading-normal">Our core innovation hub located at Adoni, Kurnool, India.</p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] space-y-6 hover:border-emerald-500/30 transition-all group">
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl w-fit group-hover:scale-110 transition-transform">
              <Clock className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Uptime Hours</h3>
              <p className="text-lg font-black text-slate-900 dark:text-white">24/7 Monitoring</p>
            </div>
            <p className="text-xs text-slate-500 leading-normal">Automated systems active 24/7. Human architects available Mon-Fri.</p>
          </div>
        </div>

        {/* Sidebar Info */}
        <aside className="space-y-6">
          <div className="bg-slate-950 text-white p-8 rounded-[2.5rem] space-y-6">
            <h3 className="text-xl font-black uppercase tracking-tighter italic">About Nextronix</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Nextronix was established with a singular mission: to provide technical professionals with the highest caliber of peripheral hardware and digital laboratory tools.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-emerald-500 group cursor-pointer">
                <ShieldCheck className="h-4 w-4" /> Secure Sourcing
              </div>
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-blue-500 group cursor-pointer">
                <Zap className="h-4 w-4" /> Rapid Deployment
              </div>
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-purple-500 group cursor-pointer">
                <MousePointer2 className="h-4 w-4" /> Precision Tested
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Connect</h3>
              <div className="flex gap-4">
                <a 
                  href="https://github.com/lasyapriya26" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-3 bg-slate-50 dark:bg-slate-800 rounded-full hover:bg-emerald-500 hover:text-white text-slate-700 dark:text-slate-300 transition-all cursor-pointer flex items-center justify-center"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a 
                  href="https://www.linkedin.com/in/lasya-priya-dasari-080384409/?isSelfProfile=false" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-3 bg-slate-50 dark:bg-slate-800 rounded-full hover:bg-emerald-500 hover:text-white text-slate-700 dark:text-slate-300 transition-all cursor-pointer flex items-center justify-center"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
          </div>
        </aside>

      </div>

      {/* Visual Accent */}
      <div className="max-w-6xl mx-auto px-4 mt-24">
        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent"></div>
        <p className="text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.5em] text-center mt-12">Precision Handled • Endlessly Monitored • Verified HQ</p>
      </div>

    </div>
  );
};

export default Contact;
