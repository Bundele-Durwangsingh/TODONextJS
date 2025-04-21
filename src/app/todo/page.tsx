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
import { createTodoService, getAllTodosService, updateTodoService } from "@/services/api";
import { useRouter } from "next/navigation";

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
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      console.log('Fetching tasks...');
      // Pass false to only get tasks with status=false (incomplete tasks)
      const response = await getAllTodosService(false);
      console.log('Response received:', response);
      
      const tasksData = response.data;
      
      console.log('Tasks data to be set:', tasksData);
      setTasks(Array.isArray(tasksData) ? tasksData : []);
      
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks");
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
      
      // Handle different possible response formats
      let newTodo: Todo;
      
      if (response.data && typeof response.data === 'object') {
        if ('todo' in response.data && response.data.todo) {
          // Case: { message: string, todo: Todo }
          newTodo = response.data.todo as Todo;
        } else if ('id' in response.data && 'title' in response.data && 'status' in response.data) {
          // Case: direct Todo object
          newTodo = response.data as Todo;
        } else {
          throw new Error("Unexpected response format");
        }
      } else {
        throw new Error("Invalid response data");
      }
      
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
      await updateTodoService(id, { title: newTitle });
      
      // Update the UI
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === id ? { ...task, title: newTitle } : task
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
      // Update the task status to true (completed/hidden)
      await updateTodoService(id, { status: true });
      
      // Remove from UI
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
      toast.info("Task marked as completed");
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
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
      // Clear authentication tokens from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      // Show success message
      toast.success("Logged out successfully");
      
      // Redirect to login page
      setTimeout(() => {
        router.push("/");
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