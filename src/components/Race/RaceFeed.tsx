import RaceCard from './RaceCard';
import type { Race } from '../../types';

interface RaceFeedProps {
    races: Race[];
    selectedRaceId: string | null;
    onToggleRace: (id: string) => void;
    likedHorses: Set<string>;
    onToggleLike: (e: React.MouseEvent, horseName: string) => void;
}

const RaceFeed = ({ races, selectedRaceId, onToggleRace, likedHorses, onToggleLike }: RaceFeedProps) => {
    return (
        <div className="flex flex-col gap-4 pb-20 lg:pb-0">
            <div className="mb-2 px-1 text-xs font-bold uppercase tracking-widest text-zinc-500">Live Race Feed</div>
            {races.map((race) => (
                <RaceCard
                    key={race.race_id}
                    race={race}
                    isExpanded={selectedRaceId === race.race_id}
                    onToggle={() => onToggleRace(race.race_id)}
                    likedHorses={likedHorses}
                    onToggleLike={onToggleLike}
                />
            ))}
        </div>
    );
};

export default RaceFeed;
