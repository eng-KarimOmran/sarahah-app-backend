import connectDB from "./db/connectDB.js";
import globalErrorHandler from "./middleware/globalErrorHandler.middleware.js";
import authRouter from "./modules/auth/auth.controller.js";
import userRouter from "./modules/user/user.controller.js";

const bootstrap = async (app, express) => {
  const port = 3000;
  app.listen(port, () => console.log(`http://localhost:${port}`));
  app.use(express.json());
  await connectDB();
  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use(globalErrorHandler);
};

export default bootstrap;
