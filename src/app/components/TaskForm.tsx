"use client";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import * as Yup from "yup";

import "react-toastify/dist/ReactToastify.css";

interface TaskFormProps {
  addTask: (task: string) => void;
}

export default function TaskForm({ addTask }: TaskFormProps) {
  const formik = useFormik({
    initialValues: {
      newTask: "",
    },
    validationSchema: Yup.object({
      newTask: Yup.string()
        .min(6, "Task must be at least 6 characters long")
        .max(255, "Task must be under 255 characters")
        .required("Task is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      if (!values.newTask.trim()) return; 
      addTask(values.newTask);
      // Toast is now handled in the parent component
      resetForm();
    },
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit} className="input-container">
        <div className="input-wrapper">
          <TextField
            id="filled-suffix-shrink"
            name="newTask"
            label="Enter your task"
            variant="filled"
            value={formik.values.newTask}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.newTask && Boolean(formik.errors.newTask)}
            helperText={formik.touched.newTask && formik.errors.newTask}
          />

          {formik.touched.newTask && formik.errors.newTask && (
            <p className="error-message">{formik.errors.newTask}</p>
          )}
        </div>
        <Button 
          type="submit"
          variant="contained" 
          color="success"
          disabled={!formik.isValid || !formik.values.newTask.trim()}
          sx={{
            '&:hover': {
              backgroundColor: 'success.dark', 
              color: 'white', 
            },
          }}
        >
          +
        </Button>
      </form>
    </>
  );
}