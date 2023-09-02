const JwtStrategy = require("passport-jwt").Strategy;
const extractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const User = mongoose.model("User");

const keys = require("../config/keys");

const options = {
  jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: keys.jwt,
};

module.exports = function (passport) {
  passport.use(
    new JwtStrategy(options, async (payload, done) => {
      try {
        const user = await User.findById(payload.userId).select("phone id");

        if (user) {
          done(null, user);
        } else {
          done(null, false);
        }
      } catch (error) {
        console.log("JwtStrategy error :>> ", error);
      }
    })
  );
};
