import TodoItem from './TodoItem';

export default function TodoList({ todos, onToggle, onRename, onDelete, onSetDueDate }) {
  if (todos.length === 0) {
    return <p className="muted">No todos yet. Add one above.</p>;
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onRename={onRename}
          onDelete={onDelete}
          onSetDueDate={onSetDueDate}
        />
      ))}
    </ul>
  );
}
