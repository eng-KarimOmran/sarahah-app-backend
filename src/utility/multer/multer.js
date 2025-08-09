import multer from "multer";

const storage = multer.diskStorage({
  destination: "FileStorage",
  filename: (req, file, callback) => {
    const name = file.originalname;
    callback(null, name);
  },
});

export const uploadFile = multer({ storage });
