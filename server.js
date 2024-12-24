const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Paths to JSON files
const usersFilePath = path.join(__dirname, "users.json");
const companiesFilePath = path.join(__dirname, "companies.json");
const engagementsFilePath = path.join(__dirname, "engagement.json");
const crudFormFilePath = path.join(__dirname, "crudFormData.json"); // File for CRUD Form data
const crud2FormFilePath = path.join(__dirname, "crud2FormData.json"); // File for CRUD2 Form data

// Helper functions to read/write JSON files
const readData = (filePath) => {
  try {
    const rawData = fs.readFileSync(filePath, "utf8");
    return rawData.trim() ? JSON.parse(rawData) : [];
  } catch (err) {
    console.error(`Error reading file (${filePath}):`, err.message);
    if (err.code === "ENOENT") {
      // File doesn't exist, create it with an empty array
      writeData(filePath, []);
      return [];
    }
    throw err; // Re-throw other errors
  }
};

const writeData = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Error writing to file (${filePath}):`, err.message);
    throw err;
  }
};

const generateId = () => Date.now(); // Simple unique ID generator

// Generic CRUD functions
const createCRUDRoutes = (app, route, filePath) => {
  // GET all items
  app.get(route, (req, res) => {
    try {
      const data = readData(filePath);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch data" });
    }
  });

  // POST a new item
  app.post(route, (req, res) => {
    try {
      const data = readData(filePath);
      const newItem = { id: generateId(), ...req.body };
      data.push(newItem);
      writeData(filePath, data);
      res.status(201).json(newItem);
    } catch (err) {
      res.status(500).json({ error: "Failed to save data" });
    }
  });

  // PUT (update) an existing item
  app.put(`${route}/:id`, (req, res) => {
    try {
      const data = readData(filePath);
      const { id } = req.params;
      const index = data.findIndex((item) => item.id === parseInt(id));

      if (index === -1) {
        return res.status(404).json({ error: "Item not found" });
      }

      data[index] = { ...data[index], ...req.body };
      writeData(filePath, data);
      res.json(data[index]);
    } catch (err) {
      res.status(500).json({ error: "Failed to update data" });
    }
  });

  // DELETE an item
  app.delete(`${route}/:id`, (req, res) => {
    try {
      const data = readData(filePath);
      const { id } = req.params;
      const filteredData = data.filter((item) => item.id !== parseInt(id));

      if (data.length === filteredData.length) {
        return res.status(404).json({ error: "Item not found" });
      }

      writeData(filePath, filteredData);
      res.status(204).send(); // No Content
    } catch (err) {
      res.status(500).json({ error: "Failed to delete data" });
    }
  });
};

// Create CRUD routes for existing files
createCRUDRoutes(app, "/api/users", usersFilePath);
createCRUDRoutes(app, "/api/companies", companiesFilePath);
createCRUDRoutes(app, "/api/engagements", engagementsFilePath);
createCRUDRoutes(app, "/api/crudForm", crudFormFilePath); // CRUD Form route
createCRUDRoutes(app, "/api/crud2Form", crud2FormFilePath); // CRUD2 Form route

// Serve users.json directly through an API route
app.get("/users.json", (req, res) => {
  try {
    const users = readData(usersFilePath);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to load users.json" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});