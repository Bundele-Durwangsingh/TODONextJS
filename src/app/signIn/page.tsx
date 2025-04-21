'use client';
import { InputAdornment, IconButton, TextField } from '@mui/material';
import Button from "@mui/material/Button";
import { Email } from '@mui/icons-material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from "react";
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./SignIn.css";

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [signIn] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await signIn(email, password);
      if (!res) {
        toast.error("Invalid credentials. Please try again.");
        return;
      }
      console.log(res);
      setEmail('');
      setPassword('');
      router.push('/todo');
    } catch (err) {
      toast.error("An error occurred. Please try again.");
      console.log(err);
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
  sx={{
    '&:hover': {
      backgroundColor: 'primary.main',
      color: 'white',
    },
  }}
>
  Sign In
</Button>

        <p className="signup-link">
          New user? <Link href="/signUp">Sign up instead</Link>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
