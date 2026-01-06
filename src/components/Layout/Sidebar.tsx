import { LayoutDashboard, BarChart2, Calendar, Settings, Zap } from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
    return (
        <aside
            className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-zinc-800 bg-zinc-900/90 backdrop-blur-xl transition-transform duration-300 lg:static lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
        >
            {/* Logo Area */}
            <div className="flex h-16 items-center gap-3 border-b border-zinc-800 px-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 font-bold text-white shadow-lg shadow-blue-500/20">
                    <Zap size={20} fill="currentColor" />
                </div>
                <span className="text-lg font-bold tracking-tight text-white">
                    HKJC<span className="text-blue-500">Bot</span>
                </span>
            </div>

            {/* Navigation */}
            <nav className="flex flex-1 flex-col gap-1 p-4">
                <NavItem icon={<LayoutDashboard size={20} />} label="Live Races" active />
                <NavItem icon={<BarChart2 size={20} />} label="Analysis" />
                <NavItem icon={<Calendar size={20} />} label="Schedule" />
                <NavItem icon={<Settings size={20} />} label="Settings" />
            </nav>

            {/* User Profile */}
            <div className="border-t border-zinc-800 bg-zinc-900/50 p-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-zinc-700 bg-zinc-800 text-xs font-semibold text-white">
                        MW
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-white">Max W.</span>
                        <span className="text-xs text-zinc-400">Pro Member</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

const NavItem = ({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) => (
    <button
        className={`group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${active
            ? 'bg-blue-500/10 text-blue-500'
            : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
            }`}
    >
        {icon}
        <span>{label}</span>
    </button>
);

export default Sidebar;
