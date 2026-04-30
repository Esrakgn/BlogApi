const Marquee = ({ text }) => (
  <div className="bg-black border-y-2 border-black py-3 overflow-hidden relative">
    <div className="flex whitespace-nowrap animate-marquee">
      {[...Array(10)].map((_, index) => (
        <span key={index} className="text-[#f472b6] text-xs font-mono font-black uppercase tracking-[0.5em] mx-12">
          {text}
        </span>
      ))}
    </div>
  </div>
);

export default Marquee;
