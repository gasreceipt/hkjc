import { useState, useEffect } from 'react';
import { Search, Bell, Menu, X } from 'lucide-react';
import racesData from './races.json';
import Sidebar from './components/Layout/Sidebar';
import RightPanel from './components/Layout/RightPanel';
import RaceFeed from './components/Race/RaceFeed';
import type { Race } from './types';

const App = () => {
  const [selectedRaceId, setSelectedRaceId] = useState<string | null>(racesData[0]?.race_id || null);
  const [races, setRaces] = useState<Race[]>(racesData as Race[]);
  const [likedHorses, setLikedHorses] = useState<Set<string>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Simulation of "Live Odds" updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRaces(currentRaces => {
        return currentRaces.map(race => {
          if (race.race_id !== selectedRaceId) return race;

          const updatedHorses = race.horses.map(horse => {
            if (Math.random() > 0.6) {
              const currentOdd = parseFloat(horse.odds);
              if (!isNaN(currentOdd)) {
                const prevOdds = horse.odds;
                const change = (Math.random() - 0.5) * 0.4;
                let newOdd = currentOdd + change;
                if (newOdd < 1.01) newOdd = 1.01;
                return { ...horse, odds: newOdd.toFixed(1), prevOdds };
              }
            }
            return horse;
          });
          return { ...race, horses: updatedHorses };
        });
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [selectedRaceId]);
  const toggleRace = (id: string) => {
    if (selectedRaceId === id) {
      setSelectedRaceId(null);
    } else {
      setSelectedRaceId(id);
    }
  };

  const toggleLike = (e: React.MouseEvent, horseName: string) => {
    e.stopPropagation();
    const newLiked = new Set(likedHorses);
    if (newLiked.has(horseName)) newLiked.delete(horseName);
    else newLiked.add(horseName);
    setLikedHorses(newLiked);
  }

  return (
    <div className="flex min-h-screen w-full bg-zinc-950 text-white">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} />

      {/* Main Content */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-950/80 px-4 backdrop-blur-xl lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white lg:hidden"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h2 className="text-xl font-bold tracking-tight text-white">Today's Races</h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1.5 focus-within:border-zinc-700 sm:flex">
              <Search size={14} className="text-zinc-500" />
              <input
                type="text"
                placeholder="Search..."
                className="w-32 bg-transparent text-sm text-white placeholder-zinc-500 outline-none focus:w-48 transition-all"
              />
            </div>
            <button className="relative rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white">
              <Bell size={20} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-zinc-950"></span>
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="mx-auto flex w-full max-w-[1600px] gap-8 p-4 lg:p-8">
            {/* Center Feed */}
            <div className="flex-1 min-w-0">
              {/* Stats Hero */}
              <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 backdrop-blur-sm">
                  <div className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-500">Next Race</div>
                  <div className="text-2xl font-bold text-green-500">R2 Sha Tin</div>
                  <div className="text-xs text-zinc-400 font-mono mt-1">Starting in 12m</div>
                </div>
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 backdrop-blur-sm">
                  <div className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-500">Active Pools</div>
                  <div className="text-2xl font-bold text-white">$12.5M</div>
                  <div className="text-xs text-green-500 font-mono mt-1">+4.2% vs avg</div>
                </div>
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 backdrop-blur-sm">
                  <div className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-500">Bot Accuracy</div>
                  <div className="text-2xl font-bold text-orange-500">76%</div>
                  <div className="text-xs text-zinc-400 font-mono mt-1">Last 50 races</div>
                </div>
              </div>

              <RaceFeed
                races={races}
                selectedRaceId={selectedRaceId}
                onToggleRace={toggleRace}
                likedHorses={likedHorses}
                onToggleLike={toggleLike}
              />
            </div>

            {/* Right Panel */}
            <RightPanel />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
