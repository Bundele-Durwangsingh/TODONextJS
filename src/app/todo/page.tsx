"use client";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import { createTodoService, getAllTodosService, updateTodoService } from "@/services/api";


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

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      // Only fetch tasks with status=false (active tasks)
      const response = await getAllTodosService(false);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (title: string) => {
    if (!title.trim()) return;
    
    try {
      const response = await createTodoService(title);
      setTasks([...tasks, response.data.todo]);
      toast.success("Task successfully added");
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("Failed to add task");
    }
  };

  // Instead of deleting, update status to false
  const deleteTask = async (id: number | string) => {
    try {
      // Update the task status to true (completed/hidden)
      await updateTodoService(id, { status: true });
      
      // Remove from UI
      setTasks(tasks.filter(task => task.id !== id));
      toast.info("Task marked as completed");
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
    }
  };

  const clearAllTasks = async () => {
    try {
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

  const filteredTasks = tasks.filter(todo =>
    todo.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container">
      <h1>Todo App</h1>

      <TaskForm addTask={addTask} />

      <div className="search-container">
        <TextField
          id="filled-suffix-shrink"
          name="searchTask"
          label="Search tasks"
          variant="filled"
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <hr />

      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <TaskList tasks={filteredTasks} deleteTask={deleteTask} />
      )}

      {tasks.length > 0 && (
        <Button
          variant="outlined"
          color="error"
          onClick={clearAllTasks}
          sx={{
            '&:hover': {
              backgroundColor: 'error.main',
              color: 'white',
            },
          }}
        >
          Clear All
        </Button>
      )}
      
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}