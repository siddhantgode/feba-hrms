import React, { useState, useEffect } from "react";
import { collection,onSnapshot, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import db from "../firebase"; // Your Firebase config
import { DataGrid } from "@mui/x-data-grid";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import KanbanView from "./KanbanView";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import TableChartIcon from "@mui/icons-material/TableChart";
import { TextField, IconButton } from "@mui/material"; // Import TextField and IconButton from Material-UI
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline"; // Import RemoveCircleOutlineIcon
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"; // Import AddCircleOutlineIcon
import { Button as BootstrapButton, OverlayTrigger, Popover } from "react-bootstrap"; // React Bootstrap components

function Engagement2() {
  const [engagements, setEngagements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    date: "",
    company: "",
    requirement: "",
    user: "",
    status: "",
    updates: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredEngagements, setFilteredEngagements] = useState([]);
  const [isGridView, setIsGridView] = useState(true);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Fetch engagements from Firestore
  const fetchEngagements = async () => {
    try {
      const engagementCollection = collection(db, "engagement");
      const querySnapshot = await getDocs(engagementCollection);
      const fetchedData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEngagements(fetchedData);
      setFilteredEngagements(fetchedData); // Initialize filtered engagements
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch engagements.");
      setLoading(false);
    }
  };

   // Real-time listener for Firestore collection
   useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "engagement"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEngagements(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching Firestore data:", error);
        setError("Failed to load data.");
        setLoading(false);
      }
    );

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  useEffect(() => {
    fetchEngagements();
  }, []);

  // Handle form submission
  // Handle form submission
const handleFormSubmit = async (e) => {
  e.preventDefault();

  // Include subFormRows (updates data) in the formData
  const updatedFormData = {
    ...formData,
    updates: subFormRows, // Add subform rows to the updates field
  };

  try {
    if (isEditing) {
      // Update engagement
      const engagementDoc = doc(db, "engagement", editId);
      await updateDoc(engagementDoc, updatedFormData);
      setEngagements((prev) =>
        prev.map((item) =>
          item.id === editId ? { id: editId, ...updatedFormData } : item
        )
      );
    } else {
      // Add new engagement
      const engagementCollection = collection(db, "engagement");
      const docRef = await addDoc(engagementCollection, updatedFormData);
      setEngagements((prev) => [...prev, { id: docRef.id, ...updatedFormData }]);
    }

    // Reset form after submission
    resetForm();
  } catch (error) {
    console.error("Error saving engagement:", error);
  }
};

   // Subform state
   const [openSubForm, setOpenSubForm] = useState(false);
   const [subFormRows, setSubFormRows] = useState([]);

    // Handle subform row changes
  const handleSubFormChange = (index, field, value) => {
    const updatedRows = [...subFormRows];
    updatedRows[index][field] = value;
    setSubFormRows(updatedRows);
  };

  // Add a new row to the subform
  const addSubFormRow = () => {
    setSubFormRows([...subFormRows, { candidate: "", status: "", remarks: "" }]);
  };

  // Remove a row from the subform
  const removeSubFormRow = (index) => {
    const updatedRows = subFormRows.filter((_, i) => i !== index);
    setSubFormRows(updatedRows);
  };

  // Open the subform dialog
  const handleOpenSubForm = () => {
    setSubFormRows([{ candidate: "", status: "", remarks: "" }]); // Start with one row
    setOpenSubForm(true);
  };

  // Close the subform dialog
  const handleCloseSubForm = () => {
    setOpenSubForm(false);
  };

  // Save subform data
  const handleSaveSubForm = () => {
    console.log("Saved Subform Data:", subFormRows);
    setOpenSubForm(false);
  };


  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Reset form
 // Reset form
const resetForm = () => {
  setFormData({
    date: "",
    company: "",
    requirement: "",
    user: "",
    status: "",
    updates: "",
  });
  setSubFormRows([]); // Clear subform rows
  setShowForm(false);
  setIsEditing(false);
  setEditId(null);
};

  // Handle search
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    setFilteredEngagements(
      engagements.filter(
        (engagement) =>
          engagement.company.toLowerCase().includes(value) ||
          engagement.requirement.toLowerCase().includes(value) ||
          engagement.user.toLowerCase().includes(value)
      )
    );
  };

  // Handle delete engagement
 // Handle delete engagement
const handleDeleteEngagement = async () => {
  try {
    // Reference the specific document in Firebase
    const engagementDoc = doc(db, "engagement", deleteId);

    // Delete the document from Firebase
    await deleteDoc(engagementDoc);

    // Update local state to reflect the deleted engagement
    setEngagements((prev) => prev.filter((item) => item.id !== deleteId));
    setFilteredEngagements((prev) => prev.filter((item) => item.id !== deleteId));

    // Close the delete confirmation dialog
    setOpenDeleteDialog(false);

    // Clear the deleteId state
    setDeleteId(null);
  } catch (error) {
    console.error("Error deleting engagement:", error);
    alert("Failed to delete the engagement. Please try again.");
  }
};

  // Handle edit button click
 // Handle edit button click
