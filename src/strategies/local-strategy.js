import passport from "passport";
import { Strategy } from "passport-local";
import { User } from "../database/User.js";

passport.use(
  new Strategy(async (username, password, done) => {
    try {
      console.log(`Username: ${username}`);
      console.log(`Password: ${password}`);
      const user = await User.findOne({ username });
      if (!user) return done("Incorrect username", null);
      const isValid = await user.comparePassword(password);
      if (!isValid) return done("Incorrect password", null);

      return done(null, user);
    } catch (error) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
