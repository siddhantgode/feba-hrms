import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import { DataGrid } from "@mui/x-data-grid"; // Import DataGrid
import axios from "axios";

function Engagements() {
  const [engagements, setEngagements] = useState([]);
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentEngagement, setCurrentEngagement] = useState({
    id: null,
    date: "",
    company: "",
    requirement: "",
    user: "",
    status: "Pending",
    updates: "",
  });
  const [engagementToDelete, setEngagementToDelete] = useState(null);
  const [isListView, setIsListView] = useState(true);

  const API_URL = "http://localhost:5000/api/engagements";

  // Centralized styling
  const styles = {
    container: {
      padding: 2,
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    dialog: {
      fullWidth: true,
      margin: "dense",
    },
  };

  // Fetch engagements when the component loads
  useEffect(() => {
    fetchEngagements();
  }, []);

  // Fetch all engagements from the API
  const fetchEngagements = async () => {
    try {
      const response = await axios.get(API_URL);
      setEngagements(response.data);
    } catch (error) {
      console.error("Error fetching engagements:", error);
      alert("Failed to fetch engagements. Please try again later.");
    }
  };

  // Open the dialog for adding or editing an engagement
  const handleOpen = (
    engagement = {
      id: null,
      date: "",
      company: "",
      requirement: "",
      user: "",
      status: "Pending",
      updates: "",
    }
  ) => {
    setCurrentEngagement(engagement);
    setOpen(true);
  };

  // Close the dialog and reset current engagement
  const handleClose = () => {
    setOpen(false);
    setCurrentEngagement({
      id: null,
      date: "",
      company: "",
      requirement: "",
      user: "",
      status: "Pending",
      updates: "",
    });
  };

  // Handle form submission for adding or updating an engagement
  const handleSubmit = async () => {
    try {
      if (currentEngagement.id) {
        // Update engagement
        const response = await axios.put(
          `${API_URL}/${currentEngagement.id}`,
          currentEngagement
        );
        setEngagements((prev) =>
          prev.map((engagement) =>
            engagement.id === currentEngagement.id ? response.data : engagement
          )
        );
      } else {
        // Add new engagement
        const response = await axios.post(API_URL, currentEngagement);
        setEngagements((prev) => [...prev, response.data]);
      }
      handleClose();
    } catch (error) {
      console.error("Error saving engagement:", error);
      alert("Failed to save engagement. Please check your input and try again.");
    }
  };

  // Open the delete confirmation dialog
  const handleDeleteDialogOpen = (engagement) => {
    setEngagementToDelete(engagement);
    setDeleteDialogOpen(true);
  };

  // Close the delete confirmation dialog
  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setEngagementToDelete(null);
  };

  // Handle deleting an engagement
  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/${engagementToDelete.id}`);
      setEngagements((prev) =>
        prev.filter((engagement) => engagement.id !== engagementToDelete.id)
      );
      handleDeleteDialogClose();
    } catch (error) {
      console.error("Error deleting engagement:", error);
      alert("Failed to delete engagement. Please try again.");
    }
  };

  // Define columns for the DataGrid
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "date", headerName: "Date", width: 150 },
    { field: "company", headerName: "Company", width: 200 },
    { field: "requirement", headerName: "Requirement", width: 200 },
    { field: "user", headerName: "User", width: 150 },
    { field: "status", headerName: "Status", width: 120 },
    { field: "updates", headerName: "Updates", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton
            onClick={() => handleOpen(params.row)}
            color="primary"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => handleDeleteDialogOpen(params.row)}
            color="secondary"
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Paper sx={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <Typography variant="h5">List of Engagements</Typography>
        <div>
          {/* Toggle between List and Kanban views */}
          <IconButton
            color={isListView ? "primary" : "default"}
            onClick={() => setIsListView(true)}
          >
            <ViewListIcon />
          </IconButton>
          <IconButton
            color={!isListView ? "primary" : "default"}
            onClick={() => setIsListView(false)}
          >
            <ViewKanbanIcon />
          </IconButton>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpen()}
          >
            Add New
          </Button>
        </div>
      </div>

      {/* Engagements List View */}
      {isListView ? (
        <div style={{ height: 500, width: "100%" }}>
          <DataGrid
            rows={engagements}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[5, 10, 20]}
            disableSelectionOnClick
            autoHeight
            getRowId={(row) => row.id || `${row.date}-${row.company}`} // Use `id` or generate a unique ID
          />
        </div>
      ) : (
        // Kanban View (unchanged)
        <div style={{ display: "flex", gap: "16px" }}>
          {/* Kanban columns */}
          {/* ... */}
        </div>
      )}

      {/* Dialogs */}
      {/* Add/Edit Engagement Dialog */}
      {/* Delete Confirmation Dialog */}
    </Paper>
  );
}

export default Engagements;