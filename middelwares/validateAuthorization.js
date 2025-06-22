import mongoose from "mongoose";
import users from "../models/users.js";

export const validateAuthorization = async (req, res, next) => {
  const decoded = req.user;
          try {
    // first check if the id is a valid mongodb id
    if (!mongoose.Types.ObjectId.isValid(decoded.userId)) {
      return res.status(400).json({ messge: "invalid mongodb Id" });
    }
    // find the Id and check if the user has right to access this route
    const findAndGiveAccess = await users.findOne({ _id: decoded.userId });
    if (!findAndGiveAccess || findAndGiveAccess.role != "superAdmin") {
      return res.status(400).json({ messsage: "access not granted" });
    }
    next();
  } catch (error) {
    return res.status(400).json({ message: "internal server error" });
  }
};
