import express from "express"
import { addSubscriber, deleteSubscriber, getAllSubscribers } from "../controllers/subscribers.js";

const subscriberRouter = express.Router();

// create subscriber
subscriberRouter.post("/", addSubscriber)
// delete subscriber
subscriberRouter.delete("/:id", deleteSubscriber)
// get all subscribers
subscriberRouter.get("/getall", getAllSubscribers)

export default subscriberRouter