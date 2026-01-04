import { useState } from 'react';
import { useApp } from '../store';
import type { Priority, Todo } from '../types';

function formatDateForInput(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

const priorityConfig: Record<Priority, { label: string; bgColor: string; textColor: string; borderColor: string }> = {
  high: { label: '高', bgColor: 'bg-red-50', textColor: 'text-red-700', borderColor: 'border-red-400' },
  medium: { label: '中', bgColor: 'bg-yellow-50', textColor: 'text-yellow-700', borderColor: 'border-yellow-400' },
  low: { label: '低', bgColor: 'bg-green-50', textColor: 'text-green-700', borderColor: 'border-green-400' },
};

const priorityBadgeColors: Record<Priority, string> = {
  high: 'bg-red-500',
  medium: 'bg-yellow-500',
  low: 'bg-green-500',
};

type FilterType = 'all' | 'active' | 'completed';
type SortType = 'date' | 'priority';

export function TodoList() {
  const { todos, addTodo, updateTodo, deleteTodo } = useApp();
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('date');
  const [isAdding, setIsAdding] = useState(false);
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    dueDate: formatDateForInput(new Date()),
    startTime: '09:00',
    endTime: '10:00',
    priority: 'medium' as Priority,
  });

  const filteredTodos = todos
    .filter((todo) => {
      if (filter === 'active') return !todo.completed;
      if (filter === 'completed') return todo.completed;
      return true;
    })
    .sort((a, b) => {
      if (sort === 'priority') {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return new Date(a.dueDate + ' ' + a.startTime).getTime() - new Date(b.dueDate + ' ' + b.startTime).getTime();
    });

  const handleAddTodo = () => {
    if (!newTodo.title.trim()) return;

    addTodo({
      ...newTodo,
      title: newTodo.title.trim(),
      description: newTodo.description.trim(),
      completed: false,
    });

    setNewTodo({
      title: '',
      description: '',
      dueDate: formatDateForInput(new Date()),
      startTime: '09:00',
      endTime: '10:00',
      priority: 'medium',
    });
    setIsAdding(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Todo リスト</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="pop-button px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-xl font-medium pop-shadow-sm"
        >
          + 新規追加
        </button>
      </div>

      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex gap-1 bg-white rounded-xl p-1 pop-shadow-sm">
          {(['all', 'active', 'completed'] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`pop-button px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                filter === f ? 'bg-cyan-500 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {f === 'all' ? 'すべて' : f === 'active' ? '未完了' : '完了'}
            </button>
          ))}
        </div>

        <div className="flex gap-1 bg-white rounded-xl p-1 pop-shadow-sm">
          {(['date', 'priority'] as SortType[]).map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={`pop-button px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                sort === s ? 'bg-teal-500 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {s === 'date' ? '日付順' : '優先度順'}
            </button>
          ))}
        </div>
      </div>

      {isAdding && (
        <div className="bg-white rounded-2xl pop-shadow p-4 mb-4">
          <div className="space-y-3">
            <input
              type="text"
              value={newTodo.title}
              onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
              placeholder="タイトル"
              className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-cyan-400 focus:outline-none"
              autoFocus
            />
            <textarea
              value={newTodo.description}
              onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
              placeholder="説明（任意）"
              rows={2}
              className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-cyan-400 focus:outline-none resize-none"
            />
            <div className="flex flex-wrap gap-3 items-center">
              <input
                type="date"
                value={newTodo.dueDate}
                onChange={(e) => setNewTodo({ ...newTodo, dueDate: e.target.value })}
                className="px-3 py-2 rounded-xl border-2 border-gray-200 focus:border-cyan-400 focus:outline-none"
              />
              <div className="flex items-center gap-1">
                <input
                  type="time"
                  value={newTodo.startTime}
                  onChange={(e) => setNewTodo({ ...newTodo, startTime: e.target.value })}
                  className="px-3 py-2 rounded-xl border-2 border-gray-200 focus:border-cyan-400 focus:outline-none"
                />
                <span className="text-gray-500">〜</span>
                <input
                  type="time"
                  value={newTodo.endTime}
                  onChange={(e) => setNewTodo({ ...newTodo, endTime: e.target.value })}
                  className="px-3 py-2 rounded-xl border-2 border-gray-200 focus:border-cyan-400 focus:outline-none"
                />
              </div>
              <div className="flex gap-1">
                {(['high', 'medium', 'low'] as Priority[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setNewTodo({ ...newTodo, priority: p })}
                    className={`pop-button px-3 py-1 rounded-lg text-sm font-medium ${
                      newTodo.priority === p
                        ? `${priorityBadgeColors[p]} text-white`
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {priorityConfig[p].label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsAdding(false)}
                className="pop-button px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium"
              >
                キャンセル
              </button>
              <button
                onClick={handleAddTodo}
                disabled={!newTodo.title.trim()}
                className="pop-button px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-xl font-medium disabled:opacity-50"
              >
                追加
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto space-y-3">
        {filteredTodos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-6xl mb-4">📋</p>
            <p className="text-gray-500">Todoがありません</p>
          </div>
        ) : (
          filteredTodos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} onUpdate={updateTodo} onDelete={deleteTodo} />
          ))
        )}
      </div>

      <div className="mt-4 text-center text-sm text-gray-500">
        {todos.filter((t) => !t.completed).length} 件の未完了タスク
      </div>
    </div>
  );
}

function TodoItem({
  todo,
  onUpdate,
  onDelete,
}: {
  todo: Todo;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
  onDelete: (id: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: todo.title,
    description: todo.description,
    dueDate: todo.dueDate,
    startTime: todo.startTime,
    endTime: todo.endTime,
    priority: todo.priority,
  });

  const config = priorityConfig[todo.priority];

  const handleSave = () => {
    onUpdate(todo.id, editData);
    setIsEditing(false);
  };

  const formatDisplayDate = (dateStr: string, startTime: string, endTime: string) => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}/${day} ${startTime}〜${endTime}`;
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-2xl pop-shadow p-4 space-y-3">
        <input
          type="text"
          value={editData.title}
          onChange={(e) => setEditData({ ...editData, title: e.target.value })}
          className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-cyan-400 focus:outline-none"
        />
        <textarea
          value={editData.description}
          onChange={(e) => setEditData({ ...editData, description: e.target.value })}
          rows={2}
          className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-cyan-400 focus:outline-none resize-none"
        />
        <div className="flex flex-wrap gap-3 items-center">
          <input
            type="date"
            value={editData.dueDate}
            onChange={(e) => setEditData({ ...editData, dueDate: e.target.value })}
            className="px-3 py-2 rounded-xl border-2 border-gray-200 focus:border-cyan-400 focus:outline-none"
          />
          <div className="flex items-center gap-1">
            <input
              type="time"
              value={editData.startTime}
              onChange={(e) => setEditData({ ...editData, startTime: e.target.value })}
              className="px-3 py-2 rounded-xl border-2 border-gray-200 focus:border-cyan-400 focus:outline-none"
            />
            <span className="text-gray-500">〜</span>
            <input
              type="time"
              value={editData.endTime}
              onChange={(e) => setEditData({ ...editData, endTime: e.target.value })}
              className="px-3 py-2 rounded-xl border-2 border-gray-200 focus:border-cyan-400 focus:outline-none"
            />
          </div>
          <div className="flex gap-1">
            {(['high', 'medium', 'low'] as Priority[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setEditData({ ...editData, priority: p })}
                className={`pop-button px-3 py-1 rounded-lg text-sm font-medium ${
                  editData.priority === p
                    ? `${priorityBadgeColors[p]} text-white`
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {priorityConfig[p].label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(false)}
            className="pop-button px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium"
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            className="pop-button px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-xl font-medium"
          >
            保存
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        bg-white rounded-2xl pop-shadow-sm p-4 border-l-4 transition-all
        ${config.borderColor}
        ${todo.completed ? 'opacity-60' : ''}
      `}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => onUpdate(todo.id, { completed: !todo.completed })}
          className={`
            pop-button w-6 h-6 rounded-full border-2 flex-shrink-0 mt-0.5
            transition-all flex items-center justify-center
            ${todo.completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 hover:border-green-400'}
          `}
        >
          {todo.completed && '✓'}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3
              className={`font-medium ${
                todo.completed ? 'line-through text-gray-400' : 'text-gray-800'
              }`}
            >
              {todo.title}
            </h3>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}
            >
              {config.label}
            </span>
          </div>
          {todo.description && (
            <p className="text-sm text-gray-500 mt-1">{todo.description}</p>
          )}
          <p className="text-xs text-gray-400 mt-2">
            📅 {formatDisplayDate(todo.dueDate, todo.startTime, todo.endTime)}
          </p>
        </div>

        <div className="flex gap-1">
          <button
            onClick={() => setIsEditing(true)}
            className="pop-button p-2 text-gray-400 hover:text-cyan-500 hover:bg-cyan-50 rounded-lg"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="pop-button p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
