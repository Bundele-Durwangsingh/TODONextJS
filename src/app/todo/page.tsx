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

  // Use `useEffect` to handle redirection and layout fix after loading
  useEffect(() => {
    if (!loading && !user) {
      router.push("/signIn");
    }
  }, [user, loading, router]);

  const [tasks, setTasks] = useState<TodoVar[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Use another `useEffect` to trigger layout refresh after the user signs in
  useEffect(() => {
    if (!loading && user) {
      // Force a layout reflow to fix any layout issues when signing in
      document.body.style.display = 'none'; // Temporarily hide the body
      document.body.offsetHeight; // Trigger a reflow
      document.body.style.display = ''; // Show the body again
    }
  }, [user, loading]);

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
      <button className="logOut" onClick={() => signOut(auth)}>Log Out</button>
    </div>
  );
}
