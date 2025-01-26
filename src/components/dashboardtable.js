import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import db from "../firebase"; // Path to your firebase.js file
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Typography,
  Box,
  TextField,
  TableSortLabel,
} from "@mui/material";

const EngagementTable = () => {
  const [engagements, setEngagements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popoverData, setPopoverData] = useState(null); // Stores updates for the popover
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 }); // Stores the position of the popover

  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" }); // State for sorting

  // Real-time listener for Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "engagement"), // Target collection
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEngagements(data); // Update state with real-time data
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching Firestore data: ", error);
        setLoading(false);
      }
    );

    // Cleanup function to unsubscribe from the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  // Show the popover when hovering over a status cell
  const handleMouseEnter = (event, updates) => {
    setPopoverData(updates);
    setPopoverPosition({
      x: event.pageX + 50, // Position 10px to the right of the mouse pointer
      y: event.pageY -80, // 10px below the mouse pointer
    });
  };

  // Hide the popover when the mouse leaves
  const handleMouseLeave = () => {
    setPopoverData(null);
  };

  // Function to determine the styles for the status cell
  const getStatusStyles = (status) => {
    switch (status) {
      case "In Progress":
        return {
          backgroundColor: "warning.light",
          color: "warning.contrastText",
          borderRadius: 0,
          padding: "4px 8px",
        };
      case "Pending":
        return {
          backgroundColor: "error.light",
          color: "error.contrastText",
          borderRadius: 0,
          padding: "4px 8px",
        };
      case "Completed":
        return {
          backgroundColor: "success.light",
          color: "success.contrastText",
          borderRadius: 0,
          padding: "4px 8px",
        };
      default:
        return {
          backgroundColor: "grey.300",
          color: "text.primary",
          borderRadius: 0,
          padding: "4px 8px",
        };
    }
  };

 // Helper function to calculate row spans for merging cells
 const calculateRowSpans = (data) => {
  const rowSpans = [];
  let prevCompany = null;
  let rowSpanCount = 0;

  data.forEach((row, index) => {
    if (row.company === prevCompany) {
      rowSpanCount++;
      rowSpans[index] = 0; // Do not display cell for subsequent rows
    } else {
      if (rowSpanCount > 0) {
        rowSpans[index - rowSpanCount - 1] = rowSpanCount + 1; // Assign rowSpan to the first row of a group
      }
      rowSpans[index] = 1; // Default rowSpan
      rowSpanCount = 0;
    }
    prevCompany = row.company;
  });

  // Handle the last group
  if (rowSpanCount > 0) {
    rowSpans[data.length - rowSpanCount - 1] = rowSpanCount + 1;
  }

  return rowSpans;
};

  // Function to handle search
  const handleSearch = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  // Function to handle sort
  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

  // Filter and sort the engagements
  const filteredAndSortedEngagements = engagements
    .filter(
      (engagement) =>
        engagement.company?.toLowerCase().includes(searchQuery) ||
        engagement.requirement?.toLowerCase().includes(searchQuery) ||
        engagement.status?.toLowerCase().includes(searchQuery)
    )
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      if (sortConfig.direction === "asc") {
        return a[sortConfig.key]?.localeCompare(b[sortConfig.key]) || 0;
      } else {
        return b[sortConfig.key]?.localeCompare(a[sortConfig.key]) || 0;
      }
    });

  const rowSpans = calculateRowSpans(filteredAndSortedEngagements);

  

  

  return (
    <Box p={2} display="flex" justifyContent="center">
      <Paper
        sx={{
          width: "80%",
          maxWidth: 800,
          borderRadius: 0,
          overflow: "hidden",
        }}
      >
       

        {/* Search Bar */}
        <Box sx={{ p: 1, display: "flex", justifyContent: "flex-start" }}>
  <TextField
    size="small" // Compact size for the TextField
    label="Search"
    variant="outlined"
    value={searchQuery}
    onChange={handleSearch}
    sx={{
      width: "100%",
      maxWidth: 400, // Limit the maximum width of the search box
      fontSize: "0.875rem", // Optional: Adjust font size for compactness
    }}
  />
</Box>

        {loading ? (
          <Typography color="textSecondary" sx={{ p: 2 }}>
            Loading data...
          </Typography>
        ) : filteredAndSortedEngagements.length === 0 ? (
          <Typography color="textSecondary" sx={{ p: 2 }}>
            No engagements found.
          </Typography>
        ) : (
          <Table
            sx={{
              minWidth: 400,
              borderRadius: 0,
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
              fontSize: "1rem",
              fontWeight: 400,
              lineHeight: 1.5,
              color: "#212529",
            }}
          >
            <TableHead>
  <TableRow sx={{ backgroundColor: "#1976d2" }}> {/* Blue background */}
    <TableCell
      sx={{
        color: "white", // White text color
        fontWeight: "bold", // Bold text
        borderRadius: 0,
      }}
    >
      <TableSortLabel
        active={sortConfig.key === "company"}
        direction={sortConfig.direction}
        onClick={() => handleSort("company")}
        sx={{ color: "inherit" }} // Inherit text color (white)
      >
        COMPANY
      </TableSortLabel>
    </TableCell>
    <TableCell
      sx={{
        color: "white", // White text color
        fontWeight: "bold", // Bold text
        borderRadius: 0,
      }}
    >
      <TableSortLabel
        active={sortConfig.key === "requirement"}
        direction={sortConfig.direction}
        onClick={() => handleSort("requirement")}
        sx={{ color: "inherit" }} // Inherit text color (white)
      >
        REQUIREMENT
      </TableSortLabel>
    </TableCell>
    <TableCell
      sx={{
        color: "white", // White text color
        fontWeight: "bold", // Bold text
        borderRadius: 0,
      }}
    >
      <TableSortLabel
        active={sortConfig.key === "status"}
        direction={sortConfig.direction}
        onClick={() => handleSort("status")}
        sx={{ color: "inherit" }} // Inherit text color (white)
      >
        STATUS
      </TableSortLabel>
    </TableCell>
  </TableRow>
</TableHead>
            <TableBody>
  {filteredAndSortedEngagements.map((engagement, index) => (
    <TableRow
      key={engagement.id}
      sx={{
        height: "32px", // Reduced row height
      }}
    >
      {rowSpans[index] > 0 && (
        <TableCell
          rowSpan={rowSpans[index]}
          sx={{
            padding: "4px", // Reduced padding
            verticalAlign: "middle",
            fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
            fontWeight: 400,
            color: "#212529",
          }}
        >
          {engagement.company || "N/A"}
        </TableCell>
      )}
      <TableCell
        sx={{
          padding: "4px", // Reduced padding
          fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
          fontWeight: 400,
          color: "#212529",
        }}
      >
        {engagement.requirement || "N/A"}
      </TableCell>
      <TableCell
        sx={{
          ...getStatusStyles(engagement.status),
          padding: "4px", // Reduced padding
        }}
        onMouseEnter={(event) => handleMouseEnter(event, engagement.updates)}
        onMouseLeave={handleMouseLeave}
      >
        {engagement.status || "N/A"}
      </TableCell>
    </TableRow>
  ))}
</TableBody>
          </Table>
        )}

        {popoverData && (
          <Box
            sx={{
              position: "absolute",
              backgroundColor: "background.paper",
              border: "1px solid #ccc",
              borderRadius: 0,
              boxShadow: 3,
              padding: 2,
              maxWidth: 300,
              zIndex: 10,
              top: popoverPosition.y,
              left: popoverPosition.x,
            }}
          >
            <Typography variant="subtitle1" gutterBottom>
              Status Updates:
            </Typography>
            {popoverData.length > 0 ? (
              <ul>
                {popoverData.map((update, index) => (
                  <li key={index}>
                    <strong>Candidate:</strong> {update.candidate || "N/A"}
                    <br />
                    <strong>Status:</strong> {update.status || "N/A"}
                    <br />
                    <strong>Remarks:</strong> {update.remarks || "N/A"}
                  </li>
                ))}
              </ul>
            ) : (
              <Typography>No updates available.</Typography>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default EngagementTable;