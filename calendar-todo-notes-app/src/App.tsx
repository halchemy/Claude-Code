import { AppProvider, useApp } from './store';
import { Sidebar } from './components/Sidebar';
import { Calendar } from './components/Calendar';
import { TodoList } from './components/TodoList';
import { Notes } from './components/Notes';

function MainContent() {
  const { activeMenu } = useApp();

  return (
    <main className="flex-1 p-6 overflow-auto">
      {activeMenu === 'calendar' && <Calendar />}
      {activeMenu === 'todo' && <TodoList />}
      {activeMenu === 'notes' && <Notes />}
    </main>
  );
}

function App() {
  return (
    <AppProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <MainContent />
      </div>
    </AppProvider>
  );
}

export default App;
