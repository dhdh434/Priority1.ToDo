import { useState } from 'react';

export default function TodoItem({ todo, onToggle, onRename, onDelete, onSetDueDate }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.title);
  const [editingDueDate, setEditingDueDate] = useState(false);
  const [dueDateDraft, setDueDateDraft] = useState(todo.dueDate?.slice(0, 10) ?? '');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDate = todo.dueDate
    ? new Date(todo.dueDate.includes('T') ? todo.dueDate : `${todo.dueDate}T00:00:00`)
    : null;
  const overdue = dueDate && !todo.isComplete && dueDate < today;

  function saveEdit() {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== todo.title) {
      onRename(todo, trimmed);
    } else {
      setDraft(todo.title);
    }
    setEditing(false);
  }

  return (
    <li className={`todo-item ${overdue ? 'overdue' : ''}`}>
      <input
        type="checkbox"
        checked={todo.isComplete}
        onChange={() => onToggle(todo)}
        title="Mark complete / incomplete"
      />

      {editing ? (
        <input
          className="edit-title"
          value={draft}
          autoFocus
          onChange={(e) => setDraft(e.target.value)}
          onBlur={saveEdit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') saveEdit();
            if (e.key === 'Escape') {
              setDraft(todo.title);
              setEditing(false);
            }
          }}
        />
      ) : (
        <span
          className={`title ${todo.isComplete ? 'complete' : ''}`}
          onDoubleClick={() => setEditing(true)}
          title="Double-click to edit"
        >
          {todo.title}
        </span>
      )}

      {overdue && <span className="overdue-badge">Overdue</span>}
      {dueDate && (
        <span className="due-date">
          Due {dueDate.toLocaleDateString()}
        </span>
      )}

      {editingDueDate ? (
        <div className="due-date-editor">
          <input
            type="date"
            aria-label="Due date"
            value={dueDateDraft}
            onChange={(e) => setDueDateDraft(e.target.value)}
          />
          <button
            type="button"
            onClick={() => {
              onSetDueDate(todo, dueDateDraft || null);
              setEditingDueDate(false);
            }}
          >
            Save
          </button>
          <button type="button" onClick={() => setEditingDueDate(false)}>
            Cancel
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => {
            setDueDateDraft(todo.dueDate?.slice(0, 10) ?? '');
            setEditingDueDate(true);
          }}
        >
          {todo.dueDate ? 'Change due date' : 'Add due date'}
        </button>
      )}

      {!editing && (
        <button onClick={() => setEditing(true)}>Edit</button>
      )}
      <button onClick={() => onDelete(todo)}>Delete</button>
    </li>
  );
}
