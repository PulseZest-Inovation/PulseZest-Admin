import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ZoD from '../ManageEmployee/NavFeature/ZoD';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../Firebase/Firebase'; // Adjust the path as necessary

const Navbar = ({ onNavClick }) => {
  const navStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#1C2833",
    color: "#fff",
    flexWrap: "wrap"
  };

  const linkStyle = {
    color: "#fff",
    textDecoration: "none",
    margin: "0 15px",
    fontSize: "18px",
    cursor: "pointer",
    flexGrow: 1,
    textAlign: "center"
  };

  const navLinks = ["Home", "ZoD", "Services", "Contact"];

  return (
    <nav style={navStyle}>
      <div style={{ fontSize: "24px", fontWeight: "bold", flexGrow: 1, textAlign: "center" }}>Pulse Zest</div>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", width: "100%" }}>
        {navLinks.map((link, index) => (
          <span
            key={index}
            onClick={() => onNavClick(link)}
            style={linkStyle}
          >
            {link}
          </span>
        ))}
      </div>
    </nav>
  );
};

const ManageEmp = () => {
  const { id } = useParams(); // Capture the 'id' parameter from the URL
  const [activePage, setActivePage] = useState("Home");
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch employee details based on the 'id' parameter
  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'employeeDetails', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setEmployeeData(docSnap.data());
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching employee details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (activePage === "ZoD") {
      fetchEmployeeDetails();
    }
  }, [id, activePage]);

  const renderPage = () => {
    switch (activePage) {
      case "ZoD":
        return (
          <ZoD
            userId={id}
            fullName={employeeData?.fullName}
            photoUrl={employeeData?.passportPhotoUrl}
          />
        );
      case "Home":
        return (
          <div>
            <h1>Manage Employee</h1>
            <p>Here you can manage all the employee-related tasks.</p>
            <p>Employee User ID: {id}</p> {/* Display the employee ID */}
          </div>
        );
      // Add other cases for "Services" and "Contact" if needed
      default:
        return null;
    }
  };

  return (
    <div>
      <Navbar onNavClick={setActivePage} />
      <div style={{ padding: "20px" }}>
        {loading ? <p>Loading employee details...</p> : renderPage()}
      </div>
    </div>
  );
};

export default ManageEmp;
