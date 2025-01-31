"use client";

interface TodoVar {
  task: string;
  id: number;
}

interface TaskListProps {
  tasks: TodoVar[];
  deleteTask: (id: number) => void;
}

export default function TaskList({ tasks, deleteTask }: TaskListProps) {
  return (
    <div className="task-list">
      {tasks.length > 0 ? (
        tasks.map((todo) => (
          <div key={todo.id} className="task">
            <h2>{todo.task}</h2>
            <button className="delete-btn" onClick={() => deleteTask(todo.id)}>
              🗑
            </button>
          </div>
        ))
      ) : (
        <p>No tasks found.</p>
      )}
      {tasks.length > 0 && <p className="pending-tasks">You have {tasks.length} pending tasks</p>}
    </div>
  );
}
