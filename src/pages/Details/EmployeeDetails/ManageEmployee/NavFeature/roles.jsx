import React, { useState, useEffect } from "react";
import { db } from "../../../../../Firebase/Firebase"; // Import the configured Firestore
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { Container, Typography, TextField, Select, MenuItem, Button, List, ListItem, ListItemText, InputLabel, FormControl } from "@mui/material";

const Categories = ["Web", "App", "Server"];
const predefinedRoles = {
  Web: [
    "Frontend Wizard", "Backend Guru", "Full Stack Ninja", "UX/UI Innovator", "Digital Artist",
    "SEO Rockstar", "Web Performance Ninja", "Web Security Defender", "Web Analytics Guru", "Code Craftsperson"
  ],
  App: [
    "Mobile App Guru", "App Experience Designer", "Mobile App QA Specialist", "App Innovation Architect", "iOS Techie",
    "Android App Expert", "App Performance Ninja", "App Security Guardian", "Product Visionary", "App Support Specialist"
  ],
  Server: [
    "Cloud Crusader", "DevOps Dynamo", "Network Ninja", "Server SysAdmin Pro", "Database Sensei",
    "Cloud Infrastructure Architect", "Cybersecurity Specialist", "Backup Champion", "IT Solutions Architect", "Systems Wizard"
  ]
};

const Roles = ({ userId }) => {
  const [category, setCategory] = useState(Categories[0]);
  const [selectedRole, setSelectedRole] = useState("");
  const [assignedRoles, setAssignedRoles] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const roleRef = doc(db, "employeeDetails", userId, "manage", "employeeRoles");
        const docSnapshot = await getDoc(roleRef);

        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setAssignedRoles(data[category] || []);
        } else {
          await setDoc(roleRef, {
            Web: [],
            App: [],
            Server: []
          });
          setAssignedRoles([]);
        }
      } catch (error) {
        console.error("Error fetching roles: ", error);
      }
    };

    fetchRoles();
  }, [userId, category]);

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleAddRole = async () => {
    if (selectedRole.trim() === "" || assignedRoles.includes(selectedRole)) {
      alert("Role is either empty or already assigned");
      return;
    }

    try {
      const roleRef = doc(db, "employeeDetails", userId, "manage", "employeeRoles");
      await updateDoc(roleRef, {
        [category]: arrayUnion(selectedRole)
      });

      setAssignedRoles(prevRoles => [...prevRoles, selectedRole]);
      setSelectedRole(""); // Clear the selection
      alert("Role added successfully");
    } catch (error) {
      console.error("Error adding role: ", error);
      alert("Error adding role");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Roles Management
      </Typography>
      <Typography variant="h6" gutterBottom>
        {userId}
      </Typography>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddRole();
        }}
      >
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Select Category</InputLabel>
          <Select value={category} onChange={handleCategoryChange} label="Select Category">
            {Categories.map(cat => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Select Role</InputLabel>
          <Select value={selectedRole} onChange={handleRoleChange} label="Select Role">
            <MenuItem value="">-- Select a Role --</MenuItem>
            {predefinedRoles[category].map((role, index) => (
              <MenuItem key={index} value={role}>{role}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" type="submit">
          Add Role
        </Button>
      </form>
      <div style={{ marginTop: 20 }}>
        <Typography variant="h6" gutterBottom>
          Assigned Roles in {category} Category:
        </Typography>
        <List>
          {assignedRoles.map((r, index) => (
            <ListItem key={index}>
              <ListItemText primary={r} />
            </ListItem>
          ))}
        </List>
      </div>
    </Container>
  );
};

export default Roles;
