import React from "react";
import { Outlet, Link } from "react-router-dom";
import { List, ListItem, ListItemIcon, ListItemText, Drawer } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import AddBoxIcon from "@mui/icons-material/AddBox";
import HandshakeIcon from '@mui/icons-material/Handshake';
import { AppBar, Toolbar, Typography, Box, useTheme } from "@mui/material";
import logo from '../febatech.png'; 

function MainLayout() {
  const theme = useTheme();
  const username = "John Doe";
  
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Navbar */}
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1,
        backgroundColor: '#1976d2'
       }}>
        <Toolbar>
          <Typography variant="h6" component="div">
            FEBA- HRMS
          </Typography>
          <Box sx={{ marginLeft: 'auto' }}>
            <Typography variant="body1" sx={{ color: 'white' }}>
              {username}
            </Typography>
          </Box>
          {/* Add any other navbar items here */}
        </Toolbar>
      </AppBar>

      <Box sx={{ display: "flex", flexGrow: 1 }}>
        {/* Sidebar */}
        <Drawer
          variant="permanent"
          anchor="left"
          sx={{ 
            width: 240, 
            "& .MuiDrawer-paper": { 
              width: 240, 
              position: 'fixed', // Ensure drawer is relative
              zIndex: theme.zIndex.drawer - 1 // Lower z-index than AppBar
            } 
          }}
        >
          <Toolbar />
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
              <ListItemText primary="Resources" />
            </ListItem>
            <ListItem button component={Link} to="/companies">
              <ListItemIcon>
                <AddBoxIcon />
              </ListItemIcon>
              <ListItemText primary="Companies" />
            </ListItem>
            <ListItem button component={Link} to="/engagements">
              <ListItemIcon>
                <HandshakeIcon />
              </ListItemIcon>
              <ListItemText primary="Interviews" />
            </ListItem>
            <ListItem button component={Link} to="/openings">
              <ListItemIcon>
                <HandshakeIcon />
              </ListItemIcon>
              <ListItemText primary="Requirements" />
            </ListItem>

            
          </List>
          <Box sx={{ position: 'absolute', bottom: 90, left: 30 }}>
            <img src={logo} alt="Logo" style={{ height: 40 }} />
          </Box>
        </Drawer>

        {/* Main Content */}
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Outlet />
        </Box>
      </Box>
      {/* Footer */}
      <Box component="footer" sx={{ 
        backgroundColor: '#1976d2', 
        color: 'white', 
        textAlign: 'center', 
        p: 2, 
        position: 'fixed', // Change to fixed
        bottom: 0, // Position at the bottom
        left: 0, // Align to the left
        right: 0, 
        zIndex: theme.zIndex.drawer + 2,
      }}>
        <Typography variant="body2">
          Copyright © 2024 FEBA Technologies
        </Typography>
      </Box>
    </Box>
  );
}

export default MainLayout;