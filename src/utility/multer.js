import multer from "multer";
import createError from "./createError.js";

export const uploadTypes = {
  img: ["image/png", "image/jpeg"],
};

const upload = ({ formats = uploadTypes.img }) => {
  const storage = multer.diskStorage({
    destination: "src/temp",
    filename: function (req, file, cb) {
      const userId = req.user._id;
      const userName = req.user.fullName.split(" ").slice(0, 2).join("-");
      cb(null, `${userId}-${userName}-${file.originalname}`);
    },
  });

  const fileFilter = (req, file, cb) => {
    const types = formats.map((format) => format.split("/")[1]).join(" | ");

    if (!formats.includes(file.mimetype)) {
      return cb(
        createError({
          message: `Only ${types} image formats are allowed.`,
        }),
        false
      );
    }

    cb(null, true);
  };

  return multer({ storage, fileFilter });
};
export default upload;
