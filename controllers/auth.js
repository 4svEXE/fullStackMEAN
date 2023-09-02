const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const User = require("../modeles/User");
const errorHandler = require("../utils/errorHandler");

// Тут вся логіка яка виконується в роуті auth
module.exports.login = async function (req, res) {
  const candidate = await User.findOne({ phone: req.body.phone });

  if (candidate) {
    const isCorrectPassword = bcrypt.compareSync(
      req.body.password,
      candidate.password
    );

    if (isCorrectPassword) {
      const token = jwt.sign(
        {
          phone: candidate.phone,
          username: candidate.username,
          firstName: candidate.firstName,
          lastName: candidate.lastName,
          userId: candidate._id,
        },
        keys.jwt,
        { expiresIn: 60 * 60 }
      );

      // Add feald user for tests

      res.status(200).json({ token: `Bearer ${token}`, user: candidate });
    } else {
      // 401 - un autorised
      res.status(401).json({
        message: "Password is not correct",
      });
    }
  } else {
    res.status(404).json({
      message: "User not found",
    });
  }
};

module.exports.register = async function (req, res) {
  //phone username firstName lastName password

  const candidate = await User.findOne({ phone: req.body.phone });

  if (candidate) {
    // User is exsist needs an error
    // err 409 - conflict (user is alredy exsist)
    res.status(409).json({
      message: "user is alredy exsists",
    });
  } else {
    // add user

    try {
      const salt = bcrypt.genSaltSync(10);
      const password = req.body.password;

      const user = new User({
        phone: req.body.phone,
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: bcrypt.hashSync(password, salt),
      });

      user.save().then(() => {
        console.log("user has ben created :>> ", user);
        res.status(201).json({ message: "user has ben created", user });
      });
    } catch (error) {
      errorHandler(res, error);
    }
  }
};
