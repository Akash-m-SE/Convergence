import store from "../store/store";
import {
  setOpenRoom,
  setRoomDetails,
  setActiveRooms,
  setLocalStream,
  setRemoteStreams,
  setScreenSharingStream,
  setIsUserJoinedOnlyWithAudio,
} from "../store/actions/roomActions";
import * as socketconnection from "./socketConnection";
import * as webRTCHandler from "./webRTCHandler";

export const createNewRoom = () => {
  const successCallBackFunc = () => {
    store.dispatch(setOpenRoom(true, true));

    const audioOnly = store.getState().room.audioOnly;
    store.dispatch(setIsUserJoinedOnlyWithAudio(audioOnly));

    socketconnection.createNewRoom();
  };

  const audioOnly = store.getState().room.audioOnly;

  webRTCHandler.getLocalStreamPreview(audioOnly, successCallBackFunc);
};

export const newRoomCreated = (data) => {
  const { roomDetails } = data;

  store.dispatch(setRoomDetails(roomDetails));
};

export const updateActiveRooms = (data) => {
  const { activeRooms } = data;

  // console.log("new active rooms came from the store");
  // console.log(activeRooms);

  const friends = store.getState().friends.friends;
  const rooms = [];

  const userId = store.getState().auth.userDetails?._id;

  activeRooms.forEach((room) => {
    const isRoomCreatedByMe = room.roomCreator.userId === userId;

    if (isRoomCreatedByMe) {
      rooms.push({ ...room, creatorUsername: "Me" });
    } else {
      friends.forEach((f) => {
        if (f.id === room.roomCreator.userId) {
          rooms.push({ ...room, creatorUsername: f.username });
        }
      });
    }
  });

  store.dispatch(setActiveRooms(rooms));
};

export const joinRoom = (roomId) => {
  const successCallBackFunc = () => {
    store.dispatch(setRoomDetails({ roomId }));
    store.dispatch(setOpenRoom(false, true));

    const audioOnly = store.getState().room.audioOnly;
    store.dispatch(setIsUserJoinedOnlyWithAudio(audioOnly));

    socketconnection.joinRoom({ roomId });
  };

  const audioOnly = store.getState().room.audioOnly;

  webRTCHandler.getLocalStreamPreview(audioOnly, successCallBackFunc);
};

export const leaveRoom = () => {
  const roomId = store.getState().room.roomDetails.roomId;

  // killing all the audio and video tracks present in the local stream by mapping through them and using the function track.stop()
  const localStream = store.getState().room.localStream;
  if (localStream) {
    localStream.getTracks().forEach((track) => track.stop());
    store.dispatch(setLocalStream(null));
  }

  const screenSharingStream = store.getState().room.screenSharingStream;
  if (screenSharingStream) {
    screenSharingStream.getTracks().forEach((track) => track.stop());
    store.dispatch(setScreenSharingStream(null));
  }

  store.dispatch(setRemoteStreams([]));
  webRTCHandler.closeAllConnections();

  socketconnection.leaveRoom({ roomId });
  store.dispatch(setRoomDetails(null));
  store.dispatch(setOpenRoom(false, false));
};
