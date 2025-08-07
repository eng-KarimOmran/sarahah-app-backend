import { model, Schema } from "mongoose";

const schema = new Schema({
  passwordToken: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

const changePasswordModel = model("changePassword", schema);
export default changePasswordModel;
