import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      // Not required if using OAuth
      default: null,
    },
    fullName: String,
    dob: String,
    gender: String,
    phone_no: String,
    address: String,
    medical_conditions: [String],
    current_medications: String,
    allergies: String,
    previous_heart_issues: String,
    // OAuth provider information
    oauthProviders: [
      {
        provider: {
          type: String,
          enum: ['google', 'facebook', 'github', 'github_oauth'],
        },
        providerId: String,
      },
    ],
    // Session/Auth fields
    isVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: Date,
    profileImage: String,
  },
  { timestamps: true }
);

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ 'oauthProviders.providerId': 1 });

export default mongoose.models.User || mongoose.model('User', userSchema);
