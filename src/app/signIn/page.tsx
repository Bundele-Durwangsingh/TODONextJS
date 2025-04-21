'use client';
import { InputAdornment, IconButton, TextField } from '@mui/material';
import Button from "@mui/material/Button";
import { Email } from '@mui/icons-material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./SignIn.css";
import { authService } from '@/services/api';
import * as Yup from 'yup';
import { useFormik } from 'formik';

type SignInFormValues = {
  email: string;
  password: string;
};

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // Form validation with Formik and Yup
  const formik = useFormik<SignInFormValues>({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .required('Password is required'),
    }),
    onSubmit: async (values) => {
      await handleSignIn(values);
    },
  });

  const handleSignIn = async ({ email, password }: SignInFormValues) => {
    setLoading(true);

    try {
      await authService.login({ email, password });
      toast.success("Sign in successful!");

      // Fetch user profile to validate token
      await authService.getProfile();

      // Navigate to todo page
      setTimeout(() => {
        router.push('/todo');
      }, 1000);
    } catch (error) {
      console.error("Login error:", error);

      let errorMessage = "Invalid credentials. Please try again.";
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } } };
        errorMessage = err.response?.data?.message || errorMessage;
      }

      toast.error(errorMessage);
      authService.logout(); // Clear any partial auth state
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <div className="signin-container">
      <form className="signin-form" onSubmit={formik.handleSubmit}>
        <h2>Sign In</h2>
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
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>

        <p className="signup-link">
          New user? <Link href="/signUp">Sign up instead</Link>
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

export default SignIn;
