import axios from 'axios';

interface Todo {
  id: string | number;
  title: string;
  status: boolean;
  userId?: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

interface TodoUpdateData {
  title?: string;
  status?: boolean;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  message: string;
  token: string;
}

interface UserProfile {
  message: string;
  user: {
    uid: string | number;
    email: string;
  };
}

const api = axios.create({
  baseURL: 'https://todo-list-r2os.onrender.com'
});

// Add request interceptor to attach auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Helper to handle authentication
export const authService = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    localStorage.setItem('token', response.data.token);
    return response.data;
  },
  
  signup: async (credentials: LoginCredentials) => {
    const response = await api.post<AuthResponse>('/auth/signup', credentials);
    localStorage.setItem('token', response.data.token);
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
  },
  
  getProfile: () => {
    return api.get<UserProfile>('/auth/profile');
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export const getAllTodosService = (statusFilter?: boolean) => {
  const queryParams = new URLSearchParams();
  
  if (statusFilter !== undefined) {
    queryParams.append('status', String(statusFilter));
  }
  
  const queryString = queryParams.toString();
  return api.get<Todo[]>(`/todo${queryString ? '?' + queryString : ''}`);
};

export const createTodoService = (title: string, status: boolean = false) => {
  return api.post<{ message: string; todo: Todo }>('/todo', {
    title,
    status
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