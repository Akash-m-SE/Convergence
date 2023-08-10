const User = require("../../models/user");
const FriendInvitation = require("../../models/friendInvitation");
const friendsUpdates = require("../../socketHandlers/updates/friends");

const postInvite = async (req, res) => {
  const { targetMailAddress } = req.body;

  const { userId, mail } = req.user;

  //   check if friend that we would like to invite is not the user himself
  if (mail.toLowerCase() === targetMailAddress.toLowerCase()) {
    return res
      .status(409)
      .send("Sorry. You cannot become friend with yourself");
  }

  //   checking whether the user we want to send friend request exists in the database
  const targetUser = await User.findOne({
    mail: targetMailAddress.toLowerCase(),
  });

  if (!targetUser) {
    return res
      .status(404)
      .send(
        `User with the mail address ${targetMailAddress} has not been found. Please check the mail address again`
      );
  }

  //   checking if invitation has already been sent
  const invitationAlreadyReceived = await FriendInvitation.findOne({
    senderId: userId,
    receiverId: targetUser._id,
  });

  if (invitationAlreadyReceived) {
    return res.status(409).send("Invitation has already been sent");
  }

  //   check if the user whom we would like to invite is already our friend
  const usersAlreadyFriends = targetUser.friends.find(
    (friendId) => friendId.toString() === userId.toString()
  );

  if (usersAlreadyFriends) {
    return res
      .status(409)
      .send("Friend already added. Please check friends list.");
  }

  //   create new invitation in database
  const newInvitation = await FriendInvitation.create({
    senderId: userId,
    receiverId: targetUser._id,
  });

  // if invitation has been successfully created we would liek to ipdate friends invitations if other user is online

  // send pending invitations update to specific user
  friendsUpdates.updateFriendsPendingInvitations(targetUser._id.toString());

  return res.status(201).send("Invitation has been sent.");
};

module.exports = postInvite;
