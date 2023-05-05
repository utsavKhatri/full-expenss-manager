import React from 'react'
import { DataGrid } from '@mui/x-data-grid';

const MaterialTransTable = ({trasactionData}) => {
  const rows = [
    { id: 1, col1: 'Hello', col2: 'World' },
    { id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
    { id: 3, col1: 'MUI', col2: 'is Amazing' },
  ];
  
  const columns = [
    { field: 'col1', headerName: 'id', width: 150 },
    { field: 'col2', headerName: 'Text', width: 150 },
    { field: 'col3', headerName: 'Text', width: 150 },
  ];
  return (
    <DataGrid rows={rows} columns={columns} />
  )
}

export default MaterialTransTable