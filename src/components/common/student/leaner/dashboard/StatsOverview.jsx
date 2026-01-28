import { FaBookReader, FaClipboardCheck, FaHistory, FaCoins } from 'react-icons/fa';

const StatItem = ({ icon: Icon, label, value, color }) => (
    <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${color}`}>
            <Icon size={20} />
        </div>
        <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</p>
            <p className="text-xl font-bold text-slate-800">{value}</p>
        </div>
    </div>
);

const StatsOverview = () => {
  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/60 border border-slate-100 h-full">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
        Bảng thống kê
      </h3>
      <div className="grid grid-cols-1 gap-2">
         <StatItem icon={FaBookReader} label="Tổng số bài học" value="12" color="bg-blue-500 shadow-blue-500/30" />
         <StatItem icon={FaClipboardCheck} label="Tổng số bài test" value="05" color="bg-purple-500 shadow-purple-500/30" />
         <StatItem icon={FaHistory} label="Tổng thời lượng" value="24h 15m" color="bg-orange-500 shadow-orange-500/30" />
         <div className="mt-2 pt-4 border-t border-slate-100">
             <StatItem icon={FaCoins} label="Số Coin hiện có" value="2,450" color="bg-yellow-400 shadow-yellow-400/30" />
         </div>
      </div>
    </div>
  );
};
export default StatsOverview;