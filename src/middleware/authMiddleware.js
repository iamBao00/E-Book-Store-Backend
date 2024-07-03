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

const AuthMiddleware = { ensureAuthenticated, ensureRole };

export default AuthMiddleware;
