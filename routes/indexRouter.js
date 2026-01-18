import { Router } from "express";
import * as ctrl from "../controllers/appControllers.js";
import passport from "passport";
import multer from "multer";
const upload = multer({ dest: "../uploads/" });

const indexRoute = Router();

indexRoute.get("/sign-up", ctrl.getSignUpForm);
indexRoute.post("/sign-up", ctrl.signUp);
indexRoute.get("/log-in", ctrl.getLogInForm);
indexRoute.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/log-in",
  }),
);
indexRoute.get("/upload-file", ctrl.isAuth, ctrl.getFileUpload);
indexRoute.post(
  "/upload-file",
  ctrl.isAuth,
  upload.single("uploaded_file"),
  ctrl.uploadFile,
);
indexRoute.get("/dashboard", ctrl.isAuth, ctrl.displayDashboard);

export default indexRoute;
