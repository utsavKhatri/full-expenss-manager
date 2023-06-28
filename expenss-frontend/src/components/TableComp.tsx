'use client';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  DataGrid,
  GridRowId,
  GridRowModel,
  GridRowsProp,
  GridColDef,
  GridActionsCellItem,
  GridRowModesModel,
  GridRowModes,
  GridToolbarContainer,
  GridRowEditStopReasons,
  GridEventListener,
  GridToolbarExport,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
} from '@mui/x-data-grid';
import Cookies from 'js-cookie';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import { dataState } from '@/context';
import AddTransModel from './AddTransModal';
import { useColorMode } from '@chakra-ui/react';

const TableComp = () => {
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const { transData, rows, setRows, handleTransUpdate, deleteTrans } = dataState();
  const { colorMode } = useColorMode();

  const theme = createTheme({
    palette: { mode: colorMode },
    components: {
      // @ts-ignore
      MuiDataGrid: {
        styleOverrides: {
          root: {
            backgroundColor: colorMode == 'light' ? '#fafafa' : '#1a1a1a',
            color: colorMode == 'light' ? '#1a1a1a' : '#fafafa',
            borderColor: colorMode == 'light' ? '#ffffff' : '#1a1a1a',
          },
        },
      },
    },
  });

  const initialRows: GridRowsProp = transData.data;


  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    // console.log('New Row Modes Model:', newRowModesModel);
    setRowModesModel(newRowModesModel);
  };

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow: any = { ...newRow, isNew: false };
    setRows((oldRows: GridRowsProp) =>
      oldRows.map((row) => (row.id === newRow.id ? updatedRow : row))
    );
    console.log('Updated Row:', updatedRow);
    const currentUserId = JSON.parse(Cookies.get('userInfo') as any).user.id;

    const customValues = {
      account: updatedRow?.account,
      amount: updatedRow?.amount,
      text: updatedRow?.text,
      trasnfer: updatedRow?.trasnfer,
      updatedBy: currentUserId,
    };

    handleTransUpdate(updatedRow.id, customValues);

    return updatedRow;
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel((prevModesModel) => ({
      ...prevModesModel,
      [id]: { mode: GridRowModes.Edit },
    }));
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel((prevModesModel: any) => {
      const updatedModel = {
        ...prevModesModel,
        [id]: { mode: 'view' },
      };
      return updatedModel;
    });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    deleteTrans(id, transData.accountId);
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel((prevModesModel) => ({
      ...prevModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    }));

    const editedRow = rows.find((row: GridRowModel) => row.id === id);
    if (editedRow && editedRow.isNew) {
      setRows((prevRows: GridRowsProp) =>
        prevRows.filter((row) => row.id !== id)
      );
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
    {
      field: 'text',
      headerName: 'Text',
      editable: true,
    },
    {
      field: 'transfer',
      headerName: 'Transfer',
      editable: true,
      flex: 1,
    },
    {
      field: 'category',
      headerName: 'Category',
      valueGetter: (params) => params.row.category.name,
      editable: false,
      flex: 1,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      flex: 1,
      renderCell: (params) => {
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
        }).format(params.row.amount);
      },
      editable: true,
      cellClassName: (params) => `amount-${params.row.isIncome}-${colorMode}`,
    },
    {
      field: 'createdAt',
      headerName: 'Date',
      editable: false,
      flex: 1,
      renderCell: (params) => {
        return new Date(params.row.createdAt).toDateString();
      },
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <div style={{ height: 'auto', width: '100%' }}>
        <DataGrid
          rows={initialRows}
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          slots={{
            toolbar: () => {
              return (
                <GridToolbarContainer>
                  <AddTransModel accId={transData.accountId} />
                  <GridToolbarColumnsButton />
                  <GridToolbarFilterButton />
                  <GridToolbarExport />
                </GridToolbarContainer>
              );
            },
          }}
        />
      </div>
    </ThemeProvider>
  );
};

export default TableComp;
