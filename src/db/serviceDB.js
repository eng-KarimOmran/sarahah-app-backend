import userModel from "./models/user.model.js";

export const findOne = async (model, filter) => {
  return await model.findOne(filter);
};

export const create = async (model, data) => {
  return await model.create(data);
};

export const deleteMany = async (model, filter) => {
  return await model.deleteMany(filter);
};

export const updateOne = async (model, filter, data) => {
  return await model.updateOne(filter, data);
};
