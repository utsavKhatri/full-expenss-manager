'use client';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { dataState } from '@/context';
import { Suspense, useState } from 'react';
import { useColorMode, useToast } from '@chakra-ui/react';
import axios from 'axios';
import Loader from '@/components/Loader';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const page = () => {
  const { handleLogin, loginLoading } = dataState();
  const [googleLoading, setGoogleLoading] = useState(false);
  const { colorMode } = useColorMode();

  const defaultTheme = createTheme({
    palette: {
      mode: colorMode,
    },
  });
  const toast = useToast();
  const googleLogin = () => {
    setGoogleLoading(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`)
      .then((response) => {
        // console.log(response);
        setGoogleLoading(false);
        window.location.href = response.data.url;
      })
      .catch((error) => {
        setGoogleLoading(false);
        console.log(error);
        toast({
          title: error.response.data.message,
          variant: 'left-accent',
          status: 'error',
          duration: 2000,
        });
      });
  };
  return (
    <Suspense fallback={<Loader />}>
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              onSubmit={(e) => handleLogin(e)}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  fontWeight: 'bold',
                  backgroundColor:
                    colorMode === 'light' ? '#9c27b0' : '#52e851',
                  color: colorMode === 'light' ? 'white' : 'black',
                  '&:hover': {
                    fontWeight: 'bolder',
                    backgroundColor:
                      colorMode === 'light' ? '#36003f' : '#6fff6e',
                    color: colorMode === 'light' ? 'white' : 'black',
                  },
                }}
                onLoad={loginLoading}
                disabled={loginLoading}
              >
                {loginLoading ? 'perform sign in...' : 'Sign In'}
              </Button>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  backgroundColor: colorMode === 'light' ? '#92c4ff' : 'white',
                  color: 'black',
                  '&:hover': {
                    backgroundColor:
                      colorMode === 'light' ? '#003a6e' : '#000000',
                    color: 'white',
                  },
                }}
                onClick={googleLogin}
                disabled={googleLoading}
                startIcon={<FcGoogle />}
              >
                {googleLoading ? 'perform sign in...' : 'Sign In with Google'}
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="/auth/login">Forgot password?</Link>
                </Grid>
                <Grid item>
                  <Link href="/auth/signup">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
      </ThemeProvider>
    </Suspense>
  );
};

export default page;
