import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import { collection, onSnapshot } from "firebase/firestore";
import db from "../firebase"; // Path to your firebase.js file

import "../index.css"; // Global styles
import EngagementTable from "./dashboardtable"; // Correct import for EngagementTable
import ChartDash from "./Chart";

function Dashboard2() {
  const [totalCompanies, setTotalCompanies] = useState(null);
  const [statusCounts, setStatusCounts] = useState({});
  const [error, setError] = useState(null);
  const [error2, setError2] = useState(null);

  

  const API_URL1 = "http://localhost:5000/api/crudForm";

  

  // Fetch total companies from Firestore
  // Fetch real-time updates for total companies
  useEffect(() => {
    let unsubscribe;

    try {
      unsubscribe = onSnapshot(
        collection(db, "engagement"), // Pass the Firestore instance and collection name
        (snapshot) => {
          const companies = new Set();

          snapshot.forEach((doc) => {
            const data = doc.data();
            if (data.company) {
              companies.add(data.company);
            }
          });

          setTotalCompanies(companies.size); // Update company count
          setError(null); // Clear any previous errors
        },
        (error) => {
          console.error("Firestore error:", error);
          setError("Failed to fetch data");
        }
      );
    } catch (err) {
      console.error("Snapshot error:", err);
      setError("Failed to fetch data");
    }

    return () => {
      if (unsubscribe) {
        unsubscribe(); // Cleanup listener on component unmount
      }
    };
  }, []);
  

  // Mock data for Status Card
  useEffect(() => {
    const fetchMockData = () => {
      try {
        // Mock data simulating documents from the "engagement" collection
        const mockData = [
          { id: 1, status: "IN PROGRESS" },
          { id: 2, status: "PENDING" },
          { id: 3, status: "COMPLETED" },
          { id: 4, status: "PENDING" },
          { id: 5, status: "IN PROGRESS" },
          { id: 6, status: "IN PROGRESS" },
          { id: 7, status: "COMPLETED" },
          { id: 8, status: "COMPLETED" },
         ,
        ];

        // Group data by status and count the occurrences
        const counts = mockData.reduce((acc, engagement) => {
          const status = engagement.status || "Unknown";
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});

        setStatusCounts(counts);
      } catch (err) {
        setError2("Failed to process mock data");
        console.error(err);
      }
    };

    fetchMockData();
  }, []);

  return (
    <Paper sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
      <Typography variant="h6" gutterBottom>
        Welcome to the Dashboard!
      </Typography>

      {/* Bootstrap Grid System */}
      <div className="container-fluid">
        {/* First Row */}
        <div className="row g-2">
          {/* First Column */}
          <div className="col-md-4 d-flex justify-content-center align-items-center">
            <Card
            
              className="text-center"
              style={{
                width: "300px", // Reduced width
                height: "200px", // Reduced height
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
              }}
            >
              <div >
                <p>INTERVIEW STATUS</p>
                <ChartDash />
              </div>
            </Card>
          </div>

          {/* Second Column */}
          <div className="col-md-8">
  <div className="d-flex flex-row gap-3">
    {/* Total Companies Card */}
    <Card className="p-2" style={{ flex: 1 }}>
      <CardContent>
        <Typography variant="subtitle1" align="center">
          Total Companies
        </Typography>
        {error ? (
          <Typography color="error" align="center">
            {error}
          </Typography>
        ) : totalCompanies === null ? (
          <Typography align="center">Loading...</Typography>
        ) : (
          <Typography variant="h5" color="primary" align="center">
            {totalCompanies}
          </Typography>
        )}
      </CardContent>
    </Card>

    {/* Status Card */}
     {/* Status Card */}
     <Card className="p-2" style={{ flex: 1 }}>
                <CardContent>
                  <Typography variant="subtitle1" align="center">
                    STATUS
                  </Typography>
                  {error2 ? (
                    <Typography color="error" align="center">
                      {error2}
                    </Typography>
                  ) : (
                    <Box sx={{ display: "flex", justifyContent: "space-around" }}>
                      {Object.entries(statusCounts).map(([status, count]) => (
                        <Box key={status} sx={{ textAlign: "center" }}>
                          <Typography variant="body2">{status}</Typography>
                          <Typography variant="h6" color="secondary">
                            {count}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Card>
  </div>
</div>
        </div>

        {/* Second Row */}
        <div className="row g-2 mt-2">
  <div
    className="col-12"
    style={{
      maxHeight: "400px", // Set a fixed height for the scrolling area
      overflowY: "auto", // Enable vertical scrolling
      overflowX: "hidden", // Disable horizontal scrolling (optional)
      paddingRight: "8px", // Avoid content cutoff when a scrollbar appears
    }}
  >
   <Typography variant="subtitle1" gutterBottom align="center">
  CURRENT ENGAGEMENTS
</Typography>
    <EngagementTable /> {/* Render EngagementTable */}
  </div>
</div>
      </div>
    </Paper>
  );
}

export default Dashboard2;