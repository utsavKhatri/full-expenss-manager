import { IconButton, Menu, MenuItem, ThemeProvider } from '@mui/material';
import {
  GridToolbarColumnsButton,
  GridToolbarExport,
  GridToolbarFilterButton,
} from '@mui/x-data-grid';

import { MouseEvent, useState } from 'react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const CustomMenuComp = ({ theme }: { theme: any }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <ThemeProvider theme={theme}>
      <IconButton
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-label="more-btn"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <MoreHorizIcon />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleClose}>
          <GridToolbarColumnsButton />
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <GridToolbarFilterButton />
        </MenuItem>
        <MenuItem>
          <GridToolbarExport
            printOptions={{
              hideFooter: true,
              hideToolbar: true,
            }}
          />
        </MenuItem>
      </Menu>
    </ThemeProvider>
  );
};
export default CustomMenuComp;
