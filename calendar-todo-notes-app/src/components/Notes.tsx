import { useState } from 'react';
import { useApp } from '../store';
import type { Note } from '../types';

export function Notes() {
  const { notes, addNote, updateNote, deleteNote } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
  });
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddNote = () => {
    if (!newNote.title.trim() && !newNote.content.trim()) return;

    addNote({
      title: newNote.title.trim() || '無題のメモ',
      content: newNote.content.trim(),
      todoId: null,
    });

    setNewNote({ title: '', content: '' });
    setIsAdding(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">メモ帳</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="pop-button px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl font-medium pop-shadow-sm"
        >
          + 新規メモ
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="🔍 メモを検索..."
          className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-pink-400 focus:outline-none bg-white"
        />
      </div>

      {isAdding && (
        <div className="bg-white rounded-2xl pop-shadow p-4 mb-4">
          <div className="space-y-3">
            <input
              type="text"
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              placeholder="タイトル"
              className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-pink-400 focus:outline-none"
              autoFocus
            />
            <textarea
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              placeholder="メモの内容を入力..."
              rows={5}
              className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-pink-400 focus:outline-none resize-none"
            />
            <div className="flex gap-2 pt-4">
              <button
                onClick={handleAddNote}
                disabled={!newNote.title.trim() && !newNote.content.trim()}
                className="pop-button px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl font-medium disabled:opacity-50"
              >
                保存
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setNewNote({ title: '', content: '' });
                }}
                className="pop-button px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-6xl mb-4">📝</p>
            <p className="text-gray-500">
              {searchQuery ? '検索結果がありません' : 'メモがありません'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onUpdate={updateNote}
                onDelete={deleteNote}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 text-center text-sm text-gray-500">{notes.length} 件のメモ</div>
    </div>
  );
}

function NoteCard({
  note,
  onUpdate,
  onDelete,
}: {
  note: Note;
  onUpdate: (id: string, updates: Partial<Note>) => void;
  onDelete: (id: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: note.title,
    content: note.content,
  });

  const handleSave = () => {
    onUpdate(note.id, editData);
    setIsEditing(false);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  const colors = [
    'from-pink-100 to-rose-100',
    'from-violet-100 to-purple-100',
    'from-cyan-100 to-teal-100',
    'from-amber-100 to-orange-100',
    'from-lime-100 to-green-100',
  ];
  const colorIndex = note.id.charCodeAt(0) % colors.length;

  if (isEditing) {
    return (
      <div className="bg-white rounded-2xl pop-shadow p-4 space-y-3">
        <input
          type="text"
          value={editData.title}
          onChange={(e) => setEditData({ ...editData, title: e.target.value })}
          placeholder="タイトル"
          className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-pink-400 focus:outline-none"
        />
        <textarea
          value={editData.content}
          onChange={(e) => setEditData({ ...editData, content: e.target.value })}
          rows={5}
          className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-pink-400 focus:outline-none resize-none"
        />
        <div className="flex gap-2 pt-4">
          <button
            onClick={handleSave}
            className="pop-button px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl font-medium"
          >
            保存
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="pop-button px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium"
          >
            キャンセル
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-gradient-to-br ${colors[colorIndex]} rounded-2xl pop-shadow-sm p-4 transition-all hover:pop-shadow`}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-bold text-gray-800">{note.title}</h3>
        <div className="flex gap-1">
          <button
            onClick={() => setIsEditing(true)}
            className="pop-button p-1 text-gray-400 hover:text-pink-500"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="pop-button p-1 text-gray-400 hover:text-red-500"
          >
            🗑️
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-600 whitespace-pre-wrap line-clamp-4">{note.content}</p>

      <p className="text-xs text-gray-400 mt-3">更新: {formatDate(note.updatedAt)}</p>
    </div>
  );
}
