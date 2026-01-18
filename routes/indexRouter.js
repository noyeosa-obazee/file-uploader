import { Router } from "express";
import * as ctrl from "../controllers/appControllers.js";
import passport from "passport";
const indexRoute = Router();

indexRoute.get("/sign-up", ctrl.getSignUpForm);
indexRoute.post("/sign-up", ctrl.signUp);
indexRoute.get("/log-in", ctrl.getLogInForm);
indexRoute.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in",
  }),
);
indexRoute.get("/upload-file", ctrl.isAuth, ctrl.getFileUpload);
indexRoute.post("/upload-file", ctrl.isAuth, ctrl.uploadFile);
indexRoute.get("/", ctrl.isAuth, (req, res) => res.send("You are in!"));

export default indexRoute;
