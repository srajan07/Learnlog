const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [2, "Full name must be at least 2 characters"],
      maxlength: [50, "Full name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },

    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    // -----------------------
    // Profile
    // -----------------------

    avatar: {
         url: {
         type: String,
         default: "",
        },
         publicId: {
        type: String,
         default: "",
  },
},

    bio: {
      type: String,
      trim: true,
      maxlength: [300, "Bio cannot exceed 300 characters"],
      default: "",
    },

    college: {
      type: String,
      trim: true,
      maxlength: [100, "College name cannot exceed 100 characters"],
      default: "",
    },

    graduationYear: {
      type: Number,
      min: [1950, "Invalid graduation year"],
      max: [2100, "Invalid graduation year"],
    },

    preferredRole: {
      type: String,
      trim: true,
      maxlength: [50, "Preferred role cannot exceed 50 characters"],
      default: "",
    },

    experienceLevel: {
      type: String,
      enum: ["Student", "Fresher", "Experienced"],
      default: "Student",
    },

    skills: {
      type: [String],
      default: [],
    },

    github: {
      type: String,
      trim: true,
      default: "",
    },

    linkedin: {
      type: String,
      trim: true,
      default: "",
    },

    portfolio: {
      type: String,
      trim: true,
      default: "",
    },

    // -----------------------
    // AI Interview Credits
    // -----------------------

    aiInterviewCredits: {
      type: Number,
      default: 1,
    },

    aiInterviewCreditMonth: {
      type: String,
      default: "",
    },

    // -----------------------
    // Auth
    // -----------------------

    resetPasswordOtp: {
      type: String,
      select: false,
    },

    resetPasswordOtpExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// Remove sensitive fields when converting to JSON
userSchema.methods.toJSON = function () {
  const user = this.toObject();

  delete user.password;
  delete user.resetPasswordOtp;
  delete user.resetPasswordOtpExpires;

  return user;
};

const User = mongoose.model("User", userSchema);

module.exports = User;