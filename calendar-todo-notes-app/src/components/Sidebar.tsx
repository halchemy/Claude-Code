import { useApp } from '../store';
import type { MenuType } from '../types';

interface MenuItem {
  id: MenuType;
  label: string;
  icon: string;
  color: string;
}

const menuItems: MenuItem[] = [
  { id: 'calendar', label: 'カレンダー', icon: '📅', color: 'from-violet-500 to-purple-600' },
  { id: 'todo', label: 'Todo', icon: '✅', color: 'from-cyan-500 to-teal-600' },
  { id: 'notes', label: 'メモ帳', icon: '📝', color: 'from-pink-500 to-rose-600' },
];

export function Sidebar() {
  const { activeMenu, setActiveMenu } = useApp();

  return (
    <aside className="w-64 min-h-screen bg-white/80 backdrop-blur-sm pop-shadow p-4 flex flex-col gap-4">
      <div className="text-center py-4">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 via-pink-500 to-cyan-500 bg-clip-text text-transparent">
          My Planner
        </h1>
        <p className="text-sm text-gray-500 mt-1">あなたの日々をサポート</p>
      </div>

      <nav className="flex flex-col gap-2 mt-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveMenu(item.id)}
            className={`
              pop-button flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-left
              transition-all duration-200
              ${
                activeMenu === item.id
                  ? `bg-gradient-to-r ${item.color} text-white pop-shadow-sm`
                  : 'bg-white/50 text-gray-700 hover:bg-white hover:pop-shadow-sm'
              }
            `}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto p-4 bg-gradient-to-r from-violet-100 to-pink-100 rounded-xl">
        <p className="text-xs text-gray-600 text-center">
          今日も素敵な1日を! 🌟
        </p>
      </div>
    </aside>
  );
}
