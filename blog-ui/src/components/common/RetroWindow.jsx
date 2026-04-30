const RetroWindow = ({ title, color = 'bg-[#f472b6]', children, className = '' }) => (
  <div className={`border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-white overflow-hidden ${className}`}>
    <div className={`${color} border-b-2 border-black p-2 flex items-center justify-between`}>
      <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] flex items-center gap-2 text-black text-left">
        <div className="w-2 h-2 bg-black rounded-full" />
        {title}
      </span>
      <div className="flex gap-1">
        <div className="w-3 h-3 border border-black bg-white/20" />
        <div className="w-3 h-3 border border-black bg-black" />
      </div>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

export default RetroWindow;
