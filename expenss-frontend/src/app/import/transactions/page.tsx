'use client';
import Loader from '@/components/Loader';
import SidebarWithHeader from '@/components/Navbar';
import { dataState } from '@/context';
import { Flex, useColorMode } from '@chakra-ui/react';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  Input,
  InputLabel,
  MenuItem,
  Select,
  ThemeProvider,
  Typography,
  createTheme,
} from '@mui/material';
import { Key, useEffect } from 'react';

const page = () => {
  const { colorMode } = useColorMode();
  const defaultTheme = createTheme({
    palette: {
      mode: colorMode,
    },
  });
  const {
    data,
    fetchHomepageData,
    handleImportFile,
    handleImportFileChange,
    importfile,
    loading,
    importingLoading,
  } = dataState();

  useEffect(() => {
    fetchHomepageData();
  }, []);
  return (
    <SidebarWithHeader>
      {!loading ? (
        <Flex w={'full'} justifyContent={'center'} alignItems={'center'}>
          <ThemeProvider theme={defaultTheme}>
            <Box
              sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography component="h1" variant="h5">
                Import Transaction data from CSV/XLSX
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={(e) => handleImportFile(e)}
                sx={{ mt: 3 }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-helper-label">
                        Account
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        label="Account"
                        name="account"
                      >
                        {data &&
                          data.map((v: any, i: Key | null | undefined) => {
                            return (
                              <MenuItem key={i} value={v.id}>
                                {v.name}
                              </MenuItem>
                            );
                          })}
                      </Select>
                      <FormHelperText>
                        Select an account want to import transaction
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} pt={3}>
                    <FormControl fullWidth>
                      <FormLabel
                        htmlFor="importfile"
                        sx={{
                          cursor: 'pointer',
                          borderRadius: '5px',
                          border: '1px solid',
                          display: 'inline-block',
                          width: '100%',
                          textAlign: 'start',
                          px: 3,
                          py: 2,
                          borderColor: 'gray.500',
                          my: 'auto',
                        }}
                      >
                        {importfile
                          ? `${importfile.name?.slice(0, 20)}...`
                          : 'select transactions file'}
                      </FormLabel>
                      {importfile && (
                        <FormHelperText>
                          Size : {importfile.size} KB, Type : {importfile.type}
                        </FormHelperText>
                      )}
                    </FormControl>
                    <Input
                      type="file"
                      id="importfile"
                      onChange={handleImportFileChange}
                      sx={{
                        display: 'none',
                      }}
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={importingLoading}
                  onLoad={importingLoading}
                >
                  Confirm
                </Button>
              </Box>
            </Box>
          </ThemeProvider>
        </Flex>
      ) : (
        <Loader />
      )}
    </SidebarWithHeader>
  );
};

export default page;
