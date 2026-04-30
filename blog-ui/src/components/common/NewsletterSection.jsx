const NewsletterSection = ({ t }) => (
  <section className="bg-[#fdfcf8] py-24 px-8 border-y-2 border-black overflow-hidden relative">
    <div
      className="absolute inset-0 opacity-[0.1]"
      style={{
        backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}
    />
    <div className="max-w-4xl mx-auto relative z-10">
      <div className="bg-[#e0e0f8] border-2 border-black p-12 md:p-20 text-center relative shadow-[1px_1px_0px_1px_rgba(255,255,255,1),_0_0_0_2px_rgba(0,0,0,1)]">
        <div className="absolute inset-[-4px] border-2 border-black pointer-events-none" />
        <h2 className="text-5xl md:text-7xl font-serif italic font-bold text-black mb-12 leading-tight">
          {t.titleTop} <br /> {t.titleBottom}
        </h2>
        <div className="flex flex-col md:flex-row max-w-lg mx-auto border-2 border-black bg-white overflow-hidden">
          <input
            type="text"
            placeholder={t.placeholder}
            className="flex-1 px-6 py-4 font-mono text-xs uppercase tracking-widest outline-none border-b-2 md:border-b-0 md:border-r-2 border-black placeholder:text-black/30"
          />
          <button className="bg-[#f472b6] text-black px-10 py-4 font-serif italic font-bold text-lg hover:bg-black hover:text-[#f472b6] transition-colors uppercase">
            {t.button}
          </button>
        </div>
      </div>
    </div>
  </section>
);

export default NewsletterSection;
