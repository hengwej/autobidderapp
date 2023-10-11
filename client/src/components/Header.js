// Header.js
import React from "react";

const Header = ({ headerText }) => {
    const headerStyle = {
        textAlign: "center",
        background: `url('../../../assets/img/welcome.jpg')`,
        backgroundSize:"cover", // Stretch the image to fill the header
        backgroundPosition: "center",
        padding: "100px", // Increase padding to increase the header size
        height: "300px", // Increase height to increase the header size
        color: "white",
    };

    const containerStyle = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    };

    const h1Style = {
        color: "white",
        textShadow: "none", // Remove the text shadow



    };

    return (
        <header style={headerStyle}>
            <div style={containerStyle}>
                <h1 style={h1Style}>{headerText}</h1>
            </div>
        </header>
    );
};

export default Header;
