import bcrypt from "bcrypt";
import mongoose from "mongoose";
import users from "../models/users.js";
import { createToken } from "../helper/createToken.js";

// ========= login =========
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
    const comparePassword = await bcrypt.compare(password, findEmail.password);
    //   if the password matches
    if (!comparePassword) {
      return res.status(400).json({ message: "wrong cridentailas try again" });
    }
    //   create an access token using the userId and role
    const Token = await createToken(findEmail._id, findEmail.role);
    //   send the accesss token
    return res.status(200).json({ Token });
  } catch (error) {
    return res.status(400).json({ message: "Internal server error" });
  }
};

// =========== create an account ==========
export const signup = async (req, res) => {
  try {
    const { email, password, username, role } = req.body;
    // check if email and password are provided
    if (!email || !password || !role || !username) {
      return res
        .status(400)
        .json({ message: "All fields are required" });
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
      username,
      role,
      password: hashedPassword,
    });
    //   saving the user
    const saveUser = await newUser.save();
    if (!saveUser) {
      return res.status(400).json({ message: "Error creating user" });
    }
    return res
      .status(201)
      .json({ message: "Account created successfully" });
  } catch (error) {
    return res.status(400).json({ message: "Internal server error" });
  }
};

// =========== Get an account by id ==========
export const getAccountById = async (req, res) => {
  try {
    //   ========= // first check if the id is a valid mongodb id ======
    if (!mongoose.Types.ObjectId.isValid(req.userId)) {
      console.log("issue here: id issue");

      return res.status(400).json({ messge: "invalid mongodb Id" });
    }
    //     find the account
    const findAccount = await users
      .findOne({ _id: req.userId })
      .select("-password -__v");
    if (!findAccount) {
      console.log("issue here: find account");
      return res.status(400).json({ message: "account not found" });
    }
    return res
      .status(200)
      .json(findAccount);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ======== Get all accounts =========
export const getAllAdmins = async (req, res) => {
  try {
    const allAccounts = await users.find().select("-__v -password"); 
    return res.status(200).json(allAccounts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// ========== Delete admin ============
export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params
    // check if the id is a valid mongodb id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({message: "Invalid mongodb id"})
    }
    // find the account
    const findAccount = await users.findById({_id: id})
    if (!findAccount) {
      return res.status(400).json({message: "Account not found"})
    }
    // delete the account
    const deleteAccount = await users.findByIdAndDelete({_id: id})
    if (!deleteAccount) {
      return res.status(400).json({message: "Error deleting account"})
    }
    return res.status(200).json({message: "Account deleted successfully"})
  } catch (error) {
    return res.status(500).json({message: "Internal server error"})
  }
}

// ========== Update account ============
export const updateAccount = async (req, res) => { 
  try {
    const { id } = req.params;
    const { email, username, role } = req.body;
    // check if the id is a valid mongodb id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid mongodb id" });
    }
    // find the account
    const findAccount = await users.findById({ _id: id });
    if (!findAccount) {
      return res.status(400).json({ message: "Account not found" });
    }
    // update the account
    const updatedAccount = await users.findByIdAndUpdate(
      { _id: id },
      { email, username, role },
      { new: true }
    );
    if (!updatedAccount) {
      return res.status(400).json({ message: "Error updating account" });
    }
    return res.status(200).json({ message: "Account updated successfully",updatedAccount });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}