import React from "react";

const ROUTE_STATE_HOME = "home";
const ROUTE_STATE_SIGNIN = "signin";
const ROUTE_STATE_REGISTER = "register";

const Navigation = ({ onRouteChange, route }) => {
  switch (route) {
    case ROUTE_STATE_HOME:
      return (
        <nav style={{ display: "flex", justifyContent: "flex-end" }}>
          <p
            onClick={() => onRouteChange("signin")}
            className="f3 link dim black underling pa3 pointer"
          >
            Sign Out
          </p>
        </nav>
      );
    case ROUTE_STATE_SIGNIN:
      return (
        <nav style={{ display: "flex", justifyContent: "flex-end" }}>
          <p
            onClick={() => onRouteChange("register")}
            className="f3 link dim black underling pa3 pointer"
          >
            Register
          </p>
        </nav>
      );
    case ROUTE_STATE_REGISTER:
      return (
        <nav style={{ display: "flex", justifyContent: "flex-end" }}>
          <p
            onClick={() => onRouteChange("signin")}
            className="f3 link dim black underling pa3 pointer"
          >
            Sign In
          </p>
        </nav>
      );
    default:
      return (
        <nav style={{ display: "flex", justifyContent: "flex-end" }}>
          <p
            onClick={() => onRouteChange("signin")}
            className="f3 link dim black underling pa3 pointer"
          >
            default
          </p>
        </nav>
      );
  }
};

export default Navigation;
