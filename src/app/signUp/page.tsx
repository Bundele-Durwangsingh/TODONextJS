'use client';
import { InputAdornment, IconButton, TextField } from '@mui/material';
import Button from "@mui/material/Button";
import { Email } from '@mui/icons-material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from "react";
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import 'react-toastify/dist/ReactToastify.css';
import "./SignUp.css";

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [createUser] = useCreateUserWithEmailAndPassword(auth);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.includes('@')) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    try {
      const res = await createUser(email, password);
      if (res) {
        toast.success("User created successfully!");
        router.push('/signIn');
      }
    } catch (err) {
      console.log(err);
      toast.error("An error occurred. Please try again.");
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
  sx={{
    '&:hover': {
      backgroundColor: 'primary.main',
      color: 'white',
    },
  }}
>
  Sign Up
</Button>
        <p className="signup-link">
          Old user? <Link href="/signIn">Sign in instead</Link>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
