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
import axios from "axios"; // Still included but will not be used
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import db from "../firebase"; // Import Firestore instance
import "../index.css"; // Importing the global styles

function CrudForm() {
  const [formData, setFormData] = useState(initialFormState());
  const [data, setData] = useState([]); // Stores data fetched from Firestore
  const [isEditing, setIsEditing] = useState(false);
  const [viewMode, setViewMode] = useState("table");
  const [showForm, setShowForm] = useState(false);

  const API_URL = "http://localhost:5000/api/crudForm"; // Kept for reference but will not be used
  const companiesCollectionRef = collection(db, "companies"); // Reference to the Firestore collection

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
      console.log("Fetching companies from Firestore...");
      const querySnapshot = await getDocs(companiesCollectionRef);
      
      const fetchedData = querySnapshot.docs.map((doc) => ({
        id: doc.id, // Use Firestore document ID as the unique `id`
        ...doc.data(), // Spread the rest of the document data
      }));
  
      console.log("Fetched data:", fetchedData); // Debug: Verify all rows have `id`
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

    const record = { ...formData };

    if (isEditing) {
      // **Update existing record**
      try {
        console.log("Updating record with id:", record.id);
        const docRef = doc(db, "companies", record.id); // Reference Firestore document by `id`
        await updateDoc(docRef, {
          companyName: record.companyName,
          location: record.location,
          address: record.address,
          contactPerson: record.contactPerson,
          contactNumber: record.contactNumber,
          email: record.email,
        });
        setData((prevData) =>
          prevData.map((item) => (item.id === record.id ? record : item)) // Update local state
        );
        console.log(`Updated record with id: ${record.id}`);
      } catch (error) {
        console.error("Error updating data:", error);
      }
    } else {
      // **Add a new record**
      try {
        console.log("Adding new record:", record);
        const docRef = await addDoc(companiesCollectionRef, record); // Add a new Firestore document
        setData((prevData) => [...prevData, { id: docRef.id, ...record }]); // Add to local state
        console.log(`Added new record with id: ${docRef.id}`);
      } catch (error) {
        console.error("Error adding data:", error);
      }
    }

    setFormData(initialFormState());
    setIsEditing(false);
    setShowForm(false);
  };

  const handleEdit = (item) => {
    console.log("Editing record:", item);
    setFormData(item); // Ensure `id` is set in `formData`
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      console.log("Deleting record with id:", id);
      const docRef = doc(db, "companies", id); // Reference to the Firestore document
      await deleteDoc(docRef); // Delete the document
      setData((prevData) => prevData.filter((item) => item.id !== id)); // Update local state
      console.log(`Deleted record with id: ${id}`);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const renderFormFields = () => (
    <Grid container spacing={2}>
      {[
        { label: "Company Name", name: "companyName" },
        { label: "Location", name: "location" },
        { label: "Address", name: "address" },
        { label: "Contact Person", name: "contactPerson" },
        { label: "Contact Number", name: "contactNumber" },
        { label: "Email", name: "email" },
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
    <div style={{ marginTop: "80px" }}>
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
                      <Typography variant="h6">{item.companyName}</Typography>
                      <Typography variant="body2">
                        Location: {item.location}
                      </Typography>
                      <Typography variant="body2">
                        Address: {item.address}
                      </Typography>
                      <Typography variant="body2">
                        Contact Person: {item.contactPerson}
                      </Typography>
                      <Typography variant="body2">
                        Contact Number: {item.contactNumber}
                      </Typography>
                      <Typography variant="body2">Email: {item.email}</Typography>
                    </CardContent>
                    <CardActions>
                      <IconButton
                        onClick={() => handleEdit(item)}
                        color="primary"
                      >
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
    </div>
  );
}

export default CrudForm;