const handleEditClick = (engagement) => {
  try {
    // Prefill the form with the selected engagement's data
    setFormData({
      date: engagement.date || "",
      company: engagement.company || "",
      requirement: engagement.requirement || "",
      user: engagement.user || "",
      status: engagement.status || "",
      updates: engagement.updates || [],
    });

    // Prefill the subform rows for updates
    setSubFormRows(engagement.updates || []);

    // Set editing mode and track the current engagement's ID
    setIsEditing(true);
    setEditId(engagement.id);

    // Show the form for editing
    setShowForm(true);
  } catch (error) {
    console.error("Error preparing engagement for editing:", error);
    alert("Failed to load engagement for editing. Please try again.");
  }
};

  // DataGrid columns
  // DataGrid columns
  const columns = [
    { field: "date", headerName: "Date", flex: 1 },
    { field: "company", headerName: "Company", flex: 1 },
    { field: "requirement", headerName: "Requirement", flex: 1 },
    { field: "user", headerName: "User", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    {
      field: "updates",
      headerName: "Updates",
      flex: 1,
      renderCell: (params) => {
        const updates = params.row.updates || []; // Get all updates for the row
    
        return (
          <OverlayTrigger
            trigger="click"
            placement="right"
            overlay={
              <Popover id={`popover-${params.row.id}`}>
                <Popover.Header as="h3">Updates</Popover.Header>
                <Popover.Body>
                  {updates.length > 0 ? (
                    <div>
                      {updates.map((update, index) => (
                        <div key={index} className="mb-2">
                          <p>
                            <strong>Candidate:</strong> {update.candidate || "N/A"}
                          </p>
                          <p>
                            <strong>Status:</strong> {update.status || "N/A"}
                          </p>
                          <p>
                            <strong>Remarks:</strong> {update.remarks || "N/A"}
                          </p>
                          <hr />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No updates available</p>
                  )}
                </Popover.Body>
              </Popover>
            }
          >
            <BootstrapButton variant="info" size="sm">
              View Updates
            </BootstrapButton>
          </OverlayTrigger>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <div className="d-flex gap-2">
          {/* Edit Button */}
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleEditClick(params.row)} // Use params.row
          >
            Edit
          </Button>
          {/* Delete Button */}
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={() => {
              setDeleteId(params.row.id); // Use params.row.id
              setOpenDeleteDialog(true); // Open the confirmation dialog
            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  

  return (
    <div className="p-4" style={{ marginTop: "40px", padding: "20px" }}>
      <h1 className="text-2xl font-bold mb-4">Interviews</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Form */}
          {showForm && (
            <form onSubmit={handleFormSubmit} className="mb-4">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="date" className="form-label">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="form-control"
                    id="date"
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="company" className="form-label">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="form-control"
                    id="company"
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="requirement" className="form-label">
                    Requirement
                  </label>
                  <input
                    type="text"
                    name="requirement"
                    value={formData.requirement}
                    onChange={handleInputChange}
                    className="form-control"
                    id="requirement"
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="user" className="form-label">
                    User
                  </label>
                  <input
                    type="text"
                    name="user"
                    value={formData.user}
                    onChange={handleInputChange}
                    className="form-control"
                    id="user"
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="status" className="form-label">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="form-control"
                    id="status"
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="updates" className="form-label">
                    Updates
                  </label>
                  <textarea
                    name="updates"
                    value={formData.updates}
                    onChange={handleInputChange}
                    className="form-control"
                    id="updates"
                    rows="3"
                  ></textarea>
                </div>
              </div>
  
              {/* Updates Subform */}
              <div className="mb-4">
                <h5>Updates</h5>
                {subFormRows.map((row, index) => (
                  <div key={index} className="d-flex align-items-center mb-2">
                    <TextField
                      label="Candidate"
                      value={row.candidate}
                      onChange={(e) =>
                        handleSubFormChange(index, "candidate", e.target.value)
                      }
                      className="me-2"
                      fullWidth
                    />
                    <TextField
                      label="Status"
                      value={row.status}
                      onChange={(e) =>
                        handleSubFormChange(index, "status", e.target.value)
                      }
                      className="me-2"
                      fullWidth
                    />
                    <TextField
                      label="Remarks"
                      value={row.remarks}
                      onChange={(e) =>
                        handleSubFormChange(index, "remarks", e.target.value)
                      }
                      className="me-2"
                      fullWidth
                    />
                    <IconButton
                      color="secondary"
                      onClick={() => removeSubFormRow(index)}
                    >
                      <RemoveCircleOutlineIcon />
                    </IconButton>
                  </div>
                ))}
                <Button
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={addSubFormRow}
                  variant="outlined"
                  color="primary"
                >
                  Add Row
                </Button>
              </div>
  
              <div className="d-flex gap-3">
                <button type="submit" className="btn btn-primary">
                  {isEditing ? "Update Engagement" : "Add Engagement"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
  
          {/* Show Table or Kanban View */}
          {!showForm && (
            <>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setShowForm(true)}
                >
                  New Engagement
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => setIsGridView(!isGridView)} // Toggle between views
                >
                  {isGridView ? (
                    <>
                      <ViewKanbanIcon style={{ marginRight: 5 }} />
                      <TableChartIcon />
                    </>
                  ) : (
                    <>
                      <TableChartIcon style={{ marginRight: 5 }} />
                      <ViewKanbanIcon />
                    </>
                  )}
                </Button>
              </div>
  
              <input
                type="text"
                placeholder="Search"
                value={searchText}
                onChange={handleSearch}
                className="form-control mb-4"
              />
  
              {isGridView ? (
                <div style={{ height: 400, width: "100%" }}>
                  <DataGrid
                    rows={filteredEngagements}
                    columns={columns}
                    pageSize={5}
                    disableSelectionOnClick
                  />
                </div>
              ) : (
                <KanbanView /> // Use KanbanView for Kanban mode
              )}
            </>
          )}
  
          <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              <p>Are you sure you want to delete this engagement?</p>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleDeleteEngagement}
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

export default Engagement2;