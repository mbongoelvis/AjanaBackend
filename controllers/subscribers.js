import subscribers from "../models/subscribers.js";

// create subscriber
export const addSubscriber = async (req, res) => {
  try {
            const { email } = req.body;
            if (!email) {
                      return res.status(400).json({message: "email is require"})
            }
    //   first find the email if it exist or not
    const findEmail = await subscribers.findOne({ email: email });
    if (findEmail) {
      return res.status(400).json({ message: "email already in us" });
    }
    const saveUser = new subscribers({
      email,
    });
            await saveUser.save();
            if (!saveUser) {
                      return res.status(400).json({message: "error saving user"})
            }
            return res.status(201).json({message: "email saved"})
  } catch (err) {
    return res
      .status(500)
      .json({ message: "server error", error: err.message });
  }
};

// delete subscriber
export const deleteSubscriber = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "email is require" });
    }
    //   first find the email if it exist or not
    const findEmail = await subscribers.findOneAndDelete({ email: email });
    if (!findEmail) {
      return res.status(400).json({ message: "email not found" });
    }
    return res.status(200).json({ message: "email deleted successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "server error", error: err.message });
  }
}

// get all subscribers
export const getAllSubscribers = async (req, res) => {
  try {
    const subscribersList = await subscribers.find({});
    if (!subscribersList || subscribersList.length === 0) {
      return res.status(404).json({ message: "No subscribers found" });
    }
    return res.status(200).json(subscribersList);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "server error", error: err.message });
  }
}