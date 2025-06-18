import mongoose from "mongoose";

// creating the user schema
const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    require: true,
  },
  lastname: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  profilePicture: {
    type: String,
  },
  createOn: {
    type: Date,
    default: Date.now(),
  },
  isEmailPasswordUser: {
    type: Boolean,
    default: true,
  },
  emailVerifiedStatus: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ["admin", "superAdmin"],
    default: "admin"
  },

  //   this schema here is for google auth provider
  provider: {
    type: String,
    enum: ["google"],
  },
  providerId: {
    type: String,
  },
  providerSpecificId: {
    type: String,
  },
  displayName: {
    type: String,
  },
});

export default mongoose.model("userSchame", userSchema);
