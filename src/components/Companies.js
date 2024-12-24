import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentCompany, setCurrentCompany] = useState({
    id: null,
    name: "",
    location: "",
    address: "",
    contactPerson: "",
    contactNumber: "",
    email: "",
    website: "",
  });
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [isListView, setIsListView] = useState(true);

  const API_URL = "http://localhost:5000/api/companies";

  // Fetch Data from Backend
  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(API_URL);
      setCompanies(response.data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  // Open Dialog
  const handleOpen = (company = { id: null, name: "", location: "", address: "", contactPerson: "", contactNumber: "", email: "", website: "" }) => {
    setCurrentCompany(company);
    setOpen(true);
  };

  // Close Dialog
  const handleClose = () => {
    setOpen(false);
    setCurrentCompany({
      id: null,
      name: "",
      location: "",
      address: "",
      contactPerson: "",
      contactNumber: "",
      email: "",
      website: "",
    });
  };

  // Add or Edit Company
  const handleSubmit = async () => {
    try {
      if (currentCompany.id) {
        const response = await axios.put(`${API_URL}/${currentCompany.id}`, currentCompany);
        setCompanies((prev) =>
          prev.map((comp) => (comp.id === currentCompany.id ? response.data : comp))
        );
      } else {
        const response = await axios.post(API_URL, currentCompany);
        setCompanies((prev) => [...prev, response.data]);
      }
      handleClose();
    } catch (error) {
      console.error("Error saving company:", error);
    }
  };

  // Delete a Company
  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/${companyToDelete.id}`);
      setCompanies((prev) => prev.filter((comp) => comp.id !== companyToDelete.id));
      handleDeleteDialogClose();
    } catch (error) {
      console.error("Error deleting company:", error);
    }
  };

  // Open Delete Dialog
  const handleDeleteDialogOpen = (company) => {
    setCompanyToDelete(company);
    setDeleteDialogOpen(true);
  };

  // Close Delete Dialog
  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setCompanyToDelete(null);
  };

  return (
    <Paper sx={{ p: 2 }}>
      {/* Page Title and Add Button */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <Typography variant="h5" gutterBottom>
          Companies
        </Typography>
        <div>
          <IconButton color={isListView ? "primary" : "default"} onClick={() => setIsListView(true)}>
            <ViewListIcon />
          </IconButton>
          <IconButton color={!isListView ? "primary" : "default"} onClick={() => setIsListView(false)}>
            <ViewModuleIcon />
          </IconButton>
          <Button variant="contained" color="primary" onClick={() => handleOpen()} sx={{ ml: 2 }}>
            Add New
          </Button>
        </div>
      </div>

      {/* List View */}
      {isListView ? (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Company Name</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Contact Person</TableCell>
                <TableCell>Contact Number</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Website</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {companies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell>{company.id}</TableCell>
                  <TableCell>{company.name}</TableCell>
                  <TableCell>{company.location}</TableCell>
                  <TableCell>{company.address}</TableCell>
                  <TableCell>{company.contactPerson}</TableCell>
                  <TableCell>{company.contactNumber}</TableCell>
                  <TableCell>{company.email}</TableCell>
                  <TableCell>{company.website}</TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => handleOpen(company)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="secondary" onClick={() => handleDeleteDialogOpen(company)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        // Card View
        <Grid container spacing={3}>
          {companies.map((company) => (
            <Grid item xs={12} sm={6} md={4} key={company.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {company.name}
                  </Typography>
                  <Typography color="textSecondary">Location: {company.location}</Typography>
                  <Typography color="textSecondary">Address: {company.address}</Typography>
                  <Typography color="textSecondary">Contact Person: {company.contactPerson}</Typography>
                  <Typography color="textSecondary">Phone: {company.contactNumber}</Typography>
                  <Typography color="textSecondary">Email: {company.email}</Typography>
                  <Typography color="textSecondary">Website: {company.website}</Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary" onClick={() => handleOpen(company)}>
                    Edit
                  </Button>
                  <Button size="small" color="secondary" onClick={() => handleDeleteDialogOpen(company)}>
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{currentCompany.id ? "Edit Company" : "Add New Company"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Company Name"
            type="text"
            fullWidth
            value={currentCompany.name}
            onChange={(e) => setCurrentCompany({ ...currentCompany, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Location"
            type="text"
            fullWidth
            value={currentCompany.location}
            onChange={(e) => setCurrentCompany({ ...currentCompany, location: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Address"
            type="text"
            fullWidth
            value={currentCompany.address}
            onChange={(e) => setCurrentCompany({ ...currentCompany, address: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Contact Person"
            type="text"
            fullWidth
            value={currentCompany.contactPerson}
            onChange={(e) => setCurrentCompany({ ...currentCompany, contactPerson: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Contact Number"
            type="text"
            fullWidth
            value={currentCompany.contactNumber}
            onChange={(e) => setCurrentCompany({ ...currentCompany, contactNumber: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={currentCompany.email}
            onChange={(e) => setCurrentCompany({ ...currentCompany, email: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Website"
            type="text"
            fullWidth
            value={currentCompany.website}
            onChange={(e) => setCurrentCompany({ ...currentCompany, website: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {currentCompany.id ? "Save Changes" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this company?</DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default Companies;