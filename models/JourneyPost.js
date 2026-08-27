const mongoose = require("mongoose");

const journeyPostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },

    workedOn: {
      type: String,
      default: "",
    },
    confusedBy: {
      type: String,
      default: "",
    },
    learned: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("JourneyPost", journeyPostSchema);
