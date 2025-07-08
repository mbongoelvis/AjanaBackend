import blog from "../models/blog.js";
import mongoose from "mongoose";

// controller to add blog
export const addBlog = async (req, res) => {
  try {
    const { title, description, author, coverPhoto, views } = req.body;
    // if none of theses were sent
    if (!title || !description || !author || !coverPhoto) {
      return res.status(400).json({ message: "all fields are required" });
    }
    // creating the post
    const createBlog = new blog({
      title,
      description,
      author,
      coverPhoto,
      views,
    });
    await createBlog.save();
    // if the blog was not created
    if (!createBlog) {
      return res.status(400).json({ message: "Fail to create blog" });
    }
    return res.status(201).json({ message: "Blog created successfully" });
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
};
// get all blogs
export const getAllBlogs = async (req, res) => {
  try {
    const getAllBlog = await blog.find().select("-__v");
    return res.status(200).json(getAllBlog);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
// get a single blog
export const getBlog = async (req, res) => {
  try {
    const { id } = req.params;
    // check if the id is a valid mongodb ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ messge: "invalid Id" });
    }
    const getBlog = await blog.findOne({ _id: id });
    if (!getBlog) {
      return res.status(400).json({ message: "Blog not found" });
    }
    return res.status(200).json(getBlog);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
// update a blog
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, author, coverPhoto, contentPhoto, views } =
      req.body;
    // check if the id is a valid mongodb ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ messge: "invalid Id" });
    }
    // update the blog
    const updateBlog = await blog.findOneAndUpdate(
      { _id: id },
      { title, description, author, coverPhoto, contentPhoto, views }
    );
    if (!updateBlog) {
      return res.status(400).json({ message: "error updating the blog" });
    }
    return res.status(200).json({ message: "blog updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
// delete a blog
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    // check if the id is a valid mongodb ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ messge: "invalid Id" });
    }
    // update the blog
    const deleteBlog = await blog.findOneAndDelete({ _id: id });
    if (!deleteBlog) {
      return res.status(400).json({ message: "error deleting blog" });
    }
    return res.status(200).json({ message: "blog blog deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
