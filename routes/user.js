import express from "express";
import { login, signup, getAccountById } from "../controllers/user.js";
import { validateToken } from "../middelwares/validateToken.js";
import { validateAuthorization } from "../middelwares/validateAuthorization.js";

const userRouter = express.Router();

// login
userRouter.post("/", login);
// signup
userRouter.post("/signup", validateToken, validateAuthorization, signup);
// get an account
userRouter.get("/:id", validateToken, validateAuthorization, getAccountById);
// get all accounts
// userRouter.get()
// update account
// userRouter.patch()
// delete account
// userRouter.delete()

export default userRouter;
