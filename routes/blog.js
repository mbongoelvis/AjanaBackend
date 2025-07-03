import express from "express"
import { addBlog, getAllBlogs, getBlog, updateBlog, deleteBlog } from "../controllers/blog.js";
import { validateAdmin } from "../middelwares/validateAdmin.js";
import { validateToken } from "../middelwares/validateToken.js";

const blogRouter = express.Router()

// validateToken,
//   validateAdmin,
  // create blog
  blogRouter.post("/", addBlog);
// delete blog
blogRouter.delete("/:id", deleteBlog);
// update blog
blogRouter.put("/:id", updateBlog);
// get all blog
blogRouter.get("/", getAllBlogs);
// get a single blog
blogRouter.get("/:id", getBlog);

export default blogRouter;
