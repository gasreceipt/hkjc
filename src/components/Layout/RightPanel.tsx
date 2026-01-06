import { BarChart2, Calendar } from 'lucide-react';

const RightPanel = () => {
    return (
        <div className="hidden w-80 flex-col gap-4 lg:flex sticky top-0 h-screen pt-4 pr-4">
            {/* Market Movers Widget */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 backdrop-blur-md">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white">Market Movers</h3>
                    <BarChart2 size={16} className="text-zinc-500" />
                </div>

                <div className="space-y-3">
                    <MoverItem name="Vital Spark" race="R6 Sha Tin" oldOdds="6.5" newOdds="4.2" trend="down" />
                    <MoverItem name="Lucky Star" race="R8 Sha Tin" oldOdds="8.0" newOdds="12.0" trend="up" />
                </div>
            </div>

            {/* Upcoming Widget */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 backdrop-blur-md">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white">Upcoming</h3>
                    <Calendar size={16} className="text-zinc-500" />
                </div>

                <div className="space-y-3">
                    <ScheduleItem venue="Happy Valley" time="Tomorrow, 19:30" />
                    <ScheduleItem venue="Sha Tin" time="Sat, 13:00" />
                </div>
            </div>
        </div>
    );
};

const MoverItem = ({ name, race, oldOdds, newOdds, trend }: any) => {
    const isGood = trend === 'down';
    const colorClass = isGood ? 'text-green-500' : 'text-red-500';

    return (
        <div className="flex items-center justify-between border-b border-zinc-800/50 pb-3 last:border-0 last:pb-0">
            <div className="flex flex-col">
                <span className="text-sm font-semibold text-zinc-100">{name}</span>
                <span className="text-xs text-zinc-500">{race}</span>
            </div>
            <div className="text-right">
                <div className={`font-mono text-sm font-bold ${colorClass}`}>{newOdds}</div>
                <div className={`text-xs line-through ${colorClass} opacity-70`}>{oldOdds}</div>
            </div>
        </div>
    );
};

const ScheduleItem = ({ venue, time }: any) => (
    <div className="flex items-center justify-between border-b border-zinc-800/50 pb-3 last:border-0 last:pb-0">
        <span className="text-sm font-bold text-zinc-200">{venue}</span>
        <span className="text-xs text-zinc-500">{time}</span>
    </div>
);

export default RightPanel;
