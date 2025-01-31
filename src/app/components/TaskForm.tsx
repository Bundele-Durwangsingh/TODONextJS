"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
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
        .matches(/^[a-zA-Z0-9 ]*$/, "No special characters allowed")
        .required("Task cannot be empty"),
    }),
    onSubmit: (values, { resetForm }) => {
      if (!values.newTask.trim()) return; 
      addTask(values.newTask);
      toast.success("Task successfully added", {
        position: "top-right",
        autoClose: 2000,
      });
      resetForm();
    },
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit} className="input-container">
        <div className="input-wrapper">
          <input
            type="text"
            name="newTask"
            placeholder="Enter your task"
            value={formik.values.newTask}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="task-input"
          />
          {formik.touched.newTask && formik.errors.newTask && (
            <p className="error-message">{formik.errors.newTask}</p>
          )}
        </div>
        <button 
          type="submit" 
          className="add-btn" 
          disabled={!formik.isValid || !formik.values.newTask.trim()}
        >
          +
        </button>
      </form>
    </>
  );
}
