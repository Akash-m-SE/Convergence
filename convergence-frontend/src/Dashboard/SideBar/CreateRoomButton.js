import React from "react";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import * as roomHandler from "../../realTimeCommunication/roomHandler";
import { Tooltip } from "@mui/material";

const CreateRoomButton = ({ isUserInRoom }) => {
  const createNewRoomHandler = () => {
    // creating a room and sending info to the server about this
    roomHandler.createNewRoom();
  };

  return (
    <Button
      disabled={isUserInRoom}
      onClick={createNewRoomHandler}
      style={{
        width: "48px",
        height: "48px",
        borderRadius: "16px",
        margin: 0,
        padding: 0,
        minWidth: 0,
        marginTop: "10px",
        color: "white",
        backgroundColor: "#5865F2",
      }}
    >
      <Tooltip title="Create a New Room">
        <AddIcon />
      </Tooltip>
    </Button>
  );
};

export default CreateRoomButton;
