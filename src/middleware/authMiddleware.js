import passport from "passport";
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res
    .status(401)
    .json({ message: "You need to be logged in to access this resource" });
};

const ensureRole = (role) => {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      return next();
    }
    res
      .status(403)
      .json({ message: "You do not have permission to access this resource" });
  };
};

const loginMiddleware = (req, res, next) => {
  passport.authenticate("local", { session: true }, (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
    if (!user) {
      return res.status(401).json({ message: info.message });
    }

    // Xác thực thành công, gọi next() để chuyển tiếp tới controller
    req.login(user, { session: true }, (err) => {
      if (err) {
        return next(err);
      }
      next();
    });
  })(req, res, next);
};

const AuthMiddleware = { ensureAuthenticated, ensureRole, loginMiddleware };

export default AuthMiddleware;
