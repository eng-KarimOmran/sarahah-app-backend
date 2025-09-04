import connectDB from "./db/connectDB.js";
import globalErrorHandler from "./middleware/globalErrorHandler.middleware.js";
import authRouter from "./modules/auth/auth.controller.js";
import messageRouter from "./modules/message/message.controller.js";
import userRouter from "./modules/user/user.controller.js";
import createSuccess from "./utility/createSuccess.js";

const bootstrap = async (app, express) => {
  const port = 3000;

  app.use(express.json());

  app.get("/", (req, res) => {
    return createSuccess(res, { message: "Hello server!" });
  });
  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/message", messageRouter);

  app.use(globalErrorHandler);

  await connectDB();

  app.listen(port, () =>
    console.log(`🚀 Server running on http://localhost:${port}`)
  );
};

export default bootstrap;