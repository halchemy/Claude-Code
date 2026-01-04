import type { Todo, Priority } from '../types';

interface DateTodoPopupProps {
  date: Date;
  todos: Todo[];
  onClose: () => void;
  onAddTodo: () => void;
}

const priorityConfig: Record<Priority, { label: string; bgColor: string; textColor: string }> = {
  high: { label: '高', bgColor: 'bg-red-50', textColor: 'text-red-700' },
  medium: { label: '中', bgColor: 'bg-yellow-50', textColor: 'text-yellow-700' },
  low: { label: '低', bgColor: 'bg-green-50', textColor: 'text-green-700' },
};

export function DateTodoPopup({ date, todos, onClose, onAddTodo }: DateTodoPopupProps) {
  const formatDate = (d: Date) => {
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl pop-shadow w-full max-w-md mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-violet-500 to-purple-600 p-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">{formatDate(date)}</h3>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="p-4 max-h-[60vh] overflow-auto">
          {todos.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-4xl mb-2">📋</p>
              <p className="text-gray-500">この日のTodoはありません</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todos.map((todo) => {
                const config = priorityConfig[todo.priority];
                return (
                  <div
                    key={todo.id}
                    className={`p-3 rounded-xl border-l-4 ${
                      todo.priority === 'high' ? 'border-red-400' :
                      todo.priority === 'medium' ? 'border-yellow-400' : 'border-green-400'
                    } bg-gray-50 ${todo.completed ? 'opacity-60' : ''}`}
                  >
                    <div className="flex items-start gap-2">
                      <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${
                        todo.completed ? 'bg-green-500 border-green-500 text-white text-xs' : 'border-gray-300'
                      }`}>
                        {todo.completed && '✓'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-medium ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                          {todo.title}
                        </h4>
                        {todo.description && (
                          <p className="text-sm text-gray-500 mt-1">{todo.description}</p>
                        )}
                        <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-500">
                          <span>🕐 {todo.startTime}〜{todo.endTime}</span>
                          <span className={`px-2 py-0.5 rounded-full ${config.bgColor} ${config.textColor}`}>
                            {config.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={onAddTodo}
            className="pop-button w-full py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-medium"
          >
            + この日にTodoを追加
          </button>
        </div>
      </div>
    </div>
  );
}
