import { log } from "console";
import jwt from "jsonwebtoken";

export const validateToken = (req, res, next) => {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return res.status(401).json({ message: "Unauthorized" });
        }
    const token = authHeader.split(" ")[1];
    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(403).json({ message: "Forbidden: Token expired" });
        } else if (err.name === "JsonWebTokenError") {
          return res.status(403).json({ message: "Forbidden: Invalid token" });
        }
      }
      // Attach the user information to the request object
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.log("Error in validateToken middleware:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
