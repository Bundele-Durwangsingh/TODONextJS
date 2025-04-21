"use client";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from "@mui/icons-material/Delete";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

interface Todo {
  id: string | number;
  title: string;
  status: boolean;
  createdAt?: Date | string;
}

interface TaskListProps {
  tasks: Todo[];
  deleteTask: (id: number | string) => void;
}

export default function TaskList({ tasks, deleteTask }: TaskListProps) {
  return (
    <div className="task-list">
      {tasks.length > 0 ? (
        tasks.map((todo) => (
          <div key={todo.id} className="task">
            <ListItem>
              <ListItemText 
                primary={todo.title} 
              />
            </ListItem>
            <IconButton 
              aria-label="delete" 
              size="large" 
              onClick={() => deleteTask(todo.id)}
              color="error"
              sx={{
                '&:hover': {
                  backgroundColor: 'error.main',
                  color: 'white', 
                },
              }}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        ))
      ) : (
        <p>No tasks found.</p>
      )}
      {tasks.length > 0 && <p className="pending-tasks">You have {tasks.length} pending tasks</p>}
    </div>
  );
}