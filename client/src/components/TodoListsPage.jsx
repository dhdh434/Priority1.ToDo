import { useState } from 'react';

export default function TodoListsPage({ lists, error, onOpen, onCreate, onRename, onDelete }) {
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [editingListId, setEditingListId] = useState(null);
  const [editName, setEditName] = useState('');

  async function submitNewList(event) {
    event.preventDefault();
    const name = newName.trim();
    if (name && await onCreate(name)) {
      setNewName('');
      setCreating(false);
    }
  }

  async function submitRename(event, listId) {
    event.preventDefault();
    const name = editName.trim();
    if (name && await onRename(listId, name)) {
      setEditingListId(null);
    }
  }

  return (
    <main className="app">
      <div className="lists-page-header">
        <h1>ToDo Lists</h1>
        <button type="button" className="primary" onClick={() => setCreating(true)}>
          Create list
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {creating && (
        <form className="list-name-form" onSubmit={submitNewList}>
          <input
            autoFocus
            type="text"
            maxLength={100}
            aria-label="New list name"
            placeholder="List name"
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
          />
          <button type="submit" className="primary">Save</button>
          <button type="button" onClick={() => setCreating(false)}>Cancel</button>
        </form>
      )}

      {lists.length === 0 ? (
        <p className="muted">No lists yet. Create one to get started.</p>
      ) : (
        <div className="todo-lists-grid">
          {lists.map((list) => (
            <article className="todo-list-card" key={list.id}>
              {editingListId === list.id ? (
                <form className="list-name-form" onSubmit={(event) => submitRename(event, list.id)}>
                  <input
                    autoFocus
                    type="text"
                    maxLength={100}
                    aria-label="List name"
                    value={editName}
                    onChange={(event) => setEditName(event.target.value)}
                  />
                  <button type="submit" className="primary">Save</button>
                  <button type="button" onClick={() => setEditingListId(null)}>Cancel</button>
                </form>
              ) : (
                <>
                  <button
                    type="button"
                    className="todo-list-card-open"
                    onClick={() => onOpen(list.id)}
                  >
                    <span className="todo-list-card-name">{list.name}</span>
                  </button>
                  <div className="todo-list-card-actions">
                    <button
                      type="button"
                      onClick={() => {
                        setEditName(list.name);
                        setEditingListId(list.id);
                      }}
                    >
                      Rename
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Deleting this list also deletes all of its todos. Continue?')) {
                          onDelete(list.id);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
