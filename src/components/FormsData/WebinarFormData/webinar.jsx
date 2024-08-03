import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../Firebase/Firebase'; // Adjust the path as needed
import * as XLSX from 'xlsx';

const WebinarData = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, 'forms/webinarForm/webinarForms'));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRows(data);
    };

    fetchData();
  }, []);

  const columns = [
    { field: 'id', headerName: 'ID', width: 150 },
    { field: 'degree', headerName: 'Degree', width: 150 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'phone', headerName: 'Phone', width: 150 },
    { field: 'year', headerName: 'Year', width: 100 },
  ];

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'WebinarData');
    XLSX.writeFile(workbook, 'WebinarData.xlsx');
  };

  return (
    <div style={{ height: 400, width: '100%' }}>
      <button onClick={downloadExcel} style={{ marginBottom: '10px' }}>
        Download as Excel
      </button>
      <DataGrid rows={rows} columns={columns} pageSize={5} checkboxSelection />
    </div>
  );
};

export default WebinarData;
