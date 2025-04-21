"use client";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import * as Yup from "yup";
import { useFormik } from "formik";

interface EditTaskModalProps {
  open: boolean;
  onClose: () => void;
  task: {
    id: string | number;
    title: string;
  };
  onEdit: (id: string | number, newTitle: string) => void;
}

export default function EditTaskModal({ open, onClose, task, onEdit }: EditTaskModalProps) {
  const formik = useFormik({
    initialValues: {
      title: task.title,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      title: Yup.string()
        .min(6, "Task must be at least 6 characters long")
        .max(255, "Task must be under 255 characters")
        .required("Title is required"),
    }),
    onSubmit: (values) => {
      onEdit(task.id, values.title);
      onClose();
    },
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Task</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            name="title"
            label="Task Title"
            type="text"
            fullWidth
            variant="outlined"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="error">
            Cancel
          </Button>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            disabled={!formik.isValid || formik.values.title === task.title}
          >
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}