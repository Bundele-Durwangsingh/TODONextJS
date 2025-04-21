"use client";
import { useState } from "react";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import EditTaskModal from "./EditTaskModal";

interface Todo {
  id: string | number;
  title: string;
  status: boolean;

}

interface TaskListProps {
  tasks: Todo[];
  deleteTask: (id: number | string) => void;
  editTask: (id: number | string, newTitle: string) => void;
}

export default function TaskList({ tasks, deleteTask, editTask }: TaskListProps) {
  const tasksList = Array.isArray(tasks) ? tasks : [];
  
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Todo | null>(null);

  const handleOpenEditModal = (task: Todo) => {
    setCurrentTask(task);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
  };

  const handleEditTask = (id: string | number, newTitle: string) => {
    editTask(id, newTitle);
  };

  
  return (
    <div className="task-list">
      {tasksList.length > 0 ? (
        tasksList.map((todo) => (
          <Paper 
            key={todo.id} 
            elevation={1} 
            className="task"
            sx={{ mb: 2 }}
          >
            <ListItem sx={{ p: 0 }}>
              <ListItemText 
                primary={todo.title} 
                primaryTypographyProps={{
                  fontWeight: 500,
                }}
              />
            </ListItem>
            <div className="task-actions">
              <Tooltip title="Edit task">
                <IconButton 
                  aria-label="edit" 
                  size="medium" 
                  onClick={() => handleOpenEditModal(todo)}
                  color="primary"
                  sx={{
                    marginRight: 1,
                    '&:hover': {
                      backgroundColor: 'primary.light',
                      color: 'white', 
                    },
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Complete task">
                <IconButton 
                  aria-label="delete" 
                  size="medium" 
                  onClick={() => deleteTask(todo.id)}
                  color="error"
                  sx={{
                    '&:hover': {
                      backgroundColor: 'error.light',
                      color: 'white', 
                    },
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </div>
          </Paper>
        ))
      ) : (
        <div className="empty-state">
          <p>No tasks found.</p>
          <p className="empty-state-message">Add your first task above!</p>
        </div>
      )}
      {tasksList.length > 0 && (
        <p className="pending-tasks">You have {tasksList.length} pending task{tasksList.length !== 1 ? 's' : ''}</p>
      )}
      
      {currentTask && (
        <EditTaskModal
          open={editModalOpen}
          onClose={handleCloseEditModal}
          task={currentTask}
          onEdit={handleEditTask}
        />
      )}
    </div>
  );
}