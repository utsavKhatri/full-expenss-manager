'use client';

import Loader from '@/components/Loader';
import SidebarWithHeader from '@/components/Navbar';
import { dataState } from '@/context';
import { Button, ThemeProvider } from '@mui/material';
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridActionsCellItem,
  GridRowModel,
  GridRowId,
  GridEventListener,
  GridRowModesModel,
  GridRowEditStopReasons,
  GridRowModes,
  GridToolbarContainer,
} from '@mui/x-data-grid';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { randomUUID } from 'crypto';

const page = ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  console.log(params);
  const {
    theme,
    fetchSignleAcc,
    fetchAccData,
    catData,
    setCatData,
    accPageLoading,
    transData,
    sampleAccData,
    rows,
    setRows,
  } = dataState();
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const id = params.id;

  const router = useRouter();

  useEffect(() => {
    if (Cookies.get('userInfo')) {
      fetchSignleAcc(id);
      fetchAccData(id);
      axios
        .get('http://localhost:1337/category')
        .then((res) => {
          setCatData(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      router.push('/auth/login');
    }
  }, []);
  if (accPageLoading) return <Loader />;
  const initialRows: GridRowsProp = transData.data;
  console.log(initialRows);
  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    console.log("sadasdasd",newRowModesModel);
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
    const updatedRow = { ...newRow, isNew: false };
    setRows(
      rows.map((row: { id: any }) => (row.id === newRow.id ? updatedRow : row))
    );
    return updatedRow;
  };
  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    setRows(rows.filter((row: { id: GridRowId }) => row.id !== id));
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row: { id: GridRowId }) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row: { id: GridRowId }) => row.id !== id));
    }
  };
  console.log(catData);

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
    { field: 'text', headerName: 'Text', editable: true },
    { field: 'transfer', headerName: 'Transfer', editable: true },
    {
      field: 'category',
      headerName: 'Category',
      valueGetter: (params) => params.row.category.name,
      editable: false,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      renderCell: (params) => {
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
        }).format(params.row.amount);
      },
      editable: true,
    },
    {
      field: 'createdAt',
      headerName: 'Date',
      editable: false,
      renderCell: (params) => {
        return new Date(params.row.createdAt).toDateString();
      },
    },
  ];

  return (
    <SidebarWithHeader>
      <ThemeProvider theme={theme}>
        <div style={{ height: 300, width: '100%' }}>
          <DataGrid
            rows={initialRows}
            columns={columns}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
            slots={{
              toolbar: EditToolbar,
            }}
            slotProps={{
              toolbar: { setRows, setRowModesModel },
            }}
          />
        </div>
      </ThemeProvider>
    </SidebarWithHeader>
  );
};

export default page;

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void;
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = randomUUID();
    setRows((oldRows) => [...oldRows, { id, name: '', age: '', isNew: true }]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}
