import { model, Schema } from "mongoose";

const schema = new Schema({
  jti: {
    type: String,
    required: true,
    unique: true,
  },
  exp: {
    type: Date,
    required: true,
  },
});

const invalidTokenModel = model("invalidToken", schema);
export default invalidTokenModel;
