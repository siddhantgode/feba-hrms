import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import db from "../firebase"; // Firebase configuration
import { Button } from "@mui/material";

const KanbanView = () => {
  const [engagements, setEngagements] = useState([]); // Holds all engagements
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  const statuses = ["Pending", "In Progress", "Completed"]; // Define statuses for columns

  // Fetch engagements from Firestore
  const fetchEngagements = async () => {
    try {
      const engagementCollection = collection(db, "engagement"); // Reference to the collection
      const querySnapshot = await getDocs(engagementCollection);
      const fetchedData = querySnapshot.docs.map((doc) => ({
        id: doc.id, // Add document ID
        ...doc.data(), // Add document data
      }));
      setEngagements(fetchedData); // Update state with fetched data
      setLoading(false);
    } catch (err) {
      console.error("Error fetching engagements:", err); // Debugging: Log errors
      setError("Failed to fetch engagements."); // Set error state
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchEngagements();
  }, []);

  if (loading) {
    return <p>Loading...</p>; // Show loading indicator while fetching data
  }

  if (error) {
    return <p className="text-danger">{error}</p>; // Show error message if fetching fails
  }

  return (
    <div className="row" style={{ marginTop: "50px" }}>
      {statuses.map((status) => (
        <div className="col-md-4" key={status}>
          <div className="card">
            <div className="card-header text-center font-weight-bold">{status}</div>
            <div className="card-body">
              {engagements
                .filter((engagement) => engagement.status === status) // Filter by status
                .map((engagement) => (
                  <div className="card mb-3" key={engagement.id}>
                    <div className="card-body">
                      <h5 className="card-title text-primary">{engagement.company}</h5>
                      <p className="card-text">
                        <strong>Date:</strong> {engagement.date}
                      </p>
                      <p className="card-text">
                        <strong>User:</strong> {engagement.user}
                      </p>
                      <p className="card-text">
                        <strong>Requirement:</strong> {engagement.requirement}
                      </p>
                      <div className="d-flex gap-2">
                        <Button
                          variant="contained"
                          size="small"
                          color="primary"
                          onClick={() => console.log("Edit:", engagement)} // Placeholder for edit
                        >
                          Edit
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          color="secondary"
                          onClick={() => console.log("Delete:", engagement.id)} // Placeholder for delete
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              {/* Show message if no engagements exist for the status */}
              {engagements.filter((engagement) => engagement.status === status).length === 0 && (
                <p className="text-muted text-center">No engagements in this status.</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanView;