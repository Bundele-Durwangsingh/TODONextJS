"use client"

import { useEffect, useState } from "react";

interface TodoVar {
  task: string;
  id: number;
}

export default function Home() {
  const [task, setTask] = useState<TodoVar[]>([]);
  const [newTask, setNewTask] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const getTask = () => {
    let temp = localStorage.getItem("task");
    if (temp) {
      setTask(JSON.parse(temp));
    } else {
      setTask([]);
    }
  };

  useEffect(() => {
    getTask();
  }, []);

  const createTask = () => {
    if (!newTask.trim()) return;

    let todoTask = localStorage.getItem("task");
    let newTaskObj = {
      id: Date.now(),
      task: newTask,
    };
    
    let updatedTasks = todoTask ? JSON.parse(todoTask) : [];
    updatedTasks.push(newTaskObj);
    localStorage.setItem("task", JSON.stringify(updatedTasks));
    setNewTask("");
    getTask();
  };

  const deleteTask = (id: number) => {
    let updatedTasks = task.filter(todo => todo.id !== id);
    localStorage.setItem("task", JSON.stringify(updatedTasks));
    setTask(updatedTasks);
  };

  const filteredTasks = task.filter(todo =>
    todo.task.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container">
      <h1>Todo App</h1>
    
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter your task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button className="add-btn" onClick={createTask}>+</button>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <hr/>
      <div className="task-list">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((todo) => (
            <div key={todo.id} className="task">
              <h2>{todo.task}</h2>
              <button className="delete-btn" onClick={() => deleteTask(todo.id)}>🗑</button>
            </div>
          ))
        ) : (
          <></>
        )}
      </div>

      {task.length > 0 && <p className="pending-tasks">You have {task.length} pending tasks</p>}

      <button className="clear-all" onClick={() => { localStorage.removeItem("task"); setTask([]); }}>Clear All</button>
    </div>
  );
}
