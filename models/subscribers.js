import mongoose from "mongoose";

const subscriberSchame = new mongoose.Schema(
  {
    email: {
      type: String,
      require: true,
      unique: true,
    },
    subscribeOn: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

export default mongoose.model("subscriber", subscriberSchame);
