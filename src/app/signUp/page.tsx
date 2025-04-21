'use client';
import { InputAdornment, IconButton, TextField } from '@mui/material';
import Button from "@mui/material/Button";
import { Email } from '@mui/icons-material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from "react";
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import 'react-toastify/dist/ReactToastify.css';
import "./SignUp.css";
import { authService } from '@/services/api';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!email.includes('@')) {
      toast.error("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    try {
      await authService.signup({ email, password });
      toast.success("User created successfully!");
      router.push('/signIn');
    } catch (error: unknown) {
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
      <form className="signup-form" onSubmit={handleSignUp}>
        <h2>Sign Up</h2>
        <div className="input-group">
          <label>Email:</label>
          <TextField
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          disabled={loading}
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
          Old user? <Link href="/signIn">Sign in instead</Link>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
