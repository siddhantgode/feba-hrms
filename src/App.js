import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import Users from "./components/Users";
import Companies from "./components/Companies";
import MainLayout from "./components/MainLayout"; // Ensure correct import
import Engagements from "./components/Engagements";
import CrudForm from "./components/CrudForm"; // Ensure correct import
import CRUD2Form from "./components/CRUD2form"; // Import the new CRUD2Form component
import Chart from "./components/Chart";
import Openings from "./components/Openings";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<LoginForm />} />

        {/* Protected Routes with MainLayout */}
        <Route path="/" element={<MainLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="companies" element={<Companies />} />
          <Route path="engagements" element={<Engagements />} />
          <Route path="openings" element={<Openings />} />
          <Route path="crud-form" element={<CrudForm />} />
          <Route path="crud2-form" element={<CRUD2Form />} /> {/* Updated route for CRUD2Form */}
          <Route path="chart" element={<Chart />} /> {/* Updated route for CRUD2Form */}          Route
        </Route>
      </Routes>
    </Router>
  );
}

export default App;