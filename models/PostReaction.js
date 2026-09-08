const mongoose = require("mongoose");

const PostReactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JourneyPost",
      required: true,
    },
  },
  { timestamps: true }
);

PostReactionSchema.index({ post: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("PostReaction", PostReactionSchema);