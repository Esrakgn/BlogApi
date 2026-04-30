import { Mail, MessageCircle, Send, Zap } from 'lucide-react';

const Footer = ({ t }) => (
  <footer className="bg-black pt-24 pb-12 px-8 text-white font-mono">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
        <div className="col-span-1 md:col-span-2">
          <h2 className="text-3xl font-serif italic font-black mb-8 flex items-center gap-3">
            <Zap size={32} className="fill-[#db2777] text-[#db2777]" /> THE RELAY
          </h2>
          <p className="text-white/60 text-sm leading-relaxed max-w-sm mb-10 font-medium text-left">{t.description}</p>
          <div className="flex gap-6">
            <MessageCircle size={20} className="text-white/60 hover:text-[#db2777] transition-colors cursor-pointer" />
            <Send size={20} className="text-white/60 hover:text-[#db2777] transition-colors cursor-pointer" />
            <Mail size={20} className="text-white/60 hover:text-[#db2777] transition-colors cursor-pointer" />
          </div>
        </div>

        <div className="space-y-6">
          <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#db2777] text-left">{t.resources}</h5>
          <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-white/60 text-left">
            {t.links.map((link, index) => (
              <li key={link}>
                <a href="#" className={`hover:text-white transition-colors ${index === 0 ? 'underline decoration-[#db2777] decoration-2' : ''}`}>
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-8">
          <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#db2777] text-left">{t.logTitle}</h5>
          <div className="bg-[#111] p-4 border border-white/10 font-mono text-[9px] text-[#db2777] space-y-2 text-left">
            <p>{'>'} {t.log[0]}</p>
            <p className="text-white">{'>'} {t.log[1]}</p>
            <p>{'>'} {t.log[2]}</p>
          </div>
        </div>
      </div>
      <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">{t.rights}</p>
        <div className="flex gap-8 text-[9px] font-black uppercase tracking-[0.4em] text-white/20">
          <a href="#" className="hover:text-[#db2777]">{t.privacy}</a>
          <a href="#" className="hover:text-[#db2777]">{t.agreement}</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
