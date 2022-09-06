const mongoose = require("mongoose");
const objectId = mongoose.Schema.Types.ObjectId;

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    authorId: {
      type: objectId,
      ref: "Author",
      reuired: true,
    },
    tags: [String],
    category: { type: String, required: true },
    subcategory: [String],
    isDeleted: { type: Boolean, default: false },
    deletedAt: {
      type: String,
    },
    publishedAt: {
      type: Number,
    },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);

// createdAt, updatedAt,
//   deletedAt: {when the document is deleted},
