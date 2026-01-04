import { useState } from 'react';
import { useApp } from '../store';
import { TodoModal } from './TodoModal';

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];
const MONTHS = [
  '1月', '2月', '3月', '4月', '5月', '6月',
  '7月', '8月', '9月', '10月', '11月', '12月'
];

function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const startPadding = firstDay.getDay();
  for (let i = startPadding - 1; i >= 0; i--) {
    const d = new Date(year, month, -i);
    days.push(d);
  }

  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }

  const endPadding = 42 - days.length;
  for (let i = 1; i <= endPadding; i++) {
    days.push(new Date(year, month + 1, i));
  }

  return days;
}

function formatDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'high': return 'bg-red-500';
    case 'medium': return 'bg-yellow-500';
    case 'low': return 'bg-green-500';
    default: return 'bg-gray-400';
  }
}

export function Calendar() {
  const { selectedDate, setSelectedDate, todos } = useApp();
  const [viewDate, setViewDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDateForTodo, setSelectedDateForTodo] = useState<Date | null>(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const days = getDaysInMonth(year, month);

  const todosByDate = todos.reduce((acc, todo) => {
    const key = todo.dueDate;
    if (!acc[key]) acc[key] = [];
    acc[key].push(todo);
    return acc;
  }, {} as Record<string, typeof todos>);

  const goToPrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setViewDate(today);
    setSelectedDate(today);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleDateDoubleClick = (date: Date) => {
    setSelectedDateForTodo(date);
    setIsModalOpen(true);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date) => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === month;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {year}年 {MONTHS[month]}
          </h2>
          <button
            onClick={goToToday}
            className="pop-button px-3 py-1 text-sm bg-violet-100 text-violet-700 rounded-full hover:bg-violet-200"
          >
            今日
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={goToPrevMonth}
            className="pop-button w-10 h-10 flex items-center justify-center bg-white rounded-full pop-shadow-sm hover:bg-gray-50"
          >
            ←
          </button>
          <button
            onClick={goToNextMonth}
            className="pop-button w-10 h-10 flex items-center justify-center bg-white rounded-full pop-shadow-sm hover:bg-gray-50"
          >
            →
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl pop-shadow p-4 flex-1">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {WEEKDAYS.map((day, index) => (
            <div
              key={day}
              className={`text-center text-sm font-medium py-2 ${
                index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-gray-600'
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((date, index) => {
            const dateKey = formatDateKey(date);
            const dateTodos = todosByDate[dateKey] || [];
            const dayOfWeek = date.getDay();

            return (
              <button
                key={index}
                onClick={() => handleDateClick(date)}
                onDoubleClick={() => handleDateDoubleClick(date)}
                className={`
                  pop-button relative min-h-[80px] p-2 rounded-xl text-left transition-all
                  ${!isCurrentMonth(date) ? 'opacity-40' : ''}
                  ${isSelected(date) ? 'bg-violet-100 ring-2 ring-violet-400' : 'bg-gray-50 hover:bg-gray-100'}
                  ${isToday(date) ? 'ring-2 ring-pink-400' : ''}
                `}
              >
                <span
                  className={`
                    text-sm font-medium
                    ${isToday(date) ? 'bg-pink-500 text-white px-2 py-0.5 rounded-full' : ''}
                    ${dayOfWeek === 0 ? 'text-red-500' : dayOfWeek === 6 ? 'text-blue-500' : 'text-gray-700'}
                  `}
                >
                  {date.getDate()}
                </span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {dateTodos.slice(0, 3).map((todo) => (
                    <div
                      key={todo.id}
                      className={`w-2 h-2 rounded-full ${getPriorityColor(todo.priority)}`}
                      title={todo.title}
                    />
                  ))}
                  {dateTodos.length > 3 && (
                    <span className="text-xs text-gray-500">+{dateTodos.length - 3}</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-center text-sm text-gray-500 mt-4">
        ダブルクリックでTodoを追加
      </p>

      {isModalOpen && selectedDateForTodo && (
        <TodoModal
          date={selectedDateForTodo}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedDateForTodo(null);
          }}
        />
      )}
    </div>
  );
}
