
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const LISTS_URL = `${API_BASE_URL}/lists`;

async function handle(res) {
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }
  // 204 No Content (e.g. DELETE) has no body to parse.
  return res.status === 204 ? null : res.json();
}

export function getTodoLists() {
  return fetch(LISTS_URL).then(handle);
}

export function createTodoList(name) {
  return fetch(LISTS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  }).then(handle);
}

export function updateTodoList(id, name) {
  return fetch(`${LISTS_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  }).then(handle);
}

export function deleteTodoList(id) {
  return fetch(`${LISTS_URL}/${id}`, { method: 'DELETE' }).then(handle);
}

function todosUrl(listId) {
  return `${LISTS_URL}/${listId}/todos`;
}

export function getTodos(listId) {
  return fetch(todosUrl(listId)).then(handle);
}

export function createTodo(listId, { title, isComplete = false }) {
  return fetch(todosUrl(listId), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, isComplete }),
  }).then(handle);
}

export function updateTodo(listId, id, { title, isComplete, dueDate }) {
  return fetch(`${todosUrl(listId)}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, isComplete, dueDate }),
  }).then(handle);
}

export function deleteTodo(listId, id) {
  return fetch(`${todosUrl(listId)}/${id}`, { method: 'DELETE' }).then(handle);
}
