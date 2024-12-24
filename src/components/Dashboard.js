import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid"; // For grid layout
import { DataGrid } from "@mui/x-data-grid";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import axios from "axios";

function Dashboard() {
  const [totalCompanies, setTotalCompanies] = useState(null); // Total companies from crudForm.json
  const [statusCounts, setStatusCounts] = useState({}); // Counts of values by status from the data table
  const [tableData, setTableData] = useState([]); // Original table data
  const [filteredData, setFilteredData] = useState([]); // Filtered data for the table
  const [statusOptions, setStatusOptions] = useState([]); // Unique status values for the dropdown slicer
  const [companyOptions, setCompanyOptions] = useState([]); // Unique company values for the company slicer
  const [selectedStatuses, setSelectedStatuses] = useState([]); // Selected statuses for filtering
  const [selectedCompanies, setSelectedCompanies] = useState([]); // Selected companies for filtering
  const [error, setError] = useState(null); // Error for first API call
  const [error2, setError2] = useState(null); // Error for second API call

  const API_URL1 = "http://localhost:5000/api/crudForm"; // Endpoint for crudForm.json
  const API_URL2 = "http://localhost:5000/api/crud2Form"; // Endpoint for crud2Form.json

  useEffect(() => {
    // Fetch data for the first card (crudForm.json)
    const fetchCompanies = async () => {
      try {
        const response = await axios.get(API_URL1);
        if (Array.isArray(response.data)) {
          setTotalCompanies(response.data.length); // Set the count of companies
        } else {
          throw new Error("Invalid data format: API should return an array.");
        }
      } catch (err) {
        console.error(err);
        setError(err.message); // Capture and display error
      }
    };

    // Fetch data for the table (crud2Form.json)
    const fetchTableData = async () => {
      try {
        const response = await axios.get(API_URL2);
        if (Array.isArray(response.data)) {
          const formattedData = response.data.map((item, index) => ({
            id: index + 1, // Add unique ID for DataGrid rows
            company: item.company || "N/A",
            user: item.user || "N/A",
            date: item.date || "N/A",
            status: item.status || "N/A",
            updates: item.updates || "N/A",
          }));
          setTableData(formattedData);
          setFilteredData(formattedData); // Initially, filtered data is the same as original data

          // Extract unique statuses and companies for the dropdown slicers
          const uniqueStatuses = [...new Set(formattedData.map((row) => row.status))];
          const uniqueCompanies = [...new Set(formattedData.map((row) => row.company))];
          setStatusOptions(uniqueStatuses);
          setCompanyOptions(uniqueCompanies);

          // Calculate status counts
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
        setError2(err.message); // Capture and display error for the second API call
      }
    };

    fetchCompanies(); // Fetch data for the first card
    fetchTableData(); // Fetch data for the table
  }, []);

  // Handle filtering when status slicer changes
  const handleStatusFilterChange = (event, values) => {
    setSelectedStatuses(values); // Update selected statuses
    filterTable(values, selectedCompanies); // Update table based on both slicers
  };

  // Handle filtering when company slicer changes
  const handleCompanyFilterChange = (event, values) => {
    setSelectedCompanies(values); // Update selected companies
    filterTable(selectedStatuses, values); // Update table based on both slicers
  };

  // Function to filter table based on selected statuses and companies
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

  // Custom cell rendering for the Status column with conditional formatting
  const renderStatusCell = (params) => {
    const status = params.value;
    let color = "black"; // Default color
    if (status === "Pending") color = "red";
    else if (status === "In Progress") color = "orange";
    else if (status === "Completed") color = "green";

    return <span style={{ color, fontWeight: "bold" }}>{status}</span>;
  };

  return (
    <Paper
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {/* Welcome message */}
      <Typography variant="h5" gutterBottom>
        Welcome to the Dashboard!
      </Typography>

      {/* Data Cards */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
          mb: 2,
        }}
      >
        {/* Total Companies Card */}
        <Card sx={{ width: 200, height: 100 }}> {/* Reduced size */}
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

        {/* Status Counts Card */}
        <Card sx={{ width: 300, height: 100 }}> {/* Another card */}
          <CardContent>
            <Typography variant="h6" align="center">
              Status Counts
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

      {/* Dropdown Slicers for Filtering */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
          mb: 2,
        }}
      >
        {/* Company Slicer */}
        <Autocomplete
          multiple
          options={companyOptions} // Company options for the dropdown
          value={selectedCompanies} // Currently selected companies
          onChange={handleCompanyFilterChange} // Handle selection changes
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Filter by Company"
              placeholder="Select Company"
            />
          )}
          sx={{
            width: 300, // Width of the slicer
          }}
        />

        {/* Status Slicer */}
        <Autocomplete
          multiple
          options={statusOptions} // Status options for the dropdown
          value={selectedStatuses} // Currently selected statuses
          onChange={handleStatusFilterChange} // Handle selection changes
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Filter by Status"
              placeholder="Select Status"
            />
          )}
          sx={{
            width: 300, // Width of the slicer
          }}
        />
      </Box>

      {/* Data Table for CRUD2 Form Data */}
      <Typography variant="h6" gutterBottom>
        CRUD2 Form Data
      </Typography>
      {error2 ? (
        <Typography color="error">{error2}</Typography>
      ) : (
        <div style={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={filteredData} // Use the filtered data for the table
            columns={[
              { field: "company", headerName: "Company", flex: 1, sortable: true },
              { field: "user", headerName: "User", flex: 1, sortable: true },
              { field: "date", headerName: "Date", flex: 1, sortable: true },
              {
                field: "status",
                headerName: "Status",
                flex: 1,
                renderCell: renderStatusCell, // Conditional formatting for status
                sortable: true,
              },
              { field: "updates", headerName: "Updates", flex: 2, sortable: true },
            ]}
            pageSize={10} // Number of rows per page
            rowsPerPageOptions={[5, 10, 20]} // Pagination options
            checkboxSelection // Enable row selection with checkboxes
            disableSelectionOnClick
            sortingOrder={["asc", "desc"]} // Enable ascending and descending sorting
          />
        </div>
      )}
    </Paper>
  );
}

export default Dashboard;