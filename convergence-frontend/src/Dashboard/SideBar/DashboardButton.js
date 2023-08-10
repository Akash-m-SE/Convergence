import React from "react";
import IconButton from "@mui/material/IconButton";
import HomeIcon from "@mui/icons-material/Home";
import { Tooltip } from "@mui/material";

const HomeButton = () => {
  const handleDashboard = () => {
    window.location.reload();
  };

  return (
    <Tooltip title="Dashboard">
      <IconButton color="primary" aria-label="home" onClick={handleDashboard}>
        <HomeIcon />
      </IconButton>
    </Tooltip>
  );
};

export default HomeButton;
