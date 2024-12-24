import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Paper,
  Typography,
  Button,
  Grid,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false); // Controls whether to show the form or DataGrid
  const [currentUser, setCurrentUser] = useState({
    id: null,
    name: "",
    contactNumber: "",
    email: "",
    dob: "",
    gender: "",
    pan: "",
    aadhar: "",
    education: "",
    passport: "",
    visaType: "",
    consultantType: "",
    ctc: "",
    etc: "",
    rateClosed: "",
    photo: null, // New field to store the uploaded photo
    panPhoto: null, // New field to store the uploaded PAN photo
  });
  const [photoPreview, setPhotoPreview] = useState(null); // Preview of the uploaded photo
  const [panPhotoPreview, setPanPhotoPreview] = useState(null); // Preview of the uploaded PAN photo

  const API_URL = "http://localhost:5000/api/users";

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users from the backend
  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_URL);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error.response?.data || error.message);
      alert("Failed to fetch users. Check the backend server.");
    }
  };

  // Toggle visibility of the form
  const handleFormVisibility = (visibility) => {
    setIsFormVisible(visibility);
    if (!visibility) {
      // Reset form fields when returning to DataGrid
      setCurrentUser({
        id: null,
        name: "",
        contactNumber: "",
        email: "",
        dob: "",
        gender: "",
        pan: "",
        aadhar: "",
        education: "",
        passport: "",
        visaType: "",
        consultantType: "",
        ctc: "",
        etc: "",
        rateClosed: "",
        photo: null,
        panPhoto: null,
      });
      setPhotoPreview(null);
      setPanPhotoPreview(null);
    }
  };

  // Handle photo upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCurrentUser((prev) => ({ ...prev, photo: file }));
      setPhotoPreview(URL.createObjectURL(file)); // Generate a preview URL for the photo
    }
  };

  // Handle PAN photo upload
  const handlePanPhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCurrentUser((prev) => ({ ...prev, panPhoto: file }));
      setPanPhotoPreview(URL.createObjectURL(file)); // Generate a preview URL for the PAN photo
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!currentUser.name || !currentUser.contactNumber || !currentUser.email || !currentUser.dob || !currentUser.gender) {
      alert("Please fill in all required fields!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", currentUser.name);
      formData.append("contactNumber", currentUser.contactNumber);
      formData.append("email", currentUser.email);
      formData.append("dob", currentUser.dob);
      formData.append("gender", currentUser.gender);
      formData.append("pan", currentUser.pan);
      formData.append("aadhar", currentUser.aadhar);
      formData.append("education", currentUser.education);
      formData.append("passport", currentUser.passport);
      formData.append("visaType", currentUser.visaType);
      formData.append("consultantType", currentUser.consultantType);
      formData.append("ctc", currentUser.ctc);
      formData.append("etc", currentUser.etc);
      formData.append("rateClosed", currentUser.rateClosed);

      if (currentUser.photo) {
        formData.append("photo", currentUser.photo); // Attach the photo file
      }
      if (currentUser.panPhoto) {
        formData.append("panPhoto", currentUser.panPhoto); // Attach the PAN photo file
      }

      if (currentUser.id) {
        // Update existing user
        await axios.put(`${API_URL}/${currentUser.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setUsers((prev) =>
          prev.map((user) => (user.id === currentUser.id ? { ...user, ...currentUser } : user))
        );
      } else {
        // Create new user
        const response = await axios.post(API_URL, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setUsers((prev) => [...prev, response.data]);
      }

      handleFormVisibility(false); // Show DataGrid after submission
    } catch (error) {
      console.error("Error submitting user:", error.response?.data || error.message);
      alert(
        `Failed to save user. ${
          error.response?.data?.error || "Check the backend server."
        }`
      );
    }
  };

  // Handle input change in form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle user deletion
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setUsers((prev) => prev.filter((user) => user.id !== id)); // Remove the user from the list
    } catch (error) {
      console.error("Error deleting user:", error.response?.data || error.message);
      alert("Failed to delete user. Check the backend server.");
    }
  };

  // Define DataGrid columns
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "contactNumber", headerName: "Contact Number", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "dob", headerName: "DOB", width: 120 },
    { field: "gender", headerName: "Gender", width: 100 },
    { field: "pan", headerName: "PAN", width: 120 },
    { field: "aadhar", headerName: "Aadhar", width: 150 },
    { field: "education", headerName: "Education", width: 150 },
    { field: "passport", headerName: "Passport", width: 100 },
    { field: "visaType", headerName: "Visa Type", width: 150 },
    { field: "consultantType", headerName: "Consultant/FTE", width: 150 },
    { field: "ctc", headerName: "CTC", width: 120 },
    { field: "etc", headerName: "ETC", width: 120 },
    { field: "rateClosed", headerName: "Rate Closed", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton color="primary" onClick={() => handleFormVisibility(true) && setCurrentUser(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton color="secondary" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
      {!isFormVisible ? (
        <>
          {/* DataGrid View */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h5" gutterBottom>
              Users
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleFormVisibility(true)}
            >
              Add New
            </Button>
          </div>
          <div style={{ height: 600, width: "100%" }}>
            <DataGrid
              rows={users}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 20, 50]}
              checkboxSelection
              disableSelectionOnClick
              getRowId={(row) => row.id ?? `${row.name}-${row.contactNumber}`}
            />
          </div>
        </>
      ) : (
        <>
          {/* Form View */}
          <Typography variant="h6" gutterBottom>
            {currentUser.id ? "Edit User" : "Add New User"}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={currentUser.name}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Number"
                name="contactNumber"
                value={currentUser.contactNumber}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={currentUser.email}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date of Birth"
                name="dob"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={currentUser.dob}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Select
                fullWidth
                name="gender"
                value={currentUser.gender}
                onChange={handleInputChange}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="PAN"
                name="pan"
                value={currentUser.pan}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Aadhar"
                name="aadhar"
                value={currentUser.aadhar}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Education"
                name="education"
                value={currentUser.education}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Select
                fullWidth
                name="passport"
                value={currentUser.passport}
                onChange={handleInputChange}
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Visa Type"
                name="visaType"
                value={currentUser.visaType}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Select
                fullWidth
                name="consultantType"
                value={currentUser.consultantType}
                onChange={handleInputChange}
              >
                <MenuItem value="Consultant">Consultant</MenuItem>
                <MenuItem value="FTE">FTE</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="CTC"
                name="ctc"
                value={currentUser.ctc}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="ETC"
                name="etc"
                value={currentUser.etc}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Rate Closed"
                name="rateClosed"
                value={currentUser.rateClosed}
                onChange={handleInputChange}
              />
            </Grid>
            {/* Upload Photo and PAN Buttons */}
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" gutterBottom>
                Upload Photo
              </Typography>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handlePhotoUpload}
              />
              <label htmlFor="photo-upload">
                <Button variant="contained" component="span" color="primary">
                  Choose File
                </Button>
              </label>
              <input
                id="pan-upload"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handlePanPhotoUpload}
              />
              <label htmlFor="pan-upload">
                <Button variant="contained" component="span" color="secondary">
                  Upload PAN
                </Button>
              </label>
              {photoPreview && (
                <img
                  src={photoPreview}
                  alt="Photo Preview"
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    marginTop: "10px",
                  }}
                />
              )}
              {panPhotoPreview && (
                <img
                  src={panPhotoPreview}
                  alt="PAN Photo Preview"
                  style={{
                    width: "100px",
                    height: "100px",
                    marginTop: "10px",
                  }}
                />
              )}
            </Grid>
          </Grid>
          <div style={{ marginTop: 20 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              sx={{ marginRight: 2 }}
            >
              {currentUser.id ? "Save Changes" : "Add User"}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => handleFormVisibility(false)}
            >
              Cancel
            </Button>
          </div>
        </>
      )}
    </Paper>
  );
};

export default Users;