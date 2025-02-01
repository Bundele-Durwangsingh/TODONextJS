"use client";

import { useEffect, useState } from "react";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";

interface TodoVar {
  task: string;
  id: number;
}

export default function Todo() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signIn");
      return; 
    }
  }, [user, loading, router]);

  const [tasks, setTasks] = useState<TodoVar[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      try {
        setTasks(JSON.parse(storedTasks));
      } catch (err) {
        console.error("Error parsing tasks:", err);
        localStorage.removeItem("tasks");
      }
    }
  }, []);

  const addTask = (task: string) => {
    if (!task.trim()) return;
    const newTaskObj = { id: Date.now(), task };
    const updatedTasks = [...tasks, newTaskObj];
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
  };

  const deleteTask = (id: number) => {
    const updatedTasks = tasks.filter(todo => todo.id !== id);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
  };

  const clearAllTasks = () => {
    localStorage.removeItem("tasks");
    setTasks([]);
  };

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/signIn");
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
      <button className="logOut" onClick={handleSignOut}>Log Out</button>
    </div>
  );
}
