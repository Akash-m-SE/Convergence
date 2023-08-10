import React, { useEffect } from "react";
import { styled } from "@mui/system";
import Messages from "./Messages/Messages";
import NewMessageInput from "./NewMessageInput";
import { getDirectChatHistory } from "../../realTimeCommunication/socketConnection";

const Wrapper = styled("div")({
  flexGrow: 1,
});

const MessengerContent = ({ chosenChatDetails }) => {
  useEffect(() => {
    // TO DO
    // fetching chat history from specific user id
    getDirectChatHistory({
      receiverUserId: chosenChatDetails.id,
    });
  }, [chosenChatDetails]);

  return (
    <Wrapper>
      <Messages />
      <NewMessageInput />
    </Wrapper>
  );
};

// const MessengerContent = ({ chosenChatDetails }) => {
//   useEffect(() => {
//     getDirectChatHistory({
//       receiverUserId: chosenChatDetails.id,
//     });
//   }, [chosenChatDetails]);

//   return (
//     <Wrapper>
//       <Messages />
//       <NewMessageInput />
//     </Wrapper>
//   );
// };
export default MessengerContent;
