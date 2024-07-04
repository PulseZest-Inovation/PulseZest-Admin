import React, { useState } from "react";
import ZoD from '../ManageEmployee/NavFeature/ZoD';

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
    const [activePage, setActivePage] = useState("Home");

    const renderPage = () => {
        switch (activePage) {
            case "ZoD":
                return <ZoD />;
            case "Home":
                return (
                    <div>
                        <h1>Manage Employee</h1>
                        <p>Here you can manage all the employee-related tasks.</p>
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
                {renderPage()}
            </div>
        </div>
    );
};

export default ManageEmp;
