import { Todo } from '../types/Todo';

export const USER_ID = 1; // ⚠️ заміни на свій userId

const API_URL = 'https://mate.academy/students-api/todos';

export const getTodos = async (): Promise<Todo[]> => {
  const response = await fetch(`${API_URL}?userId=${USER_ID}`);

  if (!response.ok) {
    throw new Error('Unable to load todos');
  }

  return response.json();
};

export const createTodo = async (todo: Omit<Todo, 'id'>): Promise<Todo> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todo),
  });

  if (!response.ok) {
    throw new Error('Unable to add a todo');
  }

  return response.json();
};

export const deleteTodo = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Unable to delete a todo');
  }
};

export const updateTodo = async (
  id: number,
  data: Partial<Todo>,
): Promise<Todo> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Unable to update a todo');
  }

  return response.json();
};
