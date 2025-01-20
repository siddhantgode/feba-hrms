import React from "react";
import CompanyCountChart from "./charts";

const ChartPage = () => {
  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Company Count Chart</h2>
      <div className="d-flex justify-content-center">
        <CompanyCountChart />
      </div>
    </div>
  );
};

export default ChartPage;