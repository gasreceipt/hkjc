import { useState, useEffect } from 'react';
import {
  CloudRain, Sun, Wind, ChevronDown, ChevronUp, Trophy, Zap,
  BarChart2, Calendar, LayoutDashboard, Settings, Search, Bell, Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import racesData from './races.json';

// Types derived from our JSON structure
interface Horse {
  name: string;
  number: string;
  jockey: string;
  trainer: string;
  draw: string;
  odds: string;
  place: string;
  prevOdds?: string;
}

interface Race {
  race_id: string;
  date: string;
  venue: string;
  race_no: string;
  course: string;
  going: string;
  distance: string;
  horses: Horse[];
}

const App = () => {
  const [selectedRaceId, setSelectedRaceId] = useState<string | null>(racesData[0]?.race_id || null);
  const [races, setRaces] = useState<Race[]>(racesData as Race[]);
  const [activeTab, setActiveTab] = useState('runners');
  const [likedHorses, setLikedHorses] = useState<Set<string>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
      setActiveTab('runners');
    }
  };

  const toggleLike = (e: React.MouseEvent, horseName: string) => {
    e.stopPropagation();
    const newLiked = new Set(likedHorses);
    if (newLiked.has(horseName)) newLiked.delete(horseName);
    else newLiked.add(horseName);
    setLikedHorses(newLiked);
  }

  const getWeatherIcon = (going: string) => {
    const lower = going.toLowerCase();
    if (lower.includes('good') || lower.includes('fast')) return <Sun size={14} className="text-orange" />;
    if (lower.includes('wet') || lower.includes('rain') || lower.includes('yielding')) return <CloudRain size={14} className="text-primary" />;
    return <Wind size={14} className="text-tertiary" />;
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="logo-area">
          <div className="logo-icon"><Zap size={20} fill="currentColor" /></div>
          {sidebarOpen && <span className="logo-text">HKJC<span className="text-highlight">Bot</span></span>}
        </div>

        <nav className="nav-menu">
          <div className="nav-item active">
            <LayoutDashboard size={20} />
            {sidebarOpen && <span>Live Races</span>}
          </div>
          <div className="nav-item">
            <BarChart2 size={20} />
            {sidebarOpen && <span>Analysis</span>}
          </div>
          <div className="nav-item">
            <Calendar size={20} />
            {sidebarOpen && <span>Schedule</span>}
          </div>
          <div className="nav-item">
            <Settings size={20} />
            {sidebarOpen && <span>Settings</span>}
          </div>
        </nav>

        <div className="user-profile">
          <div className="avatar">MW</div>
          {sidebarOpen && (
            <div className="user-info">
              <div className="user-name">Max W.</div>
              <div className="user-role">Pro Member</div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-content">
        {/* Top Header */}
        <header className="top-header">
          <div className="flex items-center gap-4">
            <button className="icon-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu size={20} />
            </button>
            <h2 className="page-title">Today's Races</h2>
          </div>

          <div className="header-actions">
            <div className="search-bar">
              <Search size={16} className="text-tertiary" />
              <input type="text" placeholder="Search horses, jockeys..." />
            </div>
            <button className="icon-btn relative">
              <Bell size={20} />
              <span className="notification-dot"></span>
            </button>
          </div>
        </header>

        {/* Scrollable Feed */}
        <div className="content-scroll">
          <div className="content-cols">

            {/* Center: Race Feed */}
            <div className="feed-column">
              {/* Stats / Hero Section */}
              <div className="stats-grid mb-6">
                <div className="stat-card">
                  <div className="stat-label">Next Race</div>
                  <div className="stat-value text-green">R2 Sha Tin</div>
                  <div className="stat-sub">Starting in 12m</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Active Pools</div>
                  <div className="stat-value">$12.5M</div>
                  <div className="stat-sub text-green">+4.2% vs avg</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Bot Accuracy</div>
                  <div className="stat-value text-orange">76%</div>
                  <div className="stat-sub">Last 50 races</div>
                </div>
              </div>

              <div className="section-title">Live Race Feed</div>

              {/* Race Cards */}
              <div className="races-list flex flex-col gap-4">
                {races.map((race) => {
                  const isExpanded = selectedRaceId === race.race_id;
                  const isTurf = race.course.toLowerCase().includes('turf');
                  const sortedHorses = [...race.horses].sort((a, b) => parseFloat(a.odds) - parseFloat(b.odds));
                  const topPick = sortedHorses[0];
                  const valuePick = sortedHorses[2];

                  return (
                    <motion.div
                      key={race.race_id}
                      className={`race-card ${isExpanded ? 'active' : ''}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      {/* Race Header */}
                      <div
                        className="race-header"
                        onClick={() => toggleRace(race.race_id)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="race-number-box">
                            <span className="race-label">R{race.race_no}</span>
                            <span className="race-time">Live</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-lg font-bold text-white">{race.venue}</h3>
                              <div className={`badge ${isTurf ? 'badge-turf' : 'badge-dirt'}`}>
                                {isTurf ? 'TURF' : 'DIRT'}
                              </div>
                            </div>
                            <div className="flex items-center gap-3 text-secondary text-sm">
                              <span>{race.distance}m</span>
                              <span className="divider">•</span>
                              <div className="flex items-center gap-1">
                                {getWeatherIcon(race.going)}
                                <span>{race.going}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          {!isExpanded && (
                            <div className="preview-prediction">
                              <Trophy size={14} className="text-green" />
                              <span>Pick: <span className="text-white font-bold">{topPick?.name.split('(')[0]}</span></span>
                            </div>
                          )}
                          {isExpanded ? <ChevronUp size={20} className="text-tertiary" /> : <ChevronDown size={20} className="text-tertiary" />}
                        </div>
                      </div>

                      {/* Collapsible Content */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="race-content">
                              <div className="tabs">
                                <button className={`tab-btn ${activeTab === 'runners' ? 'active' : ''}`} onClick={() => setActiveTab('runners')}>Runners</button>
                                <button className={`tab-btn ${activeTab === 'analysis' ? 'active' : ''}`} onClick={() => setActiveTab('analysis')}>Analysis</button>
                                <button className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => setActiveTab('stats')}>Pool Stats</button>
                              </div>

                              {activeTab === 'analysis' && (
                                <div className="analysis-grid p-6">
                                  <div className="prediction-box main-pick">
                                    <div className="box-header">
                                      <div className="flex items-center gap-2">
                                        <Trophy size={18} className="text-green" />
                                        <span className="label">Bot Top Pick</span>
                                      </div>
                                      <span className="confidence text-green">87% Confidence</span>
                                    </div>
                                    <div className="horse-name-lg">{topPick?.name.split('(')[0]}</div>
                                    <p className="analysis-text">
                                      Dominant recent form. The barrier draw of {topPick?.draw} is ideal for this {race.distance}m start.
                                      Speed map suggests clear running.
                                    </p>
                                  </div>

                                  <div className="prediction-box value-pick">
                                    <div className="box-header">
                                      <div className="flex items-center gap-2">
                                        <Zap size={18} className="text-orange" />
                                        <span className="label">Value Play</span>
                                      </div>
                                      <span className="odds-lg">{valuePick?.odds}</span>
                                    </div>
                                    <div className="horse-name-lg">{valuePick?.name.split('(')[0]}</div>
                                    <p className="analysis-text">
                                      Overpriced for current condition. Watch for late market moves.
                                    </p>
                                  </div>
                                </div>
                              )}

                              {activeTab === 'runners' && (
                                <div className="runners-table">
                                  <div className="table-header">
                                    <div className="col-cloth">No.</div>
                                    <div className="col-horse">Horse Details</div>
                                    <div className="col-draw">Draw</div>
                                    <div className="col-odds">Win Odds</div>
                                  </div>

                                  {race.horses.map((horse) => {
                                    const isLiked = likedHorses.has(horse.name);
                                    const isFav = horse === topPick;
                                    const prev = parseFloat(horse.prevOdds || horse.odds);
                                    const curr = parseFloat(horse.odds);
                                    let oddsClass = 'odds-tag';
                                    if (isFav) oddsClass += ' fav';
                                    else if (curr > prev) oddsClass += ' drift';
                                    else if (curr < prev) oddsClass += ' shorten';

                                    return (
                                      <div key={horse.number} className="table-row" onClick={(e) => toggleLike(e, horse.name)}>
                                        <div className="col-cloth">
                                          <span className="cloth-badge">{parseInt(horse.number)}</span>
                                        </div>
                                        <div className="col-horse">
                                          <div className="flex items-center gap-2">
                                            <span className="horse-name">{horse.name.split('(')[0]}</span>
                                            {isLiked && <Zap size={14} className="text-orange fill-current" />}
                                          </div>
                                          <div className="sub-info">
                                            J: {horse.jockey} <span className="divider">•</span> T: {horse.trainer}
                                          </div>
                                        </div>
                                        <div className="col-draw text-secondary font-mono">{horse.draw}</div>
                                        <div className="col-odds">
                                          <div className={oddsClass}>{horse.odds}</div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}

                              {activeTab === 'stats' && (
                                <div className="p-12 flex flex-col items-center justify-center text-secondary">
                                  <BarChart2 size={64} strokeWidth={1} className="mb-4 opacity-20" />
                                  <p>Live pool data visualization requires a premium data subscription.</p>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Right: Widgets Column */}
            <div className="widget-column">
              <div className="widget-card">
                <div className="widget-header">
                  <h3>Market Movers</h3>
                  <BarChart2 size={16} className="text-secondary" />
                </div>
                <div className="mover-item">
                  <div className="flex flex-col">
                    <span className="font-bold text-sm">Vital Spark</span>
                    <span className="text-xs text-secondary">R6 Sha Tin</span>
                  </div>
                  <div className="text-right">
                    <div className="text-green font-mono font-bold">4.2</div>
                    <div className="text-xs text-green line-through">6.5</div>
                  </div>
                </div>
                <div className="mover-item">
                  <div className="flex flex-col">
                    <span className="font-bold text-sm">Lucky Star</span>
                    <span className="text-xs text-secondary">R8 Sha Tin</span>
                  </div>
                  <div className="text-right">
                    <div className="text-red font-mono font-bold">12.0</div>
                    <div className="text-xs text-red">8.0</div>
                  </div>
                </div>
              </div>

              <div className="widget-card">
                <div className="widget-header">
                  <h3>Upcoming</h3>
                  <Calendar size={16} className="text-secondary" />
                </div>
                <div className="schedule-item">
                  <span className="text-sm font-bold">Happy Valley</span>
                  <span className="text-xs text-secondary">Tomorrow, 19:30</span>
                </div>
                <div className="schedule-item">
                  <span className="text-sm font-bold">Sha Tin</span>
                  <span className="text-xs text-secondary">Sat, 13:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
