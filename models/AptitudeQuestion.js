const mongoose = require("mongoose");

const aptitudeQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Question text is required"],
      trim: true,
    },

    options: {
      type: [String],
      required: [true, "Options are required"],
      validate: {
        validator: function (val) {
          return Array.isArray(val) && val.length >= 2;
        },
        message: "Options must contain at least 2 choices",
      },
    },

    correctAnswer: {
      type: Number,
      required: [true, "Correct answer index is required"],
      validate: {
        validator: function (val) {
          return Number.isInteger(val) && val >= 0;
        },
        message: "Correct answer must be a valid non-negative option index",
      },
    },

    explanation: {
      type: String,
      default: "",
      trim: true,
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: [
          "Quantitative Aptitude",
          "Logical Reasoning",
          "Verbal Ability",
          "Technical Fundamentals",
        ],
        message: "{VALUE} is not a valid aptitude category",
      },
      trim: true,
    },

    topic: {
      type: String,
      required: [true, "Topic is required"],
      trim: true,
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
      lowercase: true,
      trim: true,
    },

    role: {
      type: String,
      default: "General",
      trim: true,
    },

    company: {
      type: String,
      default: "",
      trim: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // --------------------------------------------------
    // Future extensible fields (pre-defined for compatibility)
    // --------------------------------------------------
    companyRelevance: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    sourceMetadata: {
      source: { type: String, default: "" },
      url: { type: String, default: "" },
      author: { type: String, default: "" },
    },

    questionFrequency: {
      type: Number,
      default: 0,
    },

    questionType: {
      type: String,
      enum: ["multiple_choice", "single_choice", "true_false"],
      default: "multiple_choice",
    },

    timeEstimate: {
      type: Number,
      default: 60, // in seconds
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast querying by category, topic, difficulty, company, and isActive
aptitudeQuestionSchema.index({ category: 1, topic: 1, difficulty: 1, isActive: 1 });
aptitudeQuestionSchema.index({ company: 1 });

module.exports = mongoose.model("AptitudeQuestion", aptitudeQuestionSchema);
