import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const fullName = profile.displayName.split(" ");

        const user = {
          googleId: profile.id,
          firstName: fullName[0],
          lastName: fullName[1] || "User",
          email: profile.emails[0].value,
        };
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    },
  ),
);

export default passport;
