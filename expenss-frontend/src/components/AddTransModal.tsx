import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  ThemeProvider,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { dataState } from '@/context';
import AddBoxIcon from '@mui/icons-material/AddBox';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default function AddTransModel({ accId }: { accId: string }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { theme, catData, handleCreateTrans } = dataState();

  return (
    <ThemeProvider theme={theme}>
      <Button
        onClick={handleOpen}
        sx={{
          paddingBlock: 'auto',
        }}
        startIcon={<AddBoxIcon />}
        color='inherit'
      >
        Add Transaction
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography variant='h5' textAlign={'center'} gutterBottom>Add transaction</Typography>
            <Stack
              component={'form'}
              spacing={2}
              onSubmit={(e) => handleCreateTrans(e, accId, setOpen)}
            >
              <FormControl fullWidth>
                <TextField
                  label="Text"
                  variant="outlined"
                  name="text"
                  type="text"
                />
              </FormControl>
              <FormControl fullWidth>
                <TextField
                  label="Amount"
                  variant="outlined"
                  name="amount"
                  type="number"
                />
              </FormControl>
              <FormControl fullWidth>
                <TextField
                  label="Transfer"
                  variant="outlined"
                  name="transfer"
                  type="text"
                />
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="categorySelect">Category</InputLabel>
                <Select
                  labelId="categorySelect"
                  label="Category"
                  name="category"
                  variant="outlined"
                >
                  {catData?.map((cat: any) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="incomeSelect">Type</InputLabel>
                <Select
                  label="Type"
                  name="isIncome"
                  labelId="incomeSelect"
                  variant="outlined"
                >
                  <MenuItem value={'true'}>Income</MenuItem>
                  <MenuItem value={'false'}>Expense</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <Button type="submit" variant="contained" color="primary">
                  Create
                </Button>
              </FormControl>
            </Stack>
          </Box>
        </Fade>
      </Modal>
    </ThemeProvider>
  );
}
