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
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ViewListIcon from "@mui/icons-material/ViewList";
import AppsIcon from "@mui/icons-material/Apps";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import '../index.css'; // Importing the global styles


function CrudForm() {
  const [formData, setFormData] = useState(initialFormState());
  const [data, setData] = useState([]); // Stores data fetched from the backend
  const [isEditing, setIsEditing] = useState(false);
  const [viewMode, setViewMode] = useState("table");
  const [showForm, setShowForm] = useState(false);

  const API_URL = "http://localhost:5000/api/crudForm";

  function initialFormState() {
    return {
      id: null,
      companyName: "",
      location: "",
      address: "",
      contactPerson: "",
      contactNumber: "",
      email: "",
    };
  }

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL);
      const fetchedData = response.data.map((item) => ({
        ...item,
        id: item.id || Date.now() + Math.random(), // Ensure every item has a unique id
      }));
      setData(fetchedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      {[
        { label: "Company Name", name: "companyName",headerClassName: 'dataGridHeader' },
        { label: "Location", name: "location" ,headerClassName: 'dataGridHeader' },
        { label: "Address", name: "address",headerClassName: 'dataGridHeader' },
        { label: "Contact Person", name: "contactPerson",headerClassName: 'dataGridHeader' },
        { label: "Contact Number", name: "contactNumber",headerClassName: 'dataGridHeader' },
        { label: "Email", name: "email",headerClassName: 'dataGridHeader' },
      ].map((field) => (
        <Grid item xs={12} sm={6} md={4} key={field.name}>
          <TextField
            label={field.label}
            name={field.name}
            value={formData[field.name]}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
          />
        </Grid>
      ))}
    </Grid>
  );

  return (
    <div style={{ marginTop: '80px' }}> {/* Adjust this value as necessary */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom>
          COMPANIES
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
            <Button variant="contained" color="primary" type="submit" sx={{ mt: 2, mr: 2 }}>
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
                  { field: "companyName", headerName: "Company Name", flex: 1 },
                  { field: "location", headerName: "Location", flex: 1 },
                  { field: "address", headerName: "Address", flex: 1 },
                  { field: "contactPerson", headerName: "Contact Person", flex: 1 },
                  { field: "contactNumber", headerName: "Contact Number", flex: 1 },
                  { field: "email", headerName: "Email", flex: 1 },
                  {
                    field: "actions",
                    headerName: "Actions",
                    renderCell: (params) => (
                      <>
                        <IconButton onClick={() => handleEdit(params.row)} color="primary">
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(params.row.id)} color="secondary">
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
                      <Typography variant="h6">{item.companyName}</Typography>
                      <Typography variant="body2">Location: {item.location}</Typography>
                      <Typography variant="body2">Address: {item.address}</Typography>
                      <Typography variant="body2">
                        Contact Person: {item.contactPerson}
                      </Typography>
                      <Typography variant="body2">
                        Contact Number: {item.contactNumber}
                      </Typography>
                      <Typography variant="body2">Email: {item.email}</Typography>
                    </CardContent>
                    <CardActions>
                      <IconButton onClick={() => handleEdit(item)} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(item.id)} color="secondary">
                        <DeleteIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ))}
      </Paper>
    </div>
  );
}

export default CrudForm;