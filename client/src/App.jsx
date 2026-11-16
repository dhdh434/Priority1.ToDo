import { useEffect, useState } from 'react';
import {
  createTodoList,
  deleteTodoList,
  getTodoLists,
  updateTodoList,
} from './api';
import TodoListPage from './components/TodoListPage';
import TodoListsPage from './components/TodoListsPage';

function getListIdFromHash() {
  const match = window.location.hash.match(/^#\/lists\/(\d+)$/);
  return match ? Number(match[1]) : null;
}

export default function App() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedListId, setSelectedListId] = useState(getListIdFromHash);

  useEffect(() => {
    const syncRoute = () => setSelectedListId(getListIdFromHash());
    window.addEventListener('hashchange', syncRoute);
    return () => window.removeEventListener('hashchange', syncRoute);
  }, []);

  useEffect(() => {
    getTodoLists()
      .then(setLists)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const selectedList = lists.find((list) => list.id === selectedListId);

  useEffect(() => {
    if (!loading && selectedListId !== null && !selectedList) {
      window.location.hash = '/';
    }
  }, [loading, selectedList, selectedListId]);

  function openList(id) {
    window.location.hash = `/lists/${id}`;
  }

  function returnToLists() {
    window.location.hash = '/';
  }

  async function handleCreateList(name) {
    try {
      const created = await createTodoList(name);
      setLists((prev) => [...prev, created]);
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    }
  }

  async function handleRenameList(id, name) {
    try {
      const updated = await updateTodoList(id, name);
      setLists((prev) => prev.map((list) => (list.id === updated.id ? updated : list)));
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    }
  }

  async function handleDeleteList(id) {
    try {
      await deleteTodoList(id);
      setLists((prev) => prev.filter((list) => list.id !== id));
    } catch (e) {
      setError(e.message);
    }
  }

  if (loading) {
    return (
      <main className="app">
        <h1>Priority1 ToDo</h1>
        <p className="muted">Loading lists…</p>
      </main>
    );
  }

  if (selectedList) {
    return <TodoListPage key={selectedList.id} list={selectedList} onBack={returnToLists} />;
  }

  return (
    <TodoListsPage
      lists={lists}
      error={error}
      onOpen={openList}
      onCreate={handleCreateList}
      onRename={handleRenameList}
      onDelete={handleDeleteList}
    />
  );
}
