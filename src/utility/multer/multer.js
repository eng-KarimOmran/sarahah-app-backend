import multer from "multer";
import fs from "fs";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const dest = `uploads/${req.user._id}`;
    const fullDest = path.resolve(".", dest);
    fs.mkdirSync(fullDest, { recursive: true });
    req.urlUpload = dest;
    callback(null, fullDest);
  },

  filename: (req, file, callback) => {
    const name = file.originalname;
    req.urlUpload += `/${name}`;
    callback(null, name);
  },
});

const uploadFile = () => {
  return multer({
    storage,
  });
};

export default uploadFile;