import React from "react";
import { Outlet, Link } from "react-router-dom";
import { List, ListItem, ListItemIcon, ListItemText, Drawer } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import BusinessIcon from "@mui/icons-material/Business";
import WorkIcon from "@mui/icons-material/Work";
import AddBoxIcon from "@mui/icons-material/AddBox"; // Icon for CRUD Form

function MainLayout() {
  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{ width: 240, "& .MuiDrawer-paper": { width: 240 } }}
      >
        <List>
          <ListItem button component={Link} to="/dashboard">
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button component={Link} to="/users">
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Users" />
          </ListItem>
          
          <ListItem button component={Link} to="/crud-form">
            <ListItemIcon>
              <AddBoxIcon />
            </ListItemIcon>
            <ListItemText primary="Companies" />
          </ListItem>
          <ListItem button component={Link} to="/crud2-form">
            <ListItemIcon>
              <AddBoxIcon />
            </ListItemIcon>
            <ListItemText primary="Engagements" />
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <main style={{ flexGrow: 1, padding: "16px" }}>
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;