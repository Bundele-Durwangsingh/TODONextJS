import axios from 'axios';

interface Todo {
  id: string | number;
  title: string;
  status: boolean;
  createdAt?: Date | string;
}

interface TodoUpdateData {
  title?: string;
  status?: boolean;
}

// Create axios instance pointing to our local API proxy instead of the direct API
const api = axios.create({
  // Use relative URL to the Next.js API routes (not the external API)
  baseURL: '/api'
});

export const getAllTodosService = (
  status?: boolean,
  title?: string,
  limit: number = 1000
) => {
  let query = '';
  
  if (status !== undefined) {
    query += `status=${status}&`;
  }
  
  if (title) {
    query += `title=${title}&`;
  }
  
  if (limit) {
    query += `limit=${limit}`;
  }
  
  query = query.endsWith('&') ? query.slice(0, -1) : query;
  
  return api.get<Todo[]>(`/todo${query ? '?' + query : ''}`);
};

export const createTodoService = (title: string, status: boolean = false) => {
  return api.post<{ message: string; todo: Todo }>('/todo', {
    title: title,
    status: status
  });
};

export const updateTodoService = (id: string | number, data: TodoUpdateData) => {
  return api.put<{ message: string; todo: Todo }>(`/todo/${id}`, data);
};

export const deleteTodoService = (id: string | number) => {
  return api.delete<{ message: string }>(`/todo/${id}`);
};

export const getTodoByIdService = (id: string | number) => {
  return api.get<Todo>(`/todo/${id}`);
};

export default api;