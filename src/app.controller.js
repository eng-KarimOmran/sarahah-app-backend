import connectDB from "./DB/connectDB.js";
import handelGlobalError from "./Middlewares/handelGlobalError.js";
import authRouter from "./modules/auth/auth.controller.js";
import userRouter from "./modules/user/user.controller.js";

const bootstrap = async (express, app) => {
  app.use(express.json());
  await connectDB();
  app.use("/uploads", express.static("./uploads"));
  app.use("/auth", authRouter);
  app.use("/user", userRouter);

  app.use(handelGlobalError);
};

export default bootstrap;
