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
} from '@mui/x-data-grid';
import Cookies from 'js-cookie';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { useMemo, useState } from 'react';
import { dataState } from '@/context';
import { Box, useColorMode, useColorModeValue } from '@chakra-ui/react';
import Loader from './Loader';
import dynamic from 'next/dynamic';
import AddTransModel from './modals/AddTransModal';
const CustomMenuComp = dynamic(() => import('@/components/CustomMenuComp'));

const TableComp = () => {
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const { transData, rows, setRows, handleTransUpdate, deleteTrans } =
    dataState();
  const { colorMode } = useColorMode();
  if (transData == undefined) {
    return <Loader />;
  }

  const theme = createTheme({
    palette: {
      mode: colorMode,
    },
  });

  const initialRows: GridRowsProp = useMemo(() => transData.data, [transData]);

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
    // console.log('Updated Row:', updatedRow);
    const currentUserId = JSON.parse(Cookies.get('userInfo') as any).user.id;

    const customValues = {
      account: updatedRow?.account,
      amount: updatedRow?.amount,
      text: updatedRow?.text,
      transfer: updatedRow?.transfer,
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
      flex: 0.8,
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
      minWidth: 75,
      disableExport: true,
    },
    {
      field: 'text',
      headerName: 'Text',
      editable: true,
      flex: 2,
      minWidth: 220,
    },
    {
      field: 'transfer',
      headerName: 'Transfer',
      editable: true,
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'category',
      headerName: 'Category',
      valueGetter: (params) => params.row.category.name,
      editable: false,
      flex: 1,
      minWidth: 100,
      valueFormatter: ({ value }) => value,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      editable: true,
      renderCell: (params) => {
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
        }).format(params.row.amount);
      },
      flex: 1.5,
      minWidth: 100,
      cellClassName: (params) => `amount-${params.row.isIncome}-${colorMode}`,
    },
    {
      field: 'updatedBy',
      headerName: 'Updated By',
      editable: false,
      renderCell: (params) => {
        return params.row.updatedBy.name;
      },
      valueGetter: (params) => params.row.updatedBy.name,
      flex: 1,
      minWidth: 100,
      valueFormatter: ({ value }) => value,
    },
    {
      field: 'createdAt',
      headerName: 'Date',
      editable: false,
      flex: 1.5,
      renderCell: (params) => {
        return new Date(params.row.createdAt).toDateString();
      },
      minWidth: 150,
      valueFormatter: ({ value }) => new Date(value).toDateString(),
    },
    {
      field: 'updatedAt',
      headerName: 'Updated At',
      editable: false,
      flex: 1.5,
      minWidth: 150,
      renderCell: (params) => {
        return new Date(params.row.updatedAt).toDateString();
      },
      valueFormatter: ({ value }) => new Date(value).toDateString(),
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      {initialRows.length === 0 ? (
        <AddTransModel accId={transData.accountId} />
      ) : (
        <Box
          bg={useColorModeValue('white', '#141414')}
          style={{
            height: 'auto',
            width: '100%',
          }}
        >
          <DataGrid
            rows={initialRows}
            columns={columns}
            editMode="row"
            rowModesModel={rowModesModel}
            initialState={{
              pagination: { paginationModel: { pageSize: 15 } },
            }}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
            slots={{
              toolbar: () => (
                <GridToolbarContainer>
                  <AddTransModel accId={transData.accountId} />
                  <CustomMenuComp theme={theme} />
                </GridToolbarContainer>
              ),
            }}
            sx={{
              '@media print': {
                '.MuiDataGrid-main': {
                  color: 'rgba(0, 0, 0, 0.87)',
                  width: '100%',
                  margin: 0,
                  padding: 0,
                },
              },
            }}
            slotProps={{
              toolbar: {
                printOptions: {
                  pageStyle:
                    '.MuiDataGrid-root .MuiDataGrid-main { color: black; }',
                },
              },
            }}
          />
        </Box>
      )}
    </ThemeProvider>
  );
};

export default TableComp;
