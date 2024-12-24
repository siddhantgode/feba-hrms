import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  Card,
  CardContent,
  CardActions,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ViewListIcon from "@mui/icons-material/ViewList";
import AppsIcon from "@mui/icons-material/Apps";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";

function CRUD2Form() {
  const [formData, setFormData] = useState(initialFormState());
  const [data, setData] = useState([]); // Stores data fetched from the backend
  const [userOptions, setUserOptions] = useState([]); // Stores users from users.json
  const [isEditing, setIsEditing] = useState(false);
  const [viewMode, setViewMode] = useState("table");
  const [showForm, setShowForm] = useState(false);

  const API_URL = "http://localhost:5000/api/crud2Form"; // Backend API endpoint for CRUD2 data
  const USER_JSON_PATH = "/users.json"; // Path to the users.json file in the public directory

  function initialFormState() {
    return {
      id: null,
      date: "",
      company: "",
      requirement: "",
      user: "", // Default empty user
      status: "", // Default empty status
      updates: "",
    };
  }

  useEffect(() => {
    fetchData();
    fetchUserOptions(); // Load user options from users.json
  }, []);

  // Fetch CRUD2 data
  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL);
      const fetchedData = response.data.map((item) => ({
        ...item,
        id: item.id || Date.now() + Math.random(), // Ensure every item has a unique id
      }));
      setData(fetchedData);
    } catch (error) {
      console.error("Error fetching CRUD2 data:", error);
    }
  };

  // Fetch user options from users.json
  const fetchUserOptions = async () => {
    try {
      const response = await fetch("http://localhost:5000/users.json");
      if (!response.ok) {
        throw new Error(`Failed to fetch users.json: ${response.status}`);
      }
  
      const users = await response.json();
      console.log("Fetched users:", users); // Debug fetched users
      setUserOptions(users); // Set the fetched users to the state
    } catch (error) {
      console.error("Error fetching user options:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUserChange = (event) => {
    setFormData((prev) => ({ ...prev, user: event.target.value })); // Update the user in the formData
  };

  const handleStatusChange = (event) => {
    setFormData((prev) => ({ ...prev, status: event.target.value })); // Update the status in the formData
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const record = { ...formData, id: formData.id || Date.now() };

    if (isEditing) {
      try {
        await axios.put(`${API_URL}/${record.id}`, record);
        setData((prevData) =>
          prevData.map((item) => (item.id === record.id ? record : item))
        );
      } catch (error) {
        console.error("Error updating data:", error);
      }
    } else {
      try {
        const response = await axios.post(API_URL, record);
        setData((prevData) => [...prevData, response.data]);
      } catch (error) {
        console.error("Error adding data:", error);
      }
    }

    setFormData(initialFormState());
    setIsEditing(false);
    setShowForm(false);
  };

  const handleEdit = (item) => {
    setFormData(item);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setData((prevData) => prevData.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const renderFormFields = () => (
    <Grid container spacing={2}>
      {/* Date */}
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label="Date"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
          fullWidth
          margin="dense"
        />
      </Grid>

      {/* Company */}
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label="Company"
          name="company"
          value={formData.company}
          onChange={handleInputChange}
          fullWidth
          margin="dense"
        />
      </Grid>

      {/* Requirement */}
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label="Requirement"
          name="requirement"
          value={formData.requirement}
          onChange={handleInputChange}
          fullWidth
          margin="dense"
        />
      </Grid>

      {/* User (Dropdown) */}
      <Grid item xs={12} sm={6} md={4}>
        <FormControl fullWidth margin="dense">
          <InputLabel>User</InputLabel>
          <Select
            value={formData.user}
            onChange={handleUserChange}
            label="User"
            name="user"
          >
            {userOptions.length > 0 ? (
              userOptions.map((user, index) => (
                <MenuItem key={`${user.name}-${index}`} value={user.name}>
                  {user.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No Users Available</MenuItem>
            )}
          </Select>
        </FormControl>
      </Grid>

      {/* Status (Dropdown) */}
      <Grid item xs={12} sm={6} md={4}>
        <FormControl fullWidth margin="dense">
          <InputLabel>Status</InputLabel>
          <Select
            value={formData.status}
            onChange={handleStatusChange}
            label="Status"
            name="status"
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* Updates */}
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label="Updates"
          name="updates"
          value={formData.updates}
          onChange={handleInputChange}
          fullWidth
          margin="dense"
        />
      </Grid>
    </Grid>
  );

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Engagements
      </Typography>

      {!showForm && (
        <Grid container justifyContent="space-between" sx={{ mb: 2 }}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, newView) => setViewMode(newView || viewMode)}
          >
            <ToggleButton value="table">
              <ViewListIcon />
              Data Grid
            </ToggleButton>
            <ToggleButton value="card">
              <AppsIcon />
              Card View
            </ToggleButton>
          </ToggleButtonGroup>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setShowForm(true)}
          >
            Add New Record
          </Button>
        </Grid>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
          {renderFormFields()}
          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{ mt: 2, mr: 2 }}
          >
            {isEditing ? "Update" : "Add"}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            sx={{ mt: 2 }}
            onClick={() => {
              setFormData(initialFormState());
              setIsEditing(false);
              setShowForm(false);
            }}
          >
            Cancel
          </Button>
        </form>
      )}

      {!showForm &&
        (viewMode === "table" ? (
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={data}
              columns={[
                { field: "date", headerName: "Date", flex: 1 },
                { field: "company", headerName: "Company", flex: 1 },
                { field: "requirement", headerName: "Requirement", flex: 1 },
                { field: "user", headerName: "User", flex: 1 },
                { field: "status", headerName: "Status", flex: 1 },
                { field: "updates", headerName: "Updates", flex: 1 },
                {
                  field: "actions",
                  headerName: "Actions",
                  renderCell: (params) => (
                    <>
                      <IconButton
                        onClick={() => handleEdit(params.row)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(params.row.id)}
                        color="secondary"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  ),
                },
              ]}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              disableSelectionOnClick
              getRowId={(row) => row.id}
            />
          </div>
        ) : (
          <Grid container spacing={2}>
            {data.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6">{item.date}</Typography>
                    <Typography variant="body2">
                      Company: {item.company}
                    </Typography>
                    <Typography variant="body2">
                      Requirement: {item.requirement}
                    </Typography>
                    <Typography variant="body2">User: {item.user}</Typography>
                    <Typography variant="body2">
                      Status: {item.status}
                    </Typography>
                    <Typography variant="body2">
                      Updates: {item.updates}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <IconButton onClick={() => handleEdit(item)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(item.id)}
                      color="secondary"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ))}
    </Paper>
  );
}

export default CRUD2Form;