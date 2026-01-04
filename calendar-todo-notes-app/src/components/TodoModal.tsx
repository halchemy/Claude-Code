import { useState } from 'react';
import { useApp } from '../store';
import type { Priority } from '../types';

interface TodoModalProps {
  date: Date;
  onClose: () => void;
}

function formatDateForInput(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

const priorityOptions: { value: Priority; label: string; color: string }[] = [
  { value: 'high', label: '高', color: 'bg-red-500' },
  { value: 'medium', label: '中', color: 'bg-yellow-500' },
  { value: 'low', label: '低', color: 'bg-green-500' },
];

export function TodoModal({ date, onClose }: TodoModalProps) {
  const { addTodo } = useApp();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(formatDateForInput(date));
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [priority, setPriority] = useState<Priority>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTodo({
      title: title.trim(),
      description: description.trim(),
      dueDate,
      startTime,
      endTime,
      priority,
      completed: false,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl pop-shadow w-full max-w-md mx-4 overflow-hidden">
        <div className="bg-gradient-to-r from-violet-500 to-purple-600 p-4">
          <h3 className="text-xl font-bold text-white">新しいTodoを追加</h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              タイトル *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Todoのタイトル"
              className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-violet-400 focus:outline-none transition-colors"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              説明
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="詳細な説明（任意）"
              rows={3}
              className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-violet-400 focus:outline-none transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              日付
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-violet-400 focus:outline-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                開始時刻
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-violet-400 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                終了時刻
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-violet-400 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              優先度
            </label>
            <div className="flex gap-2">
              {priorityOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPriority(option.value)}
                  className={`
                    pop-button flex-1 py-2 rounded-xl font-medium transition-all
                    ${
                      priority === option.value
                        ? `${option.color} text-white pop-shadow-sm`
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-6">
            <button
              type="submit"
              disabled={!title.trim()}
              className="pop-button flex-1 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              追加
            </button>
            <button
              type="button"
              onClick={onClose}
              className="pop-button flex-1 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200"
            >
              キャンセル
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
