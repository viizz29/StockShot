import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import axios from 'axios';

 
export default function Signup() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    axios.post('/api/signup', {
      firstname: data.get('firstname'),
      lastname: data.get('lastname'),
      email: data.get('email'),
      password: data.get('password'),
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(function (response) {
      //let data = response.data;
      //console.log(cookies.get('token'));
      //console.log(data);
      //cookies.set('token', data.token, {path: '/'});
      //localStorage.setItem('token', data.token);
      window.open("/login", "_self");
    })
    .catch(function (error) {
      console.log(error);
    });
  };

  return (
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            New Account
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="firstname"
              label="First Name"
              name="firstname"
              autoComplete="firstname"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="lastname"
              label="Last Name"
              name="lastname"
              autoComplete="lastname"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="email"
              label="Email Address"
              id="email"
              autoComplete="email"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              id="password"
              type="password"
              autoComplete="password"
            />

          
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              CREATE
            </Button>
          </Box>
        </Box>
      
  );
}
