import bcrypt from "bcrypt";
import mongoose from "mongoose";
import users from "../models/users.js";
import { createToken } from "../helper/createToken.js";

// login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // check if email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    //   find the email if already exist or not
    const findEmail = await users.findOne({ email });
    if (!findEmail) {
      return res.status(400).json({ message: "Account not found create one" });
    }
    //   compare the passwords from that of the hashed password
    const comparePassword = bcrypt.compare(password, findEmail.password);
    //   if the password matches
    if (!comparePassword) {
      return res.status(400).json({ message: "wrong cridentailas try again" });
    }

    //   create an access token using the userId and role
    const loginToken = await createToken(findEmail._id, findEmail.role);
    //   send the accesss token
    return res.status(200).json({ message: "welcome back", loginToken });
  } catch (error) {
    return res.status(400).json({ message: "Internal server error" });
  }
};

// =========== create an account ==========
export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    // check if email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    //   find the email if already exist or not
    const findEmail = await users.findOne({ email });
    if (findEmail) {
      return res.status(400).json({ message: "Account already in use" });
    }

    //   hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    if (!hashedPassword) {
      return res.status(400).json({ message: "Error hashing password" });
    }
    //   create a new user
    const newUser = new users({
      email,
      password: hashedPassword, // default role
    });
    //   saving the user
    const saveUser = await newUser.save();
    if (!saveUser) {
      return res.status(400).json({ message: "Error creating user" });
    }
    //   create an access token using the userId and role
    // this is optional, but if you want to implement this then uncomment this code
    // const signupToken = await createToken(saveUser._id, saveUser.role);
    // if (!signupToken) {
    //   return res.status(400).json({ message: "Error creating token" });
    // }
    //   send the accesss token
    return res
      .status(201)
      .json({ message: "Account created successfully" });
  } catch (error) {
    return res.status(400).json({ message: "Internal server error" });
  }
};

// =========== get an account by id ==========
export const getAccountById = async (req, res) => {
  //   this is the id of the account we want to get
  const { id } = req.params;
  try {
    //   ========= // first check if the id is a valid mongodb id ======
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ messge: "invalid mongodb Id" });
    }
    //     find the account
    const findAccount = await users
      .findById({ _id: id })
      .select("-password -__v");
    if (!findAccount) {
      return res.status(400).json({ message: "account not found" });
    }
    return res
      .status(200)
      .json({ message: "account detail", account: findAccount });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
