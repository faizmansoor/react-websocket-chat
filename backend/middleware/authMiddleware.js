export const ensureAuthenticated = (req, res, next) => {
  console.log("req.user: ", req.user);
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  next();
};
