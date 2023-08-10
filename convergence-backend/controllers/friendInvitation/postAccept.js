const FriendInvitation = require("../../models/friendInvitation");
const User = require("../../models/user");
const friendsUpdates = require("../../socketHandlers/updates/friends");

const postAccept = async (req, res) => {
  try {
    const { id } = req.body;

    const invitation = await FriendInvitation.findById(id);

    if (!invitation) {
      return res.send(401).send("Error occured. Please try again");
    }

    const { senderId, receiverId } = invitation;

    // add friends to both users
    const senderUser = await User.findById(senderId);
    senderUser.friends = [...senderUser.friends, receiverId];

    const receiverUser = await User.findById(receiverId);
    receiverUser.friends = [...receiverUser.friends, senderId];

    // saving both the user's values in the database
    await senderUser.save();
    await receiverUser.save();

    // deleting the invitation from the friendinvitations collection
    await FriendInvitation.findByIdAndDelete(id);

    // update list of the friends if the users are online
    friendsUpdates.updateFriends(senderId.toString());
    friendsUpdates.updateFriends(receiverId.toString());

    // update list of friends pending invitations
    friendsUpdates.updateFriendsPendingInvitations(receiverId.toString());

    return res.status(200).send("Friend successfully added");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Something went wrong. Please try again");
  }
};

module.exports = postAccept;
