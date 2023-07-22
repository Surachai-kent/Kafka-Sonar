import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
// import FormControl from '@mui/material/FormControl/FormControl';
// import InputLabel from '@mui/material/InputLabel';
// import Select from '@mui/material/Select';
// import MenuItem from '@mui/material/MenuItem';

import '../assets/kafka-sonar-orange-logo.svg';

import useInput from '../hooks/useInput';

// TS types
import { User } from './../types/types';

import { createDockerDesktopClient } from '@docker/extension-api-client';

export default function Signup(): JSX.Element {
  // following use custom hook
  const [email, emailOnChange] = useInput('');
  const [password, passwordOnChange] = useInput('');

  // // useState
  // const [role, setRole] = useState<string>('User');

  // // role select handler to update state
  // const roleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const i = e.target.value;
  //   setRole(['User', 'Admin'][i]);
  // };

  const navigate = useNavigate();

  // Needed checks:
  // 1) Navigate to /saved works.
  // 2) Check toast works after going to SavedConnections page.
  // 3) Do we want to verify the user's entered email exists by sending some token to their email?

  const postNewUser = (): Promise<void> => {
    // if email or password are empty strings
    if (!email || !password) {
      // alert user and exit handler
      alert('Email and password are required.');
      return;
    }

    // Validate email input (reference: https://bobbyhadz.com/blog/react-check-if-email-is-valid)
    if (!/\S+@\S+\.\S+/.test(email)) {
      // alert user and exit handler
      alert('Provide a valid email.');
      return;
    }

    // instantiate DD client object
    const ddClient = createDockerDesktopClient();

    const body: User = {
      email,
      password,
    };
    // POST new user
    ddClient.extension.vm.service
      .post('/api/users', body)
      // BE returns the newly created user object (unused on FE)
      .then((newUser: User) => {
        // redirect to SavedConnections page
        navigate('/saved');
        // toast success message
        ddClient.desktopUI.toast.success('Account creation successful!');
      });
  };

  return (
    <Paper
      elevation={2}
      style={{
        width: '60vh',
        padding: 20,
        margin: '15vh auto',
      }}
    >
      <img
        src="kafka-sonar-orange-logo.svg"
        style={{
          width: 40,
          position: 'relative',
          left: '25vh',
          margin: '20px 0',
        }}
      />
      <Typography
        component="h1"
        variant="h5"
        fontFamily="inherit"
        align="center"
      >
        Sign Up
      </Typography>
      <TextField
        variant="standard"
        name="email"
        type="email"
        id="email"
        value={email}
        onChange={emailOnChange}
        label="Email"
        fullWidth
        required
        autoFocus
        style={{ margin: '15px auto' }}
      />
      <TextField
        variant="standard"
        name="password"
        type="password"
        id="password"
        value={password}
        onChange={passwordOnChange}
        label="Password"
        fullWidth
        required
        style={{ margin: '15px auto' }}
      />
      {/* <FormControl
        variant="standard"
        fullWidth
        required
        style={{ margin: '15px auto' }}
      >
        <InputLabel>User or Admin access?</InputLabel>
        <Select name="roles" onChange={roleOnChange}>
          {['User', 'Admin'].map((access, i) => {
            return <MenuItem value={i}>{access}</MenuItem>;
          })}
        </Select>
      </FormControl> */}
      <Button
        variant="contained"
        color="primary"
        type="button"
        onClick={postNewUser}
        fullWidth
        style={{ margin: '30px auto' }}
      >
        Get Started
      </Button>
      <Typography
        align="center"
        fontFamily="inherit"
        style={{ margin: '15px auto' }}
      >
        <Link to="/">Have an account? Log in</Link>
      </Typography>
    </Paper>
  );
}
