'use client';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { dataState } from '@/context';
import { Suspense } from 'react';
import Loader from '@/components/Loader';
import { Flex, FormLabel, useColorMode } from '@chakra-ui/react';
import { Input } from '@mui/material';
import Cookies from 'js-cookie';
import Image from 'next/image';
import Link from 'next/link';

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {'Copyright © '}
      <Link color="inherit" href="http://localhost:3000">
        Expense manger
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const page = () => {
  const { colorMode } = useColorMode();
  const defaultTheme = createTheme({
    palette: {
      mode: colorMode,
    },
  });
  const { handleSignup, signupLoading, profileUrl, handleFileChange } =
    dataState();

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
              Sign up
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={(e) => handleSignup(e)}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    autoComplete="full-name"
                    name="name"
                    required
                    fullWidth
                    id="name"
                    label="Full Name"
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} pt={3}>
                <Flex gap={2} alignItems={'center'} w={'full'}>
                  <FormLabel
                    htmlFor="file"
                    mx={0}
                    sx={{
                      w: 'full',
                      cursor: 'pointer',
                      borderRadius: '5',
                      border: '1px solid',
                      display: 'inline-block',
                      width: 'full',
                      textAlign: 'start',
                      px: 3,
                      py: 2,
                      borderColor: 'gray.500',
                      my: 'auto',
                    }}
                  >
                    {Cookies.get('profileUrl')! || profileUrl
                      ? `${Cookies.get('profileUrl')?.slice(0, 20)}...`
                      : 'select an image'}
                  </FormLabel>
                  {Cookies.get('profileUrl') && (
                    <Image
                      src={Cookies.get('profileUrl') || profileUrl}
                      alt={'profileImage'}
                      width={50}
                      height={30}
                      style={{
                        objectFit: 'cover',
                      }}
                    />
                  )}
                </Flex>
                <Input
                  type="file"
                  id="file"
                  onChange={handleFileChange}
                  sx={{
                    display: 'none',
                  }}
                />
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onLoad={signupLoading}
                disabled={signupLoading}
              >
                {signupLoading ? 'Submitting' : 'Sign up'}
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="/auth/login">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{ mt: 5 }} />
        </Container>
      </ThemeProvider>
    </Suspense>
  );
};

export default page;
