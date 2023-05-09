import { Box, Button } from "@mui/material";
import React from "react";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import {
  DeleteIcon,
} from "@chakra-ui/icons";

const ExportData = ({ table, handleExportData, deleteTrans, handleExportRows }) => {
  return (
    <Box sx={{ display: "flex", gap: "1rem", p: "0.5rem", flexWrap: "wrap" }}>
      <Button onClick={handleExportData} startIcon={<FileDownloadIcon />}>
        Export All Data
      </Button>
      <Button
        disabled={table.getPrePaginationRowModel().rows.length === 0}
        //export all rows, including from the next page, (still respects filtering and sorting)
        onClick={() => handleExportRows(table.getPrePaginationRowModel().rows)}
        startIcon={<FileDownloadIcon />}
        variant="contained"
      >
        Export All Rows
      </Button>
      <Button
        disabled={table.getRowModel().rows.length === 0}
        //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
        onClick={() => handleExportRows(table.getRowModel().rows)}
        startIcon={<FileDownloadIcon />}
        variant="contained"
      >
        Export Page Rows
      </Button>
      <Button
        disabled={
          !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
        }
        //only export selected rows
        onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
        startIcon={<FileDownloadIcon />}
        variant="contained"
      >
        Export Selected Rows
      </Button>
      <Button
        disabled={
          !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
        }
        onClick={() => {
          table.getSelectedRowModel().rows.map((row) => {
            deleteTrans(row.original.id);
          })
        }}
        startIcon={<DeleteIcon />}
        variant="contained"
        color="error">
        Delete Transaction
      </Button>
    </Box>
  );
};

export default ExportData;
