import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import { DataGrid } from "@mui/x-data-grid";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import axios from "axios";
import '../index.css'; // Importing the global styles

function Dashboard() {
  const [totalCompanies, setTotalCompanies] = useState(null);
  const [statusCounts, setStatusCounts] = useState({});
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [companyOptions, setCompanyOptions] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [error, setError] = useState(null);
  const [error2, setError2] = useState(null);

  const API_URL1 = "http://localhost:5000/api/crudForm";
  const API_URL2 = "http://localhost:5000/api/crud2Form";

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get(API_URL1);
        if (Array.isArray(response.data)) {
          setTotalCompanies(response.data.length);
        } else {
          throw new Error("Invalid data format: API should return an array.");
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    const fetchTableData = async () => {
      try {
        const response = await axios.get(API_URL2);
        if (Array.isArray(response.data)) {
          const formattedData = response.data.map((item, index) => ({
            id: index + 1,
            company: item.company || "N/A",
            user: item.user || "N/A",
            date: item.date || "N/A",
            status: item.status || "N/A",
            updates: item.updates || "N/A",
          }));
          setTableData(formattedData);
          setFilteredData(formattedData);

          const uniqueStatuses = [...new Set(formattedData.map((row) => row.status))];
          const uniqueCompanies = [...new Set(formattedData.map((row) => row.company))];
          setStatusOptions(uniqueStatuses);
          setCompanyOptions(uniqueCompanies);

          const counts = formattedData.reduce((acc, row) => {
            acc[row.status] = (acc[row.status] || 0) + 1;
            return acc;
          }, {});
          setStatusCounts(counts);
        } else {
          throw new Error("Invalid data format: API should return an array.");
        }
      } catch (err) {
        console.error(err);
        setError2(err.message);
      }
    };

    fetchCompanies();
    fetchTableData();
  }, []);

  const handleStatusFilterChange = (event, values) => {
    setSelectedStatuses(values);
    filterTable(values, selectedCompanies);
  };

  const handleCompanyFilterChange = (event, values) => {
    setSelectedCompanies(values);
    filterTable(selectedStatuses, values);
  };

  const filterTable = (statuses, companies) => {
    let filtered = tableData;

    if (statuses.length > 0) {
      filtered = filtered.filter((row) => statuses.includes(row.status));
    }

    if (companies.length > 0) {
      filtered = filtered.filter((row) => companies.includes(row.company));
    }

    setFilteredData(filtered);
  };

  const renderStatusCell = (params) => {
    const status = params.value;
    let cellStyle = {};

    if (status === "Pending") {
      cellStyle = { backgroundColor: 'red', color: 'white' };
    } else if (status === "In Progress") {
      cellStyle = { backgroundColor: 'orange', color: 'white' };
    } else if (status === "Completed") {
      cellStyle = { backgroundColor: 'green', color: 'white' };
    }

    return (
      <div style={cellStyle} className="status-cell">
        {status}
      </div>
    );
  };

  return (
    <Paper sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h5" gutterBottom>
        Welcome to the Dashboard!
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mb: 2 }}>
        <Card sx={{ width: 200, height: 100 }}>
          <CardContent>
            <Typography variant="h6" align="center">
              Total Companies
            </Typography>
            {error ? (
              <Typography color="error" align="center">
                {error}
              </Typography>
            ) : totalCompanies === null ? (
              <Typography align="center">Loading...</Typography>
            ) : (
              <Typography variant="h4" color="primary" align="center">
                {totalCompanies}
              </Typography>
            )}
          </CardContent>
        </Card>

        <Card sx={{ width: 300, height: 100 }}>
          <CardContent>
            <Typography variant="h6" align="center">
              Status
            </Typography>
            {error2 ? (
              <Typography color="error" align="center">
                {error2}
              </Typography>
            ) : (
              <Box sx={{ display: "flex", justifyContent: "space-around" }}>
                {Object.entries(statusCounts).map(([status, count]) => (
                  <Box key={status}>
                    <Typography variant="body1">{status}</Typography>
                    <Typography variant="h6" color="secondary">
                      {count}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mb: 2 }}>
        <Autocomplete
          multiple
          options={companyOptions}
          value={selectedCompanies}
          onChange={handleCompanyFilterChange}
          renderInput={(params) => (
            <TextField {...params} variant="outlined" label="Filter by Company" placeholder="Select Company" />
          )}
          sx={{ width:200}}
        />

        <Autocomplete
          multiple
          options={statusOptions}
          value={selectedStatuses}
          onChange={handleStatusFilterChange}
          renderInput={(params) => (
            <TextField {...params} variant="outlined" label="Filter by Status" placeholder="Select Status" />
          )}
          sx={{ width: 300 }}
        />
      </Box>

      <Typography variant="h6" gutterBottom>
        CURRENT ENGAGEMENTS
      </Typography>
      {error2 ? (
        <Typography color="error">{error2}</Typography>
      ) : (
        <div style={{ height: 600, width: "100%" }} className="data-grid-container">
          <DataGrid
            rows={filteredData}
            columns={[
              { field: "company", headerName: "Company", flex: 1, sortable: true, headerClassName: 'data-grid-header' },
              { field: "user", headerName: "User", flex: 1, sortable: true, headerClassName: 'data-grid-header' },
              { field: "date", headerName: "Date", flex: 1, sortable: true, headerClassName: 'data-grid-header' },
              {
                field: "status",
                headerName: "Status",
                flex: 1,
                renderCell: renderStatusCell,
                sortable: true,
                headerClassName: 'data-grid-header'
              },
              { field: "updates", headerName: "Updates", flex: 2, sortable: true, headerClassName: 'data-grid-header' },
            ]}
            pageSize={10}
            rowsPerPageOptions={[5, 10, 20]}
            disableSelectionOnClick
            sortingOrder={["asc", "desc"]}
          />
        </div>
      )}
    </Paper>
  );
}

export default Dashboard;