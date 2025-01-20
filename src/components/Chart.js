import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2"; // Import Bar chart
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Chart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // Load the JSON file
    const fetchData = async () => {
      try {
        const response = await fetch("/crud2FormData.json"); // Relative path to the JSON file
        const data = await response.json();

        // Process the data to count companies
        const companyCounts = {};
        data.forEach((item) => {
          companyCounts[item.company] = (companyCounts[item.company] || 0) + 1;
        });

        // Prepare the data for the chart
        const labels = Object.keys(companyCounts);
        const counts = Object.values(companyCounts);

        setChartData({
          labels,
          datasets: [
            {
              label: "Number of Entries per Company",
              data: counts,
              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Error loading JSON data:", error);
      }
    };

    fetchData();
  }, []);

  // Display the chart only if data is available
  return (
    <div style={{ width: "80%", margin: "0 auto", padding: "20px" }}>
      <h2>Company Data Chart</h2>
      {chartData ? (
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "top",
              },
            },
          }}
        />
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
};

export default Chart;