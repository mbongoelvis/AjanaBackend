import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
          title: {
                    type: String,
                    require: true
          },
          description: {
                    type: String,
                    require: true
          },
          coverPhoto: {
                    type: String,
                    require: true
          },
          contentPhoto: {
                    type: String,
          },
          author: {
                    type: String,
                    require: true
          },
          views: {
                    type: String,
                    defualt: 0
          }
}, {timestamps: true})

export default mongoose.model("blog", blogSchema)