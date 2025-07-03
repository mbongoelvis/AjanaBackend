import express from "express";
import { login, signup, deleteAdmin, getAllAdmins,getAccountById, updateAccount } from "../controllers/user.js";
import { validateToken } from "../middelwares/validateToken.js";
import { validateAuthorization } from "../middelwares/validateAuthorization.js";

const userRouter = express.Router();

// login
userRouter.post("/", login);
// signup
userRouter.post("/signup", signup);
// get an account
userRouter.get("/:id", validateToken, validateAuthorization, getAccountById);
// get all accounts
userRouter.get("/", getAllAdmins);
// update account
userRouter.patch("/:id", updateAccount)
// delete account
userRouter.delete("/:id", deleteAdmin)

export default userRouter;
