export const findOne = (model, filter) => {
  return model.findOne(filter);
};

export const create = (model, data) => {
  return model.create(data);
};

export const deleteMany = (model, filter) => {
  return model.deleteMany(filter);
};

export const updateOne = (model, filter, data) => {
  return model.updateOne(filter, data);
};

export const find = (model, filter) => {
  return model.find(filter);
};
