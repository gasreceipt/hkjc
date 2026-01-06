import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Trophy, Zap, CloudRain, Sun, Wind, BarChart2 } from 'lucide-react';
import type { Race } from '../../types';

interface RaceCardProps {
    race: Race;
    isExpanded: boolean;
    onToggle: () => void;
    likedHorses: Set<string>;
    onToggleLike: (e: React.MouseEvent, horseName: string) => void;
}

const RaceCard = ({ race, isExpanded, onToggle, likedHorses, onToggleLike }: RaceCardProps) => {
    const [activeTab, setActiveTab] = useState('runners');

    const isTurf = race.course.toLowerCase().includes('turf');
    const sortedHorses = [...race.horses].sort((a, b) => parseFloat(a.odds) - parseFloat(b.odds));
    const topPick = sortedHorses[0];
    const valuePick = sortedHorses[2];

    const getWeatherIcon = (going: string) => {
        const lower = going.toLowerCase();
        if (lower.includes('good') || lower.includes('fast')) return <Sun size={14} className="text-orange-500" />;
        if (lower.includes('wet') || lower.includes('rain')) return <CloudRain size={14} className="text-blue-500" />;
        return <Wind size={14} className="text-zinc-500" />;
    };

    return (
        <motion.div
            className={`rounded-2xl border transition-all duration-200 ${isExpanded
                ? 'border-blue-500 bg-gradient-to-b from-zinc-900 to-zinc-950'
                : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700 hover:shadow-lg'
                }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
        >
            {/* Header */}
            <div className="flex cursor-pointer items-center justify-between p-5" onClick={onToggle}>
                <div className="flex items-center gap-4">
                    <div className="flex min-w-[60px] flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-800/50 py-2">
                        <span className="text-lg font-extrabold leading-none text-green-500">R{race.race_no}</span>
                        <span className="animate-pulse text-[10px] font-bold uppercase text-red-500">Live</span>
                    </div>

                    <div>
                        <div className="mb-1 flex items-center gap-3">
                            <h3 className="text-lg font-bold text-white">{race.venue}</h3>
                            <div className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${isTurf
                                ? 'border border-green-500/20 bg-green-500/10 text-green-500'
                                : 'border border-orange-500/20 bg-orange-500/10 text-orange-500'
                                }`}>
                                {isTurf ? 'TURF' : 'DIRT'}
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-zinc-400">
                            <span>{race.distance}m</span>
                            <span className="h-1 w-1 rounded-full bg-zinc-700" />
                            <div className="flex items-center gap-1">
                                {getWeatherIcon(race.going)}
                                <span>{race.going}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {!isExpanded && (
                        <div className="hidden items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-3 py-1.5 text-xs text-zinc-400 sm:flex">
                            <Trophy size={14} className="text-green-500" />
                            <span>Pick: <span className="font-bold text-white">{topPick?.name.split('(')[0]}</span></span>
                        </div>
                    )}
                    {isExpanded ? <ChevronUp size={20} className="text-zinc-500" /> : <ChevronDown size={20} className="text-zinc-500" />}
                </div>
            </div>

            {/* Expanded Content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="border-t border-zinc-800">
                            {/* Tabs */}
                            <div className="flex gap-6 border-b border-zinc-800 px-6">
                                {['runners', 'analysis', 'stats'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={(e) => { e.stopPropagation(); setActiveTab(tab); }}
                                        className={`relative py-4 text-sm font-medium transition-colors ${activeTab === tab ? 'text-blue-500' : 'text-zinc-400 hover:text-white'
                                            }`}
                                    >
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                        {activeTab === tab && (
                                            <motion.div
                                                layoutId="underline"
                                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            <div className="p-0">
                                {activeTab === 'analysis' && (
                                    <div className="grid gap-6 p-6 sm:grid-cols-2">
                                        <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-5">
                                            <div className="mb-4 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Trophy size={18} className="text-green-500" />
                                                    <span className="text-xs font-bold uppercase text-zinc-400">Bot Pick</span>
                                                </div>
                                                <span className="rounded bg-green-500/10 px-2 py-0.5 text-xs font-bold text-green-500">87% CONFIDENCE</span>
                                            </div>
                                            <div className="mb-2 text-xl font-bold text-white">{topPick?.name.split('(')[0]}</div>
                                            <p className="text-sm leading-relaxed text-zinc-400">
                                                Dominant recent form. The barrier draw of {topPick?.draw} is ideal for this {race.distance}m start.
                                            </p>
                                        </div>

                                        <div className="rounded-xl border border-orange-500/30 bg-orange-500/5 p-5">
                                            <div className="mb-4 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Zap size={18} className="text-orange-500" />
                                                    <span className="text-xs font-bold uppercase text-zinc-400">Value</span>
                                                </div>
                                                <span className="font-mono text-xl font-bold text-orange-500">{valuePick?.odds}</span>
                                            </div>
                                            <div className="mb-2 text-xl font-bold text-white">{valuePick?.name.split('(')[0]}</div>
                                            <p className="text-sm leading-relaxed text-zinc-400">
                                                Overpriced for current condition. Watch for late moves.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'runners' && (
                                    <div>
                                        <div className="flex border-b border-zinc-800 bg-zinc-900/50 px-6 py-3 text-xs font-bold uppercase tracking-wider text-zinc-500">
                                            <div className="w-14">No.</div>
                                            <div className="flex-1">Horse Details</div>
                                            <div className="w-16 text-center">Draw</div>
                                            <div className="w-20 text-right">Odds</div>
                                        </div>
                                        {race.horses.map((horse) => {
                                            const isLiked = likedHorses.has(horse.name);
                                            const isFav = horse === topPick;
                                            const prev = parseFloat(horse.prevOdds || horse.odds);
                                            const curr = parseFloat(horse.odds);

                                            let oddsColor = 'bg-zinc-800 text-white';
                                            if (isFav) oddsColor = 'bg-green-500 text-black shadow-[0_0_15px_rgba(34,197,94,0.4)]';
                                            else if (curr > prev) oddsColor = 'bg-red-500/10 text-red-500 border border-red-500/20';
                                            else if (curr < prev) oddsColor = 'bg-green-500/10 text-green-500 border border-green-500/20';

                                            return (
                                                <div
                                                    key={horse.number}
                                                    onClick={(e) => onToggleLike(e, horse.name)}
                                                    className="flex cursor-pointer items-center border-b border-zinc-800/50 px-6 py-4 transition-colors hover:bg-white/5 last:border-0"
                                                >
                                                    <div className="w-14">
                                                        <span className="flex h-7 w-7 items-center justify-center rounded bg-zinc-800 text-xs font-bold text-white border border-zinc-700">
                                                            {parseInt(horse.number)}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-semibold text-zinc-100">{horse.name.split('(')[0]}</span>
                                                            {isLiked && <Zap size={14} className="fill-orange-500 text-orange-500" />}
                                                        </div>
                                                        <div className="mt-0.5 text-xs text-zinc-500">
                                                            J: {horse.jockey} <span className="mx-1 opacity-50">•</span> T: {horse.trainer}
                                                        </div>
                                                    </div>
                                                    <div className="w-16 text-center font-mono text-sm text-zinc-400">{horse.draw}</div>
                                                    <div className="w-20 text-right">
                                                        <span className={`inline-block min-w-[60px] rounded-lg px-2 py-1.5 text-center font-mono text-sm font-bold ${oddsColor}`}>
                                                            {horse.odds}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {activeTab === 'stats' && (
                                    <div className="flex flex-col items-center justify-center py-16 text-zinc-600">
                                        <BarChart2 size={48} className="mb-4 opacity-20" />
                                        <p>Live pool data visualization requires premium.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default RaceCard;
