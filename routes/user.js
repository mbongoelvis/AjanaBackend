import express from "express";
import { login, signup, deleteAdmin, getAllAdmins,getAccountById, updateAccount } from "../controllers/user.js";
import { validateToken } from "../middelwares/validateToken.js";

const userRouter = express.Router();

// login
userRouter.post("/", login);
// signup
userRouter.post("/signup", signup);
// validate token
userRouter.get("/validateToken", validateToken, getAccountById);
// get all accounts
userRouter.get("/", getAllAdmins);
// update account
userRouter.patch("/:id", updateAccount)
// delete account
userRouter.delete("/:id", deleteAdmin)

export default userRouter;
