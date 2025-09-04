import { model, Schema } from "mongoose";

export const providerTypes = {
  system: "system",
  google: "google",
};

export const genderTypes = {
  male: "male",
  female: "female",
};

export const roleTypes = {
  user: "user",
  admin: "admin",
};

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      minlength: 2,
    },

    phone: {
      type: String,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    isConfirmedEmail: {
      type: Boolean,
      default: false,
    },

    gender: {
      type: String,
      enum: Object.values(genderTypes),
    },

    password: {
      type: String,
    },

    role: {
      type: String,
      enum: Object.values(roleTypes),
      default: roleTypes.user,
    },

    provider: {
      type: String,
      enum: Object.values(providerTypes),
      default: providerTypes.system,
    },

    birthDate: {
      type: Date,
    },

    lastSensitiveChange: {
      type: Date,
    },

    imgProfile: {
      publicId: String,
      url: String,
    },

    deleteAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const userModel = model("User", userSchema);
export default userModel;
