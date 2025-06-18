import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    // Basic user information
    firstName: {
      type: String,
      required: function () {
        return !this.googleId; // Required only if not Google user
      },
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: function () {
        return !this.googleId; // Required only if not Google user
      },
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId; // Required only if not Google user
      },
      minlength: 6,
    },

    // Google OAuth fields
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null values
    },
    googleEmail: {
      type: String,
      lowercase: true,
      trim: true,
    },
    googleName: {
      type: String,
      trim: true,
    },
    googlePicture: {
      type: String,
    },

    // Profile information
    profilePicture: {
      type: String,
      default: "",
    },
    phoneNumber: {
      type: String,
      trim: true,
      match: [/^\+?[\d\s-()]+$/, "Please enter a valid phone number"],
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer-not-to-say"],
      default: "prefer-not-to-say",
    },

    // Account status and verification
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
    },
    emailVerificationExpires: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },

    // Authentication and security
    loginMethod: {
      type: String,
      enum: ["email", "google"],
      default: "email",
    },
    refreshToken: {
      type: String,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: Date,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },

    // Address information
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },

    // Preferences
    preferences: {
      language: {
        type: String,
        default: "en",
      },
      timezone: {
        type: String,
        default: "UTC",
      },
      notifications: {
        email: {
          type: Boolean,
          default: true,
        },
        push: {
          type: Boolean,
          default: true,
        },
        sms: {
          type: Boolean,
          default: false,
        },
      },
    },

    // Social media links
    socialLinks: {
      facebook: String,
      twitter: String,
      linkedin: String,
      instagram: String,
    },

    // Account metadata
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
    permissions: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.refreshToken;
        delete ret.passwordResetToken;
        delete ret.emailVerificationToken;
        return ret;
      },
    },
  }
);

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ role: 1 });

// Virtual for full name
userSchema.virtual("fullName").get(function () {
  if (this.googleName) {
    return this.googleName;
  }
  return `${this.firstName} ${this.lastName}`;
});

// Pre-save middleware to hash password
userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next();

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to check if user is Google user
userSchema.methods.isGoogleUser = function () {
  return !!this.googleId;
};

// Static method to find user by email or Google ID
userSchema.statics.findByEmailOrGoogleId = function (identifier) {
  return this.findOne({
    $or: [{ email: identifier }, { googleId: identifier }],
  });
};

// Static method to create Google user
userSchema.statics.createGoogleUser = function (googleData) {
  return this.create({
    googleId: googleData.id,
    googleEmail: googleData.email,
    googleName: googleData.name,
    googlePicture: googleData.picture,
    email: googleData.email,
    isEmailVerified: true, // Google emails are pre-verified
    loginMethod: "google",
    firstName: googleData.given_name || "",
    lastName: googleData.family_name || "",
  });
};

const User = mongoose.model("User", userSchema);

export default User;
