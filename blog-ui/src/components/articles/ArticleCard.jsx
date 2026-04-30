import { Cpu } from 'lucide-react';
import RetroWindow from '../common/RetroWindow.jsx';

const ArticleCard = ({ category, title, excerpt, date, image, windowColor, onClick }) => (
  <div onClick={onClick} className="group cursor-pointer text-left">
    <RetroWindow title={category} color={windowColor} className="h-full group-hover:-translate-y-2 transition-all duration-300">
      <div className="aspect-square bg-[#fdfcf8] mb-6 border-2 border-black relative overflow-hidden flex items-center justify-center p-3">
        {image ? (
          <img src={image} alt={title} className="h-full w-full object-contain" />
        ) : (
          <>
            <div
              className="absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 50%, #000 50%, #000 75%, transparent 75%, transparent)',
                backgroundSize: '8px 8px',
              }}
            />
            <Cpu className="w-12 h-12 text-black/20 group-hover:text-[#db2777] transition-colors" />
          </>
        )}
      </div>
      <div className="space-y-4">
        <div className="text-[9px] font-mono font-black text-black/40 uppercase tracking-[0.3em]">{date}</div>
        <h4 className="text-2xl font-serif italic font-bold leading-[1.1] text-black group-hover:text-[#db2777] transition-colors">{title}</h4>
        <p className="text-sm text-black/60 leading-relaxed font-medium line-clamp-2">{excerpt}</p>
      </div>
    </RetroWindow>
  </div>
);

export default ArticleCard;
