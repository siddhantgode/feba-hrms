import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore"; // Firestore methods
import db from "../firebase"; // Firebase configuration
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import TableChartIcon from "@mui/icons-material/TableChart";
import { DataGrid } from "@mui/x-data-grid"; // Material-UI Data Grid
import {
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material"; // Material-UI Components
import EditIcon from "@mui/icons-material/Edit"; // Edit icon
import DeleteIcon from "@mui/icons-material/Delete"; // Delete icon

function CompaniesList() {
  const [companies, setCompanies] = useState([]); // State to store fetched data
  const [loading, setLoading] = useState(true); // Loading state
  const [showForm, setShowForm] = useState(false); // Show/Hide form
  const [formData, setFormData] = useState({
    companyName: "",
    location: "",
    contactPerson: "",
    email: "",
  }); // Form state for both adding and editing
  const [isEditing, setIsEditing] = useState(false); // To track if the form is in edit mode
  const [editId, setEditId] = useState(null); // ID of the company being edited
  const [searchText, setSearchText] = useState(""); // Search input state
  const [filteredCompanies, setFilteredCompanies] = useState([]); // Filtered companies for the grid
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // State to show/hide the delete confirmation dialog
  const [deleteId, setDeleteId] = useState(null); // ID of the company to be deleted
  const [isGridView, setIsGridView] = useState(true); // State to toggle between Grid View and Card View
  // Fetch data from Firestore
  const fetchCompanies = async () => {
    try {
      const companiesCollection = collection(db, "companies"); // Reference to the collection
      const querySnapshot = await getDocs(companiesCollection); // Fetch all documents
      const companiesData = querySnapshot.docs.map((doc) => ({
        id: doc.id, // Use Firestore document ID as the unique `id`
        ...doc.data(), // Document data
      }));
      setCompanies(companiesData); // Update state with fetched data
      setFilteredCompanies(companiesData); // Initialize filtered data
      setLoading(false); // Set loading to false
    } catch (error) {
      console.error("Error fetching companies:", error); // Handle errors
      setLoading(false);
    }
  };

  // Add or update company in Firestore
  const handleFormSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    if (isEditing) {
      // Update existing company
      try {
        const companyDoc = doc(db, "companies", editId); // Reference to the document
        await updateDoc(companyDoc, formData); // Update the document
        setCompanies((prev) =>
          prev.map((company) => (company.id === editId ? { ...company, ...formData } : company))
        ); // Update state
        setFilteredCompanies((prev) =>
          prev.map((company) => (company.id === editId ? { ...company, ...formData } : company))
        ); // Update filtered state
        setIsEditing(false); // Reset edit mode
        setEditId(null); // Reset edit ID
        setShowForm(false); // Hide form
        setFormData({ companyName: "", location: "", contactPerson: "", email: "" }); // Reset form data
        console.log("Company updated with ID:", editId);
      } catch (error) {
        console.error("Error updating company:", error);
      }
    } else {
      // Add new company
      try {
        const companiesCollection = collection(db, "companies"); // Reference to the collection
        const docRef = await addDoc(companiesCollection, formData); // Add new document
        const newCompany = { id: docRef.id, ...formData }; // Add the document ID to the new company
        setCompanies((prev) => [...prev, newCompany]); // Update the list of companies
        setFilteredCompanies((prev) => [...prev, newCompany]); // Update filtered companies as well
        setFormData({ companyName: "", location: "", contactPerson: "", email: "" }); // Reset form data
        setShowForm(false); // Hide form
        console.log("New company added with ID:", docRef.id);
      } catch (error) {
        console.error("Error adding company:", error);
      }
    }
  };

  // Handle delete
  const handleDeleteCompany = async () => {
    try {
      const companyDoc = doc(db, "companies", deleteId); // Reference to the document
      await deleteDoc(companyDoc); // Delete the document
      setCompanies((prev) => prev.filter((company) => company.id !== deleteId)); // Update state
      setFilteredCompanies((prev) => prev.filter((company) => company.id !== deleteId)); // Update filtered state
      setOpenDeleteDialog(false); // Close the delete dialog
      setDeleteId(null); // Reset deleteId
      console.log("Company deleted with ID:", deleteId);
    } catch (error) {
      console.error("Error deleting company:", error);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value })); // Update form state
  };

  // Search functionality
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filteredData = companies.filter((company) =>
      Object.values(company) // Convert all values of the company object into an array
        .join(" ") // Join values into a single string
        .toLowerCase()
        .includes(value) // Check if the search text is included
    );
    setFilteredCompanies(filteredData); // Update the filtered companies
  };

  // Open the form for editing with pre-filled data
  const handleEditClick = (row) => {
    setFormData(row); // Populate the form with the row's data
    setIsEditing(true); // Set edit mode
    setEditId(row.id); // Set the ID of the row being edited
    setShowForm(true); // Show the form
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchCompanies();
  }, []);

  // Define columns for the Data Grid
  const columns = [
    { field: "companyName", headerName: "Company Name", flex: 1, sortable: true },
    { field: "location", headerName: "Location", flex: 1, sortable: true },
    { field: "contactPerson", headerName: "Contact Person", flex: 1, sortable: true },
    { field: "email", headerName: "Email", flex: 1, sortable: true },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <div className="d-flex gap-2">
          <IconButton
            color="primary"
            onClick={() => handleEditClick(params.row)} // Open the form for editing
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="secondary"
            onClick={() => {
              setDeleteId(params.row.id); // Set the ID for deletion
              setOpenDeleteDialog(true); // Open the delete confirmation dialog
            }}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

 return (
  <div className="p-4" style={{ marginTop: "40px", padding: "20px" }}>
    <h1 className="text-2xl font-bold mb-4">Companies</h1>
    {loading ? (
      <p>Loading...</p>
    ) : (
      <>
        {/* Form */}
        {showForm && (
          <form onSubmit={handleFormSubmit} className="mb-4">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="companyName" className="form-label">
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="form-control"
                  id="companyName"
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="location" className="form-label">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="form-control"
                  id="location"
                  required
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="contactPerson" className="form-label">
                  Contact Person
                </label>
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                  className="form-control"
                  id="contactPerson"
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-control"
                  id="email"
                  required
                />
              </div>
            </div>
            <div className="d-flex gap-3">
              <button type="submit" className="btn btn-primary">
                {isEditing ? "Update Company" : "Add Company"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setIsEditing(false);
                  setEditId(null);
                  setFormData({ companyName: "", location: "", contactPerson: "", email: "" });
                }}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Show Buttons, Search Bar, and Grid/Table only when the form is not active */}
        {!showForm && (
          <>
            {/* Buttons Row */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              {/* Add New Company Button */}
              <Button
                variant="contained"
                color="primary"
                onClick={() => setShowForm(true)} // Show the form for adding a new company
              >
                Add New Company
              </Button>

             
{/* Toggle View Buttons */}
<div className="d-flex mb-4">
        {/* Grid View Button */}
        <IconButton
          color={isGridView ? "primary" : "default"} // Active: Purple, Inactive: Grey
          onClick={() => setIsGridView(true)} // Switch to Grid View
          className="me-2" // Adds spacing between buttons
        >
          <TableChartIcon />
        </IconButton>

        {/* Kanban View Button */}
        <IconButton
          color={!isGridView ? "primary" : "default"} // Active: Purple, Inactive: Grey
          onClick={() => setIsGridView(false)} // Switch to Kanban View
        >
          <ViewKanbanIcon />
        </IconButton>
</div>
            </div>

            {/* Search Bar */}
            <TextField
              label="Search"
              variant="outlined"
              value={searchText}
              onChange={handleSearch}
              fullWidth
              className="mb-4"
            />

            {/* Grid or Card View */}
            {isGridView ? (
              // Data Grid View 
              <div style={{ height: 400, width: "100%" }}>
                <DataGrid
                  rows={filteredCompanies} // Use filtered rows
                  columns={columns} // Column definitions
                  pageSize={5} // Rows per page
                  rowsPerPageOptions={[5, 10, 20]} // Pagination options
                  disableSelectionOnClick // Disable row selection on click
                  sortingOrder={["asc", "desc"]} // Enable sorting
                  getRowId={(row) => row.id || `${row.companyName}-${Math.random()}`} // Generate unique ID if missing
                />
              </div>
            ) : (
              // Card View
              <div className="row">
                {filteredCompanies.map((company) => (
                  <div className="col-md-4 mb-4" key={company.id}>
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title text-primary">{company.companyName}</h5>
                        <p className="card-text">
                          <strong>Location:</strong> {company.location}
                        </p>
                        <p className="card-text">
                          <strong>Contact:</strong> {company.contactPerson}
                        </p>
                        <p className="card-text">
                          <strong>Email:</strong> {company.email}
                        </p>
                        <div className="d-flex gap-2">
                          <Button
                            variant="contained"
                            size="small"
                            color="primary"
                            onClick={() => handleEditClick(company)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            color="secondary"
                            onClick={() => {
                              setDeleteId(company.id);
                              setOpenDeleteDialog(true);
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <p>Are you sure you want to delete this company?</p>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleDeleteCompany}
              color="secondary"
              variant="contained"
            >
              Yes, Delete
            </Button>
            <Button
              onClick={() => setOpenDeleteDialog(false)}
              color="primary"
              variant="contained"
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </>
    )}
  </div>
);
}

export default CompaniesList;