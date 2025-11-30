// middleware/verifyRole.js
export const verifyRole = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res
          .status(403)
          .json({ message: "Access denied: insufficient role" });
      }

      next();
    } catch (error) {
      console.error("Role verification error:", error);
      res.status(500).json({ message: "Server error in role verification" });
    }
  };
};
