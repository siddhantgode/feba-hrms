import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const CompanyCountChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch JSON data from the server
        const response = await fetch('http://localhost:5000/api/engagements'); // Adjust based on server URL
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const jsonData = await response.json();

        console.log('Fetched JSON data:', jsonData); // Debugging the fetched data

        // Process data to count occurrences of each company
        const companyCounts = {};
        jsonData.forEach((item) => {
          if (item.company) {
            companyCounts[item.company] =
              (companyCounts[item.company] || 0) + 1;
          }
        });

        // Transform data into the format required by Recharts
        const chartData = Object.keys(companyCounts).map((company) => ({
          name: company,
          count: companyCounts[company],
        }));

        console.log('Processed chart data:', chartData); // Debugging the chart data
        setData(chartData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: 'auto', padding: '10px' }}>
      {data.length > 0 ? (
        <BarChart width={530} height={200} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      ) : (
        <p className="text-center">No data available to display the chart.</p>
      )}
    </div>
  );
};

export default CompanyCountChart;