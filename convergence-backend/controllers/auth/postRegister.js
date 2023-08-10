const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const postRegister = async (req, res) => {
  try {
    const { username, password, mail } = req.body;

    // check if the user already exists in the database
    const userExists = await User.exists({ mail: mail.toLowerCase() });

    if (userExists) {
      return res.status(409).send("Email already in use");
    }

    // encrypting the password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // create user document and save it in database
    const user = await User.create({
      username,
      mail: mail.toLowerCase(),
      password: encryptedPassword,
    });

    // create JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        mail,
      },
      process.env.TOKEN_KEY,
      {
        expiresIn: "24h",
      }
    );

    res.status(201).json({
      userDetails: {
        mail: user.mail,
        token: token,
        username: user.username,
        _id: user._id,
      },
    });
  } catch (error) {
    return res.status(500).send("Error occured. Please try again later");
  }
};

module.exports = postRegister;
