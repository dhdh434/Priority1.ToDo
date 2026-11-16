import { useEffect, useState } from 'react';
import { createTodo, deleteTodo, getTodos, updateTodo } from '../api';
import AddTodoForm from './AddTodoForm';
import TodoList from './TodoList';

export default function TodoListPage({ list, onBack }) {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('dueDate');

  const sortedTodos = [...todos].sort((a, b) => {
    const dateA = sortBy === 'dueDate' ? a.dueDate : a.createDate;
    const dateB = sortBy === 'dueDate' ? b.dueDate : b.createDate;

    if (sortBy === 'dueDate') {
      if (!dateA) return dateB ? 1 : 0;
      if (!dateB) return -1;
    }

    return new Date(dateA).getTime() - new Date(dateB).getTime();
  });

  useEffect(() => {
    getTodos(list.id)
      .then(setTodos)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [list.id]);

  async function handleAdd(title) {
    try {
      const created = await createTodo(list.id, { title });
      setTodos((prev) => [...prev, created]);
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleToggle(todo) {
    try {
      const updated = await updateTodo(list.id, todo.id, {
        title: todo.title,
        isComplete: !todo.isComplete,
        dueDate: todo.dueDate,
      });
      setTodos((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleRename(todo, title) {
    try {
      const updated = await updateTodo(list.id, todo.id, {
        title,
        isComplete: todo.isComplete,
        dueDate: todo.dueDate,
      });
      setTodos((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleSetDueDate(todo, dueDate) {
    try {
      const updated = await updateTodo(list.id, todo.id, {
        title: todo.title,
        isComplete: todo.isComplete,
        dueDate,
      });
      setTodos((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleDelete(todo) {
    try {
      await deleteTodo(list.id, todo.id);
      setTodos((prev) => prev.filter((item) => item.id !== todo.id));
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <main className="app">
      <button type="button" className="back-button" onClick={onBack}>
        All lists
      </button>
      <h1>{list.name}</h1>

      {error && <div className="error">{error}</div>}

      <div className="sort-controls" role="radiogroup" aria-label="Sort todos by">
        <span>Sort by:</span>
        <label>
          <input
            type="radio"
            name="todo-sort"
            value="dueDate"
            checked={sortBy === 'dueDate'}
            onChange={() => setSortBy('dueDate')}
          />
          Due date
        </label>
        <label>
          <input
            type="radio"
            name="todo-sort"
            value="createDate"
            checked={sortBy === 'createDate'}
            onChange={() => setSortBy('createDate')}
          />
          Create date
        </label>
      </div>

      <AddTodoForm onAdd={handleAdd} />

      {loading ? (
        <p className="muted">Loading todos…</p>
      ) : (
        <TodoList
          todos={sortedTodos}
          onToggle={handleToggle}
          onRename={handleRename}
          onDelete={handleDelete}
          onSetDueDate={handleSetDueDate}
        />
      )}
    </main>
  );
}
