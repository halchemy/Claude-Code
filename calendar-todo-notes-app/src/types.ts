export type Priority = 'high' | 'medium' | 'low';

export interface Todo {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
  priority: Priority;
  completed: boolean;
  createdAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  todoId: string | null;
  createdAt: string;
  updatedAt: string;
}

export type MenuType = 'calendar' | 'todo' | 'notes';
