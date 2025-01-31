"use client";

import { useEffect, useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

interface TodoVar {
  task: string;
  id: number;
}

export default function Home() {
  const [tasks, setTasks] = useState<TodoVar[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const storedTasks = localStorage.getItem("task");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  const addTask = (task: string) => {
    const newTaskObj = { id: Date.now(), task };
    const updatedTasks = [...tasks, newTaskObj];
    localStorage.setItem("task", JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
  };

  const deleteTask = (id: number) => {
    const updatedTasks = tasks.filter(todo => todo.id !== id);
    localStorage.setItem("task", JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
  };

  const clearAllTasks = () => {
    localStorage.removeItem("task");
    setTasks([]);
  };

  const filteredTasks = tasks.filter(todo =>
    todo.task.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container">
      <h1>Todo App</h1>
      
      <TaskForm addTask={addTask} />

      <div className="search-container">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <hr />

      <TaskList tasks={filteredTasks} deleteTask={deleteTask} />

      {tasks.length > 0 && (
        <button className="clear-all" onClick={clearAllTasks}>
          Clear All
        </button>
      )}
    </div>
  );
}
