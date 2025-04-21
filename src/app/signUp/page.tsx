'use client';
import { InputAdornment, IconButton, TextField } from '@mui/material';
import Button from "@mui/material/Button";
import { Email } from '@mui/icons-material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from "react";
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';
import { useRouter } from 'next/navigation';
import 'react-toastify/dist/ReactToastify.css';
import "./SignUp.css";
import { authService } from '@/services/api';
import * as Yup from 'yup';
import { useFormik } from 'formik';

// Define the type for form values
type SignUpFormValues = {
  email: string;
  password: string;
};

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // Form validation with Formik and Yup
  const formik = useFormik<SignUpFormValues>({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
    }),
    onSubmit: async (values) => {
      await handleSignUp(values);
    },
  });

  const handleSignUp = async ({ email, password }: SignUpFormValues) => {
    setLoading(true);

    try {
      await authService.signup({ email, password });
      toast.success("User created successfully!");
      router.push('/signIn');
    } catch (error) {
      console.error("Signup error:", error);

      let errorMessage = "An error occurred. Please try again.";
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } } };
        errorMessage = err.response?.data?.message || errorMessage;
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={formik.handleSubmit}>
        <h2>Sign Up</h2>
        <div className="input-group">
          <label>Email:</label>
          <TextField
            type="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            required
            variant="filled"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton>
                    <Email />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div className="input-group">
          <label>Password:</label>
          <TextField
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            required
            variant="filled"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showPassword ? 'hide the password' : 'display the password'}
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
        <Button
          type="submit"
          variant="outlined"
          color="primary"
          disabled={loading || !formik.isValid}
          sx={{
            '&:hover': {
              backgroundColor: 'primary.main',
              color: 'white',
            },
          }}
        >
          {loading ? 'Signing Up...' : 'Sign Up'}
        </Button>
        <p className="signup-link">
          Already have an account? <Link href="/signIn">Sign in instead</Link>
        </p>
      </form>

      <ToastContainer 
        position="top-right" 
        autoClose={2000} 
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default SignUp;
