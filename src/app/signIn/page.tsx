'use client';
import { InputAdornment, IconButton, TextField } from '@mui/material';
import Button from "@mui/material/Button";
import { Email } from '@mui/icons-material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./SignIn.css";
import { authService } from '@/services/api';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.login({ email, password });
      toast.success("Sign in successful!");
      setEmail('');
      setPassword('');
      router.push('/todo');
    } catch (error: unknown) {
      console.error("Login error:", error);

      let errorMessage = "Invalid credentials. Please try again.";
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
    <div className="signin-container">
      <form className="signin-form" onSubmit={handleSignIn}>
        <h2>Sign In</h2>
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
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>

        <p className="signup-link">
          New user? <Link href="/signUp">Sign up instead</Link>
        </p>
      </form>
    </div>
  );
};

export default SignIn;