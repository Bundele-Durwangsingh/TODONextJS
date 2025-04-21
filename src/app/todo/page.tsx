"use client";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import LogoutIcon from "@mui/icons-material/Logout";
import CircularProgress from "@mui/material/CircularProgress";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import { createTodoService, getAllTodosService, updateTodoService, authService } from "@/services/api";
import { useRouter } from "next/navigation";
import axios from "axios";

interface Todo {
  id: string | number;
  title: string;
  status: boolean;
  createdAt?: Date | string;
}

export default function Todo() {
  const [tasks, setTasks] = useState<Todo[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fetch tasks on component mount
  useEffect(() => {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      toast.error("Please login to continue");
      router.push("/signIn");
      return;
    }
    
    fetchTasks();
  }, [router]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      console.log('Fetching tasks...');
      // Only get incomplete tasks (status=false)
      const response = await getAllTodosService(false);
      
      // Get the tasks array from the response
      const tasksData = response.data;
      
      console.log('Tasks data:', tasksData);
      setTasks(Array.isArray(tasksData) ? tasksData : []);
      
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks");
      // If unauthorized, redirect to login
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        authService.logout();
        router.push("/signIn");
      }
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (title: string) => {
    if (!title.trim()) return;
    
    try {
      const response = await createTodoService(title);
      console.log("Create todo response:", response);
      
      // Extract the new todo from the response
      const newTodo = response.data.todo;
      
      setTasks(prevTasks => [...prevTasks, newTodo]);
      toast.success("Task successfully added");
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("Failed to add task");
    }
  };

  const editTask = async (id: number | string, newTitle: string) => {
    try {
      // Update the task title
      const response = await updateTodoService(id, { title: newTitle });
      
      // Update the UI with the returned updated todo
      const updatedTodo = response.data.todo;
      
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === id ? updatedTodo : task
        )
      );
      toast.success("Task updated successfully");
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
    }
  };

  const deleteTask = async (id: number | string) => {
    try {
      // Mark as completed (status=true) rather than deleting
      await updateTodoService(id, { status: true });
      
      // Remove from UI
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
      toast.info("Task marked as completed");
    } catch (error) {
      console.error("Error marking task as completed:", error);
      toast.error("Failed to complete task");
    }
  };

  const clearAllTasks = async () => {
    try {
      if (tasks.length === 0) return;
      
      // Mark all tasks as completed (status: true)
      const updatePromises = tasks.map(task => 
        updateTodoService(task.id, { status: true })
      );
      await Promise.all(updatePromises);
      
      setTasks([]);
      toast.info("All tasks marked as completed");
    } catch (error) {
      console.error("Error clearing tasks:", error);
      toast.error("Failed to clear tasks");
    }
  };

  // Handle logout functionality
  const handleLogout = () => {
    try {
      // Clear authentication tokens
      authService.logout();
      
      // Show success message
      toast.success("Logged out successfully");
      
      // Redirect to login page
      setTimeout(() => {
        router.push("/signIn");
      }, 1000);
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Logout failed");
    }
  };

  // Filter tasks based on search query
  const filteredTasks = tasks.filter(todo => 
    todo.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Paper elevation={3} className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Todo App</h1>
        <Button
          variant="outlined"
          color="primary"
          size="small"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            '&:hover': {
              backgroundColor: 'primary.main',
              color: 'white',
            },
          }}
        >
          Logout
        </Button>
      </div>

      <TaskForm addTask={addTask} />

      <div className="search-container">
        <TextField
          fullWidth
          id="search-tasks"
          name="searchTask"
          label="Search tasks"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </div>

      <Divider sx={{ my: 3 }} />

      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <CircularProgress size={40} />
          <p>Loading tasks...</p>
        </div>
      ) : (
        <TaskList 
          tasks={filteredTasks} 
          deleteTask={deleteTask}
          editTask={editTask}
        />
      )}

      {tasks.length > 0 && (
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteSweepIcon />}
          onClick={clearAllTasks}
          sx={{
            mt: 2,
            '&:hover': {
              backgroundColor: 'error.main',
              color: 'white',
            },
          }}
        >
          Clear All
        </Button>
      )}
      
      <ToastContainer 
        position="top-right" 
        autoClose={2000} 
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Paper>
  );
}