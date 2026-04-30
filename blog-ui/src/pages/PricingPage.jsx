import { useState } from 'react';
import { Check, Eye, Info, PenTool } from 'lucide-react';

const PricingPage = ({ t }) => {
  const [activePlanType, setActivePlanType] = useState('Reader');
  const currentPlans = activePlanType === 'Reader' ? t.readerPlans : t.writerPlans;

  return (
    <div className="bg-[#fdfcf8] min-h-screen py-24 px-8">
      <div className="max-w-7xl mx-auto text-center space-y-12 mb-20">
        <div className="inline-block border-2 border-black bg-white px-4 py-1 text-[10px] font-mono font-bold uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          {t.label}
        </div>

        <div className="flex justify-center">
          <div className="flex border-2 border-black bg-white p-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            <button
              onClick={() => setActivePlanType('Reader')}
              className={`px-8 py-3 text-[11px] font-mono font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${activePlanType === 'Reader' ? 'bg-[#db2777] text-white' : 'hover:bg-black/5 text-black'}`}
            >
              <Eye size={14} /> {t.reader}
            </button>
            <button
              onClick={() => setActivePlanType('Writer')}
              className={`px-8 py-3 text-[11px] font-mono font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${activePlanType === 'Writer' ? 'bg-[#db2777] text-white' : 'hover:bg-black/5 text-black'}`}
            >
              <PenTool size={14} /> {t.writer}
            </button>
          </div>
        </div>

        <div className="border-2 border-black bg-white p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative inline-block max-w-4xl">
          <h2 className="text-5xl md:text-7xl font-serif italic font-black text-black leading-tight">
            {activePlanType === 'Reader' ? t.readerTitle : t.writerTitle}
          </h2>
          <p className="text-xl text-black/60 mt-4 italic font-serif">{activePlanType === 'Reader' ? t.readerText : t.writerText}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 mb-32">
        {currentPlans.map((plan) => (
          <div key={plan.title} className={`border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col ${plan.color} relative overflow-hidden group text-left`}>
            {plan.isPopular && (
              <div className="absolute top-4 -right-12 bg-black text-white px-12 py-1 text-[8px] font-mono font-black uppercase tracking-[0.4em] rotate-45 border-y border-white/20">
                {t.popular}
              </div>
            )}

            <div className="p-8 border-b-2 border-black flex-1 space-y-6">
              <div>
                <h3 className="text-3xl font-serif italic font-black mb-1 text-black">{plan.title}</h3>
                <p className="text-xs font-mono font-bold text-black/60 uppercase">{plan.subtitle}</p>
              </div>

              <div className="py-8">
                <span className="text-6xl font-serif italic font-black text-black">{plan.price} TL</span>
                <span className="text-xs font-mono font-bold uppercase block text-black/40 mt-1">{t.monthly}</span>
              </div>

              <button className="w-full bg-white border-2 border-black py-4 font-mono font-bold text-[10px] uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:bg-black group-hover:text-white transition-all transform active:translate-y-1 active:shadow-none">
                {t.choose}
              </button>

              <ul className="space-y-4 pt-8">
                {plan.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3 text-[10px] font-mono font-bold uppercase text-black/80">
                    <Check size={14} className="mt-0.5 shrink-0 text-black" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 bg-black/5 text-[9px] font-mono font-bold uppercase tracking-widest leading-relaxed text-black/60 italic">
              <Info size={12} className="inline mr-2 mb-1" />
              {plan.footerNote}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingPage;
