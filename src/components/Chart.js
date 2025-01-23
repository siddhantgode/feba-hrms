import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2"; // Import Pie chart
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const ChartDash = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    // Simulate Firestore data fetch with mock data
    const fetchData = async () => {
      setLoading(true);

      // Test data simulating Firestore documents
      const mockData = [
        { company: "Feba Tech", requirement: "Java Developer", status: "In Progress" },
        { company: "Feba Tech", requirement: "React Developer", status: "Pending" },
        { company: "Infosys", requirement: "Front-End Dev", status: "Completed" },
        { company: "Feba Tech", requirement: "Angular Dev", status: "In Progress" },
        { company: "TCS", requirement: "Back-End Dev", status: "Pending" },
      ];

      // Process the data to count statuses
      const statusCounts = {};
      mockData.forEach((item) => {
        const status = item.status || "Unknown"; // Default to "Unknown" if status is missing
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });

      // Prepare the data for the chart
      const labels = Object.keys(statusCounts);
      const counts = Object.values(statusCounts);

      setChartData({
        labels,
        datasets: [
          {
            label: "Engagement Status Distribution",
            data: counts,
            backgroundColor: [
              "#FF6384", // Red
              "#36A2EB", // Blue
              "#FFCE56", // Yellow
              "#4BC0C0", // Teal
              "#9966FF", // Purple
              "#FF9F40", // Orange
            ],
            borderWidth: 1,
          },
        ],
      });

      setLoading(false);
    };

    fetchData();
  }, []);

  // Display the chart only if data is available
  return (
    <div style={{ width: "100%", maxWidth: "400px", margin: "0 auto", padding: "0px" }}>
      {loading ? (
        <p>Loading chart...</p>
      ) : chartData ? (
        <Pie
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false, // Allow the chart to stretch to fit the container
            plugins: {
              legend: {
                position: "left", // Position the legend on the left
              },
              tooltip: {
                callbacks: {
                  label: (tooltipItem) => {
                    const label = chartData.labels[tooltipItem.dataIndex];
                    const value = chartData.datasets[0].data[tooltipItem.dataIndex];
                    return `${label}: ${value}`;
                  },
                },
              },
            },
          }}
        />
      ) : (
        <p>No data available to display the chart.</p>
      )}
    </div>
  );
};

export default ChartDash;